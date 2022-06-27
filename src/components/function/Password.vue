<template>
	<Viewport :background="true">
		<div v-if="passwordRequest" class="password">
			<div class="card">
				<div class="background" />
				<div class="content flex-column">
					<div class="flex-row" style="justify-content: space-between;">
						<div></div>
						<WalletSelector @exit="reject" v-model="currentWalletId" />
					</div>
					<div class="flex-column">
						<Input v-if="passwordRequest.match" v-model="passwordMatch" type="password" placeholder="Confirm new password" :actions="passwordRequest.reason === 'match' ? [passwordAction] : undefined" :autofocus="passwordRequest.match ? 'true' : undefined" />
						<Input v-if="passwordRequest.reason !== 'match'" v-model="password" type="password" :placeholder="passwordRequest.match ? 'Current password' : 'Password'" :actions="[passwordAction]" :autofocus="passwordRequest.match ? undefined : 'true'" />
					</div>
				</div>
			</div>
		</div>
	</Viewport>
</template>



<script setup lang="ts">
import Viewport from '@/components/layout/Viewport.vue'
import Input from '@/components/atomic/Input.vue'
import { emitter, testPassword, PasswordRequest } from '@/functions/Password'
import { notify } from '@/store/NotificationStore'
import { computed, ref, watch } from 'vue'

import IconY from '@/assets/icons/y.svg?component'
import WalletSelector from '@/components/composed/WalletSelector.vue'

const passwordRequest = ref(undefined as undefined | PasswordRequest)
const currentWalletId = computed(() => passwordRequest.value?.wallet?.id)
emitter.on('password', callback => passwordRequest.value = callback)

const password = ref('')
const passwordMatch = ref('')
const passwordAction = computed(() => ({ run: submit, icon: IconY }))
const submit = async () => {
	if (passwordRequest.value?.match && passwordRequest.value.match !== passwordMatch.value) { return notify.error('New password does not match') }
	if (passwordRequest.value?.reason !== 'match') { try { await testPassword(password.value) } catch (e) { return notify.error(passwordRequest.value?.match ? 'Invalid current password' : 'Invalid') } }
	passwordRequest.value?.resolve(password.value)
	passwordRequest.value = undefined
}
const reject = () => {
	passwordRequest.value?.reject()
	passwordRequest.value = undefined
}
watch(passwordRequest, () => {
	password.value = ''
	passwordMatch.value = ''
})
</script>



<style scoped>
.password {
	display: flex;
	align-items: center;
	justify-content: center;
}

.card {
	height: 400px;
	display: flex;
	overflow: hidden;
}

.background {
	position: absolute;
	border-radius: inherit;
	inset: 0;
	/*background: url("@/assets/visual/security.jpg") no-repeat center center;*/
	background-size: cover;
	filter: saturate(0) contrast(0.7) brightness(0.3);
	top: -100px;
}

.content {
	flex: 1 1 0;
	position: relative;
	justify-content: space-between;
}

.input {
	width: 100%;
	background: var(--background2);
}
</style>