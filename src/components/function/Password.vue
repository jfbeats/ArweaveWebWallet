<template>
	<Viewport>
		<div v-if="active">
			<Input v-model="password" :actions="[passwordAction]" />
		</div>
	</Viewport>
</template>



<script setup lang="ts">
import Viewport from '@/components/layout/Viewport.vue'
import Input from '@/components/atomic/Input.vue'
import { emitter, testPassword } from '@/functions/Password'
import { notify } from '@/store/NotificationStore'
import { computed, ref } from 'vue'

import IconY from '@/assets/icons/y.svg?component'

const callbackRef = ref(undefined as undefined | ((arg: string) => void))
emitter.on('password', callback => {
	callbackRef.value = callback.resolve
	// callback.reason
})

const password = ref('')
const passwordAction = computed(() => ({ run: submit, icon: IconY }))
const active = computed(() => callbackRef.value != null)
const submit = async () => {
	try { await testPassword(password.value) } catch (e) { return notify.error('Invalid') }
	callbackRef.value?.(password.value)
	password.value = ''
	callbackRef.value = undefined
}
</script>