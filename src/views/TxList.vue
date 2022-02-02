<template>
	<div class="tx-list flex-column">
		<Tabs queryName="view" :tabs="tabs" />
		<TransitionsManager :vector="transitionFactor" axis="x">
			<div class="flex-column" :key="selectedQuery">
				<transition-group name="fade-list-rise">
					<TxCard class="card fade-list-item" v-for="tx in txs" :key="tx.node.id" :tx="tx.node" :currentAddress="wallet.key" />
				</transition-group>
				<div v-if="!completedQuery" class="loader-container">
					<Icon icon="loader" />
				</div>
				<Observer observe="intersection" @intersection="fetchQuery" class="bottom" v-show="!fetchLoading && !completedQuery" />
			</div>
		</TransitionsManager>
	</div>
</template>



<script setup lang="ts">
import TxCard from '@/components/composed/TxCard.vue'
import Tabs from '@/components/atomic/Tabs.vue'
import Observer from '@/components/function/Observer.vue'
import Icon from '@/components/atomic/Icon.vue'
import TransitionsManager from '@/components/visual/TransitionsManager.vue'
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps<{ wallet: Account }>()

const fetchLoading = computed(() => props.wallet?.queries?.[selectedQuery.value].fetchQuery.queryStatus.running)
const route = useRoute()
const selectedQuery = computed(() => (route.query.view || 'received') as 'received' | 'sent')
const txs = computed(() => props.wallet?.queries?.[selectedQuery.value].updateQuery.state.value || [])
const completedQuery = computed(() => props.wallet?.queries?.[selectedQuery.value].status?.completed)
const fetchQuery = async () => {
	if (fetchLoading.value) { return }
	console.log('Queried', selectedQuery.value)
	await props.wallet?.queries?.[selectedQuery.value].fetchQuery.query()
}
const tabs = [
	{ name: 'All', color: 'var(--orange)' },
	{ name: 'Received', color: 'var(--green)' },
	{ name: 'Sent', color: 'var(--red)' },
]
const transitionFactor = ref(undefined as undefined | number)
watch(() => selectedQuery.value, (state, prevState) => {
	const toIndex = tabs.findIndex(el => el.name.toLowerCase() === state)
	const fromIndex = tabs.findIndex(el => el.name.toLowerCase() === prevState)
	transitionFactor.value = toIndex - fromIndex
})
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
