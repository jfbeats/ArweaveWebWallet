<template>
	<div>
		<div class="wallet">
			<Balance class="balance" :wallet="ArweaveStore.currentWallet" />
			<TxList class="history" :txs="txs" />
		</div>
	</div>
</template>

<script>
import Balance from '@/components/Balance'
import TxList from '@/components/TxList'
import { ArweaveStore } from '@/store/ArweaveStore'

export default {
	name: 'Wallet',
	components: {
		Balance,
		TxList,
	},
	setup () {
		return { ArweaveStore }
	},
	watch: {
		'$route.query.wallet': {
			handler: function (walletId) {
				const wallet = ArweaveStore.getWalletById(walletId)
				if (!wallet) { ArweaveStore.setCurrentWallet(ArweaveStore.wallets[0]) }
				else { ArweaveStore.setCurrentWallet(wallet) }
				ArweaveStore.updateReceived(ArweaveStore.currentWallet)
				ArweaveStore.updateSent(ArweaveStore.currentWallet)
			},
			immediate: true
		},
	},
	computed: {
		txs () {
			const view = this.$route.query.view
			if (!view || view === 'Received') { return ArweaveStore.currentWallet.received }
			if (view === 'Sent') { return ArweaveStore.currentWallet.sent }
		}
	},
}
</script>

<style scoped>
.wallet {
	display: flex;
	justify-content: center;
	align-items: flex-start;
	flex-wrap: wrap;
	gap: var(--spacing);
	padding: var(--spacing);
}

.balance {
	flex: 1 1 auto;
	min-width: 0;
}

.history {
	flex: 1.2 1 auto;
	min-width: 0;
}
</style>