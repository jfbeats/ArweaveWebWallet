<template>
	<div class="tx-list">
		<Tabs query="view" :tabs="tabs" />
		<transition :name="transitionName" mode="out-in">
			<div class="list" :key="selectedQuery">
				<transition-group name="fade-list">
					<TxCard class="card fade-list-item" v-for="tx in txs" :key="tx.node.id" :tx="tx.node" />
				</transition-group>
			</div>
		</transition>
		<div ref="bottom" class="bottom" v-show="!loading && !completedQuery"></div>
	</div>
</template>

<script>
import TxCard from '@/components/TxCard'
import Tabs from '@/components/atomic/Tabs'
import { fetchTransactions, updateTransactions } from '@/store/ArweaveStore'
import { computed, onMounted, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

export default {
	components: { TxCard, Tabs },
	props: ['wallet'],
	setup (props) {
		let loading = ref(false)
		let liveUpdate
		const bottom = ref(null)
		const route = useRoute()
		const selectedQuery = computed(() => route.query.view || 'received')
		const txs = computed(() => props.wallet?.queries[selectedQuery.value] || [])
		const completedQuery = computed(() => props.wallet?.queriesStatus?.[selectedQuery.value]?.completed)
		const updateQuery = async () => {
			if (loading.value) { return }
			console.log('Queried', selectedQuery.value)
			loading.value = true
			await fetchTransactions(props.wallet, selectedQuery.value)
			setTimeout(() => loading.value = false, 500)
		}
		watch(() => route.query, () => {
			loading.value = true
			setTimeout(() => loading.value = false)
		})
		const observer = new IntersectionObserver((entries) => {
			if (entries[0].isIntersecting === true) { updateQuery() }
		}, { threshold: [0] })
		onMounted(() => {
			observer.observe(bottom.value)
			liveUpdate = setInterval(() => updateTransactions(props.wallet, selectedQuery.value), 10000)
		})
		onBeforeUnmount(() => {
			observer.unobserve(bottom.value)
			clearInterval(liveUpdate)
		})
		const tabs = [
			{ name: 'Received', color: '#a3be8c' },
			{ name: 'Sent', color: '#bf616a' },
		]
		const transitionName = ref(null)
		watch(() => selectedQuery.value, (state, prevState) => {
			const toIndex = tabs.findIndex(el => el.name.toLowerCase() === state)
			const fromIndex = tabs.findIndex(el => el.name.toLowerCase() === prevState)
			transitionName.value = toIndex < fromIndex ? 'slide-right' : 'slide-left'
		})
		return { loading, txs, completedQuery, bottom, selectedQuery, transitionName, tabs }
	},
}
</script>

<style scoped>
.tx-list {
	display: flex;
	flex-direction: column;
	gap: var(--spacing);
	position: relative;
}

.tabs {
	z-index: 1;
}

.list {
	display: flex;
	flex-direction: column;
	gap: var(--spacing);
	position: relative;
}

.bottom {
	position: absolute;
	bottom: 0;
	width: 100%;
	height: 200px;
}
</style>
