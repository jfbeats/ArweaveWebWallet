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
			if (!view || view === 'received') { return this.wallet.received }
			if (view === 'sent') { return this.wallet.sent }
		}
	},
	watch: {
		wallet: {
			handler: function () {
				ArweaveStore.updateReceived(this.wallet)
				ArweaveStore.updateSent(this.wallet)
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
