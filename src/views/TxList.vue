<template>
	<div class="txs">
		<Tabs query="view" :tabs="tabs" />
		<TxCard v-for="tx in txs" :key="tx.id" class="tx" :tx="tx" />
	</div>
</template>

<script>
import TxCard from '@/components/TxCard'
import Tabs from '@/components/atomic/Tabs'
import { ArweaveStore } from '@/store/ArweaveStore'

export default {
	components: { TxCard, Tabs },
	props: ['wallet'],
	data () {
		return {
			tabs: [
				{ name: 'Received', color: '#a3be8c' },
				{ name: 'Sent', color: '#bf616a'},
			]
		}
	},
	computed: {
		txs () {
			const view = this.$route.query.view
			if (!view || view === 'Received') { return ArweaveStore.currentWallet.received }
			if (view === 'Sent') { return ArweaveStore.currentWallet.sent }
		}
	},
	watch: {
		wallet: {
			handler: function () {
				ArweaveStore.updateReceived(ArweaveStore.currentWallet)
				ArweaveStore.updateSent(ArweaveStore.currentWallet)
			},
			immediate: true
		}
		
	}
}
</script>

<style scoped>
.txs {
	display: flex;
	flex-direction: column;
	gap: var(--spacing);
}

.tx {
	padding: var(--spacing);
	background: var(--background2);
	border-radius: var(--border-radius);
}
</style>
