<template>
	<Viewport :background="true">
		<Observer v-if="passwordRequest" class="password" @resize="size = $event">
			<div class="card" :class="{ fill }">
				<div class="background">
					<SecurityVisual class="background-content" />
				</div>
				<div class="content flex-column">
					<div class="flex-row" style="justify-content: space-between;">
						<div></div>
						<WalletSelector @exit="() => reject('Password not provided')" v-model="currentWalletId" :active="true" />
					</div>
					<div class="flex-column">
						<Input v-for="input in inputs" v-model="input.model.value" v-bind="input.bind" type="password" />
					</div>
				</div>
				<OverlayPrompt :options="newPasswordMessage" autofocus />
			</div>
		</Observer>
	</Viewport>
</template>



<script setup lang="ts">
import Viewport from '@/components/layout/Viewport.vue'
import Input from '@/components/form/Input.vue'
import SecurityVisual from '@/components/visual/SecurityVisual.vue'
import WalletSelector from '@/components/composed/WalletSelector.vue'
import OverlayPrompt from '@/components/layout/OverlayPrompt.vue'
import Observer from '@/components/function/Observer.vue'
import { emitter, testPassword, PasswordRequest, hasPassword, passwordValidation } from '@/functions/Password'
import { focusWindow } from '@/functions/Connect'
import { notify } from '@/store/NotificationStore'
import { computed, markRaw, Ref, ref, shallowRef, watch } from 'vue'

import IconY from '@/assets/icons/y.svg?component'
import IconShieldWarning from '@/assets/icons/shield_warning.svg?component'

const passwordRequest = shallowRef(undefined as undefined | PasswordRequest)
const currentWalletId = computed(() => passwordRequest.value?.wallet?.id)
const inputs = computed(() => {
	type InputParams = {
		model: Ref<string>
		bind: { placeholder?: string, autofocus?: true, submit?: Action }
	}
	let match = undefined as undefined | InputParams
	let result = undefined as undefined | InputParams
	if (passwordRequest.value?.match || passwordRequest.value?.reason === 'new') { match = { model: passwordMatch, bind: {} } }
	if (passwordRequest.value?.reason !== 'match') { result = { model: password, bind: {} } }
	if (match) {
		if (passwordRequest.value?.reason === 'new') { match.bind.placeholder = 'New password' }
		else { match.bind.placeholder = passwordRequest.value?.match ? 'Confirm new password' : 'Password' }
	}
	if (result) {
		if (passwordRequest.value?.reason === 'new') { result.bind.placeholder = 'Confirm new password' }
		else { result.bind.placeholder = passwordRequest.value?.match ? 'Old password' : 'Password' }
	}
	const a = [match, result]
	if (!newPasswordMessage.value) { a.find(e => e)!.bind.autofocus = true }
	a.map(e => e).reverse().find(e => e)!.bind.submit = passwordAction.value
	return a.filter((e): e is NonNullable<typeof e> => !!e)
})
emitter.on('password', callback => {
	passwordRequest.value = callback
	focusWindow()
})

const password = ref('')
const passwordMatch = ref('')
const passwordAction = computed(() => ({ run: submit, icon: IconY }))
const submit = async () => {
	if (passwordRequest.value?.match && passwordRequest.value.match !== passwordMatch.value) { return notify.error('New password does not match') }
	if (passwordRequest.value?.reason === 'new') {
		if (passwordMatch.value !== password.value) { return notify.error('New password does not match') }
		passwordValidation(password.value)
	}
	else if (passwordRequest.value?.reason !== 'match') { try { await testPassword(password.value) } catch (e) { return notify.error(passwordRequest.value?.match ? 'Invalid current password' : 'Invalid') } }
	passwordRequest.value?.resolve(password.value)
	passwordRequest.value = undefined
}
const reject = (error: string) => {
	passwordRequest.value?.reject(error)
	passwordRequest.value = undefined
}
watch(passwordRequest, () => {
	password.value = ''
	passwordMatch.value = ''
})

const size = ref(undefined as undefined | ResizeObserverEntry)
const fill = computed(() => {
	if (!size.value) { return false }
	const { width, height } = size.value.contentRect
	return height < 700 && width < 500
})
const newPasswordMessage = ref(!hasPassword.value && { icon: markRaw(IconShieldWarning), message: 'Always make sure that you have a working backup of your private keys. You will not be able to recover the ones that are encrypted if you forget your password', action: { run: () => newPasswordMessage.value = undefined } } || undefined)
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
	background: var(--background);
}

.card.fill {
	height: 100%;
	width: 100%;
	border-radius: 0;
}

.background {
	position: absolute;
	border-radius: inherit;
	opacity: 0.5;
	inset: 0;
	display: flex;
	justify-content: center;
	align-items: center;
}

.background-content {
	position: absolute;
	height: 400px;
	padding-bottom: 24px;
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