<template>
	<Viewport>
		<div v-if="passwordRequest" class="password">
			<div class="card">
				<OverlayPrompt :inline="true" :options="{ icon: IconLock }">
					<Input v-if="passwordRequest.match" v-model="passwordMatch" type="password" placeholder="Confirm new password" :actions="[passwordAction]" :autofocus="passwordRequest.match ? 'true' : undefined" />
					<Input v-if="passwordRequest.reason !== 'match'" v-model="password" type="password" :placeholder="passwordRequest.match ? 'Current password' : 'Password'" :actions="[passwordAction]" :autofocus="passwordRequest.match ? undefined : 'true'" />
				</OverlayPrompt>
<!--				cancel -->
			</div>
		</div>
	</Viewport>
</template>



<script setup lang="ts">
import Viewport from '@/components/layout/Viewport.vue'
import OverlayPrompt from '@/components/layout/OverlayPrompt.vue'
import Input from '@/components/atomic/Input.vue'
import { emitter, testPassword, PasswordRequest } from '@/functions/Password'
import { notify } from '@/store/NotificationStore'
import { computed, ref, watch } from 'vue'

import IconY from '@/assets/icons/y.svg?component'
import IconLock from '@/assets/icons/person.svg?component'

const passwordRequest = ref(undefined as undefined | PasswordRequest)
emitter.on('password', callback => passwordRequest.value = callback)

const password = ref('')
const passwordMatch = ref('')
const passwordAction = computed(() => ({ run: submit, icon: IconY }))
const submit = async () => {
	if (passwordRequest.value?.match && passwordRequest.value.match !== passwordMatch.value) { return notify.error('Does not match') }
	if (passwordRequest.value?.reason !== 'match') { try { await testPassword(password.value) } catch (e) { return notify.error('Invalid') } }
	passwordRequest.value?.resolve(password.value)
	passwordRequest.value = undefined
}
const reject = () => passwordRequest.value?.reject() // todo
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
	background: #00000088;
}
</style>