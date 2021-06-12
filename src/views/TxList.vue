<template>
	<div class="txs">
		<Tabs query="view" :tabs="tabs" />
		<TxCard v-for="tx in txs" :key="tx.id" class="tx" :tx="tx" />
		<div ref="bottom" v-show="!loading && !completedQuery"></div>
	</div>
</template>

<script>
import TxCard from '@/components/TxCard'
import Tabs from '@/components/atomic/Tabs'
import { ArweaveStore } from '@/store/ArweaveStore'
import { computed, onMounted, onBeforeUnmount, ref, watch } from '@vue/runtime-core'
import { useRoute } from 'vue-router'

export default {
	components: { TxCard, Tabs },
	props: ['wallet'],
	setup (props) {
		let loading = ref(false)
		const bottom = ref(null)
		const route = useRoute()
		const selectedQuery = computed(() => route.query.view || 'received')
		const txs = computed(() => props.wallet?.queries[selectedQuery.value] || [])
		const completedQuery = computed(() => props.wallet?.queriesStatus[selectedQuery.value]?.completed)
		const updateQuery = async () => {
			if (loading.value) { return }
			console.log('Queried', selectedQuery.value)
			loading.value = true
			await ArweaveStore.fetchTransactions(props.wallet, selectedQuery.value)
			setTimeout(() => loading.value = false, 1000)
		}
		watch(() => route.query, () => {
			loading.value = true
			setTimeout(() => loading.value = false)
		})
		const observer = new IntersectionObserver((entries) => {
			if (entries[0].isIntersecting === true) { updateQuery() }
		}, { threshold: [0] })
		onMounted(() => { observer.observe(bottom.value) })
		onBeforeUnmount(() => { observer.unobserve(bottom.value) })
		return { loading, txs, completedQuery, bottom }
	},
	data () {
		return {
			tabs: [
				{ name: 'Received', color: '#a3be8c' },
				{ name: 'Sent', color: '#bf616a' },
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
