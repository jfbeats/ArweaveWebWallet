<template>
	<div class="add-wallet">
		<div @click="create">Create</div>
		<div>Passphrase / Import</div>
		<div>Key file / Import</div>
		<div v-if="supportsWebUSB()" @click="importLedger">Ledger</div>
		<div v-else>Ledger not supported for this browser</div>
	</div>
</template>

<script>
import Ledger from '@/functions/Ledger.js'
import { newWallet, importWallet } from '@/functions/Wallets.js'

export default {
	methods: {
		async create () {
			const wallet = await newWallet()
			this.$router.push({ name: 'EditWallet', query: { wallet: wallet.id } })
		},
		async importLedger () {
			const wallet = await importWallet(Ledger)
			this.$router.push({ name: 'EditWallet', query: { wallet: wallet.id } })
		},
		supportsWebUSB () {
			return !!window.navigator.usb
		}
	},
}
</script>

<style scoped>
.add-wallet {
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-evenly;
}
</style>