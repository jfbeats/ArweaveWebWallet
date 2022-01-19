<template>
	<div class="connection-card flex-column no-scrollbar">
		<button v-for="method in methods" :key="method" class="row method" @click="setMethod(method)">
			<div>{{ displayKeys[method] || method }}</div>
			<TransitionsManager :vector="walletSettings[method] ? 1 : -1" axis="y">
				<div :key="walletSettings[method]">{{ walletSettings[method] ? 'Allow' : 'Ask' }}</div>
			</TransitionsManager>
		</button>
	</div>
</template>



<script setup lang="ts">
import { getWalletById } from '@/functions/Wallets'
import { computed, ref, watch } from 'vue'
import IconConnection from '@/assets/icons/connection.svg?component'
import { ChannelRef } from '@/functions/Channels'
import TransitionsManager from '@/components/visual/TransitionsManager.vue'

const props = defineProps<{ state: ConnectorState, walletId?: string }>()

const displayKeys = {
	connect: 'Connect automatically',
	signTransaction: 'Sign transaction',
	getPublicKey: 'Share public key',
	sign: 'Sign arbitrary data',
	decrypt: 'Decrypt data',
	getArweaveConfig: 'Share arweave gateway configuration',
} as const

const getInstanceProperties = (wallet?: Provider) => Object.getOwnPropertyNames(Object.getPrototypeOf(wallet?.messageRunner || {})).filter(prop =>
	!wallet?.messageRunner.getMethodMetadata(prop)?.unavailable
	&& !wallet?.messageRunner.getMethodMetadata(prop)?.userIntent
	&& prop !== 'constructor' && prop !== 'getMethodMetadata')
const wallet = computed(() => getWalletById(props.walletId))
const methods = computed(() => [...getInstanceProperties(wallet.value)]) // 'connect' in here?
const setMethod = (method: string) => walletSettings.value && (walletSettings.value[method] = !walletSettings.value[method])
const channel = new ChannelRef('connectionSettings:', props.state.origin, {})
const walletSettings = ref(undefined as undefined | { [method: string]: any })
watch(wallet, w => {
	if (!w?.uuid) { return }
	channel.state.value ||= {}
	walletSettings.value = channel.state.value[w.uuid] ||= {}
	console.log(walletSettings.value)
}, { immediate: true })
</script>



<style scoped>
.row {
	display: flex;
	justify-content: space-between;
}
</style>