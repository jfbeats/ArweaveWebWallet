<template>
	<div class="list flex-column">
		<Observer @intersection="updateQuery" class="top" />
		<transition-group name="fade-list-rise">
			<component v-for="tx in txs" :tx="tx.node" :key="tx.node.id" :is="component" v-bind="componentProps" class="fade-list-item" :class="[card && 'card']" />
		</transition-group>
		<LoaderBlock v-if="icon" :icon="icon" />
		<Observer @intersecting="fetchQuery" class="bottom" v-show="!fetchLoading && !completedQuery" />
	</div>
</template>



<script setup lang="ts">
import Observer from '@/components/function/Observer.vue'
import LoaderBlock from '@/components/layout/LoaderBlock.vue'
import { computed } from 'vue'
import { ICON } from '@/store/Theme'

const props = defineProps<{
	query: any
	component: any
	componentProps?: object
	card?: any
}>()

const fetchLoading = computed(() => props.query.fetchQuery.queryStatus.running)
const txs = computed(() => props.query.updateQuery.state.value || props.query.updateQuery.state || [])
const completedQuery = computed(() => props.query.status?.completed)
const fetchQuery = () => props.query.fetchQuery.query()
const updateQuery = (e: IntersectionObserverEntry) => { props.query.refreshSwitch.value = e.isIntersecting }
const icon = computed(() => {
	if (txs.value && !txs.value.length && completedQuery.value) return ICON.noResult
	if (!completedQuery.value) return 'loader'
})
</script>



<style scoped>
.list {
	/*background: var(--background);*/
	position: relative;
}

.top {
	position: absolute;
	top: 0;
	width: 100%;
	height: calc(200px + 40vh);
	z-index: 1;
	pointer-events: none;
	touch-action: none;
}

.bottom {
	position: absolute;
	bottom: 0;
	width: 100%;
	height: calc(200px + 40vh);
	z-index: 1;
	pointer-events: none;
	touch-action: none;
}

.fade-list-item {
	width: 100%;
}
</style>