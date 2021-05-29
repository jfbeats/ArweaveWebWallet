<template>
	<div class="edit-wallet">
		<WalletOptions class="wallet-options" v-for="wallet in wallets" :key="wallet.id" :wallet="wallet" />
	</div>
</template>

<script>
import WalletOptions from '@/components/WalletOptions'
import { ArweaveStore } from '@/store/ArweaveStore'

export default {
	components: { WalletOptions },
	computed: {
		wallets () {
			const editWallet = this.$route.query.wallet
			if (Array.isArray(editWallet)) {
				const wallets = []
				for (const wallet of editWallet) { wallets.push(ArweaveStore.getWalletById(wallet)) }
				return wallets
			} else if (editWallet) {
				return [ArweaveStore.getWalletById(editWallet)]
			} else {
				return
			}
		},
	},
}
</script>

<style scoped>
.edit-wallet {
	display: flex;
	flex-direction: column;
	gap: var(--spacing);
	background: var(--background2);
}

.wallet-options {
	padding: var(--spacing);
	background: var(--background2);
	border-radius: var(--border-radius);
}


</style>