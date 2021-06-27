<template>
	<div class="edit-wallet">
		<h2>Edit New Wallets</h2>
		<WalletOptions class="wallet-options" v-for="wallet in wallets" :key="wallet.id" :wallet="wallet" />
	</div>
</template>

<script>
import WalletOptions from '@/components/WalletOptions'
import { getWalletById } from '@/store/ArweaveStore'

export default {
	components: { WalletOptions },
	computed: {
		wallets () {
			const editWallet = this.$route.query.wallet
			const editWalletArray = Array.isArray(editWallet) ? editWallet : [editWallet]
			const result = []
			for (const wallet of editWalletArray) {
				const walletObject = getWalletById(wallet)
				if (walletObject) { result.push(walletObject) }
			}
			return result
		},
	},
}
</script>

<style scoped>
.edit-wallet {
	padding: 32px;
}

.wallet-options {
	padding: var(--spacing);
	background: var(--background2);
	border-radius: var(--border-radius);
}
</style>