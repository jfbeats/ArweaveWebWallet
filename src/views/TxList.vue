<template>
	<div class="tx-list flex-column">
		<Tabs query="view" :tabs="tabs" />
		<transition :name="transitionName" mode="out-in">
			<div class="list flex-column" :key="selectedQuery">
				<transition-group name="fade-list">
					<TxCard class="card fade-list-item" v-for="tx in txs" :key="tx.node.id" :tx="tx.node" />
				</transition-group>
				<div v-if="!completedQuery" class="loader-container">
					<div class="loader" />
				</div>
				<Observer @intersection="fetchQuery" class="bottom" v-show="!fetchLoading && !completedQuery" />
			</div>
		</transition>
	</div>
</template>

<script>
import TxCard from '@/components/TxCard'
import Tabs from '@/components/atomic/Tabs'
import Observer from '@/components/function/Observer.vue'
import { fetchTransactions, updateTransactions } from '@/store/ArweaveStore'
import { computed, onMounted, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

export default {
	components: { TxCard, Tabs, Observer },
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

.list {
	position: relative;
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
}

.loader,
.loader:after {
	border-radius: 50%;
	width: 64px;
	height: 64px;
}

.loader {
	border: 4px solid #ffffff11;
	border-top: 4px solid #ffffff33;
	animation: loader-animation 2s infinite linear;
}

@keyframes loader-animation {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}

.fade-appear-enter-active {
	transition: opacity 0.8s ease;
}

.fade-appear-enter-from {
	opacity: 0;
}
</style>
