<template>
	<div class="connection-card flex-column no-scrollbar">
		<div key="connect">{{ displayKeys.connect }}</div>
		<div v-for="method in methods" :key="method">{{ displayKeys[method] }}</div>
	</div>
</template>



<script setup lang="ts">
import { getWalletById } from '@/functions/Wallets'
import { computed, ref, toRef, watch } from 'vue'
import IconConnection from '@/assets/icons/connection.svg?component'

const props = defineProps<{ walletId?: string }>()

const displayKeys = {
	connect: 'Connect automatically',
	signTransaction: 'Sign transaction',
	getPublicKey: 'Share public key',
	sign: 'Sign arbitrary data',
	decrypt: 'Decrypt data',
	getArweaveConfig: 'Share arweave gateway configuration',
} as const

const getInstanceProperties = (instance: any) => Object.getOwnPropertyNames(Object.getPrototypeOf(instance)).filter(prop => instance[prop] && prop !== 'constructor')
const wallet = computed(() => getWalletById(props.walletId))
const methods = computed(() => getInstanceProperties(wallet.value?.messageRunner))


</script>



<style scoped>

</style>