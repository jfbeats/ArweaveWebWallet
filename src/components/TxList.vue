<template>
	<div class="txs">
		<Tabs query="view" :tabs="tabs" />
		<TxCard v-for="tx in txs" :key="tx.id" class="tx" :tx="tx" />
	</div>
</template>

<script>
import TxCard from '@/components/TxCard'
import Tabs from '@/components/atomic/Tabs'

export default {
	components: { TxCard, Tabs },
	props: ['txs'],
	data () {
		return {
			tabs: [
				{ name: 'Received', color: '#a3be8c' },
				{ name: 'Sent', color: '#bf616a'},
			]
		}
	},
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
