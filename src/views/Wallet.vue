<template>
	<div class="container">
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
.container {
	display: flex;
	justify-content: center;
	background: url("/background.svg");
	background-repeat: no-repeat;
	background-attachment: fixed;
	background-position: center;
	background-size: cover;
}

.wallet {
	flex: 1 1 0;
	min-width: 400px;
	height: fit-content;
	max-width: 1700px;
	display: flex;
	justify-content: center;
	align-items: flex-start;
	flex-wrap: wrap;
	gap: var(--spacing);
	padding: var(--spacing);
}

.balance {
	flex: 1 1 400px;
	min-width: 0;
}

.history {
	flex: 1.2 1 500px;
	min-width: 0;
}
</style>