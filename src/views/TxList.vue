<template>
	<div class="tx-list flex-column">
		<Tabs queryName="view" :tabs="tabs" />
		<transition :name="transitionName" mode="out-in">
			<div class="flex-column" :key="selectedQuery">
				<transition-group name="fade-list">
					<TxCard class="card fade-list-item" v-for="tx in txs" :key="tx.node.id" :tx="tx.node" />
				</transition-group>
				<div v-if="!completedQuery" class="loader-container">
					<Icon icon="loader" />
				</div>
				<Observer observe="intersection" @intersection="fetchQuery" class="bottom" v-show="!fetchLoading && !completedQuery" />
			</div>
		</transition>
	</div>
</template>

<script>
import TxCard from '@/components/TxCard.vue'
import Tabs from '@/components/atomic/Tabs.vue'
import Observer from '@/components/function/Observer.vue'
import Icon from '@/components/atomic/Icon.vue'
import { fetchTransactions, updateTransactions } from '@/store/ArweaveStore'
import { computed, onMounted, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

export default {
	components: { TxCard, Tabs, Observer, Icon },
	props: ['wallet'],
	setup (props) {
		const fetchLoading = computed(() => props.wallet?.queriesStatus?.[selectedQuery.value]?.fetchTransactions)
		let liveUpdate
		const route = useRoute()
		const selectedQuery = computed(() => route.query.view || 'all')
		const txs = computed(() => props.wallet?.queries?.[selectedQuery.value] || [])
		const completedQuery = computed(() => props.wallet?.queriesStatus?.[selectedQuery.value]?.completed)
		const updateContent = () => updateTransactions(props.wallet, selectedQuery.value)
		const fetchQuery = async () => {
			if (fetchLoading.value) { return }
			console.log('Queried', selectedQuery.value)
			await fetchTransactions(props.wallet, selectedQuery.value)
		}
		onMounted(() => {
			liveUpdate = setInterval(updateContent, 10000)
			updateContent()
		})
		onBeforeUnmount(() => {
			clearInterval(liveUpdate)
		})
		const tabs = [
			{ name: 'All', color: 'var(--orange)' },
			{ name: 'Received', color: 'var(--green)' },
			{ name: 'Sent', color: 'var(--red)' },
		]
		const transitionName = ref(null)
		watch(() => selectedQuery.value, (state, prevState) => {
			const toIndex = tabs.findIndex(el => el.name.toLowerCase() === state)
			const fromIndex = tabs.findIndex(el => el.name.toLowerCase() === prevState)
			transitionName.value = toIndex < fromIndex ? 'slide-right' : 'slide-left'
			setTimeout(() => {
				clearInterval(liveUpdate)
				liveUpdate = setInterval(updateContent, 10000)
				updateContent()
			})
		})
		return { fetchQuery, fetchLoading, txs, completedQuery, selectedQuery, transitionName, tabs }
	},
}
</script>

<style scoped>
.tx-list {
	position: relative;
}

.tabs {
	z-index: 1;
}

.bottom {
	position: absolute;
	bottom: 0;
	width: 100%;
	height: calc(200px + 40vh);
}

.loader-container {
	min-height: 40vh;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 4em;
	color: #ffffff66;
}

.fade-appear-enter-active {
	transition: opacity 0.8s ease;
}

.fade-appear-enter-from {
	opacity: 0;
}
</style>
