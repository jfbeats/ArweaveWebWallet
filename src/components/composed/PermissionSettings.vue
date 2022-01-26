<template>
	<div class="flex-column no-scrollbar">
		<button v-for="method in methods" :key="method.name" :disabled="method.disabled" class="row method" @click="setMethod(method.name)">
			<div>{{ method.displayName }}</div>
			<TransitionsManager :vector="walletSettings[method.name] ? 1 : -1" axis="y">
				<div :key="walletSettings[method.name]">{{ walletSettings[method.name] ? 'Allow' : 'Ask' }}</div>
			</TransitionsManager>
		</button>
		<TransitionsManager>
			<Button v-if="changed" @click="applySettings()">
				Apply
			</Button>
		</TransitionsManager>
	</div>
</template>



<script setup lang="ts">
import Button from '@/components/atomic/Button.vue'
import { getWalletById } from '@/functions/Wallets'
import { computed, ref, watch } from 'vue'
import IconConnection from '@/assets/icons/connection.svg?component'
import { useChannel } from '@/functions/Channels'
import TransitionsManager from '@/components/visual/TransitionsManager.vue'

const props = defineProps<{ state: ConnectorState, walletId?: string }>()

const displayKeys = {
	connect: 'Connect automatically',
	signTransaction: 'Sign transaction',
	getPublicKey: 'Share public key',
	sign: 'Sign arbitrary data',
	decrypt: 'Decrypt data',
	getArweaveConfig: 'Share arweave gateway configuration',
} as { [key: string]: string | undefined }

const getInstanceProperties = (wallet?: Provider) => Object.getOwnPropertyNames(Object.getPrototypeOf(wallet?.messageRunner || {}))
	.filter(prop => !wallet?.messageRunner.getMethodMetadata(prop)?.unavailable && prop !== 'constructor' && prop !== 'getMethodMetadata')
	.map(prop => ({
		name: prop,
		displayName: displayKeys[prop] || prop,
		disabled: wallet?.messageRunner.getMethodMetadata(prop)?.userIntent
	}))
const wallet = computed(() => getWalletById(props.walletId))
const methods = computed(() => [...getInstanceProperties(wallet.value)]) // 'connect' in here?
const setMethod = (method: string) => walletSettings.value && (walletSettings.value[method] = !walletSettings.value[method])
const channel = useChannel('connectionSettings:', props.state.origin, {})
const walletSettings = ref(undefined as undefined | { [method: string]: any })
const initialWalletSettings = ref(undefined as undefined | { [method: string]: any })
watch(wallet, w => {
	if (!w?.uuid) { return }
	channel.state.value ||= {}
	initialWalletSettings.value = channel.state.value[w.uuid] ||= {}
	walletSettings.value = { ...initialWalletSettings.value }
}, { immediate: true })
const isChanged = ([method, value]: [string, any]) => {
	const initial = initialWalletSettings.value?.[method] || false
	if (value !== initial) { return true }
}
const changed = computed(() => {
	if (!walletSettings.value) { return false }
	return Object.entries(walletSettings.value).find(isChanged)
})
const applySettings = () => {
	if (!walletSettings.value || !initialWalletSettings.value) { return false }
	Object.entries(walletSettings.value).filter(isChanged)
		.forEach(([method, value]) => initialWalletSettings.value && (initialWalletSettings.value[method] = value))
}
</script>



<style scoped>
.row {
	display: flex;
	justify-content: space-between;
}

button:disabled {
	opacity: var(--element-disabled-opacity)
}
</style>