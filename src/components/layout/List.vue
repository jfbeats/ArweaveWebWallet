<template>
	<Observer class="list flex-column" @resize="setSize">
		<Observer @intersection="updateQuery" class="top" />
		<transition-group name="fade-list-rise">
			<component v-for="tx in txs" :[itemName]="tx.node" :key="tx.node.id" :is="component" v-bind="componentProps" class="fade-list-item" :class="[card && 'card']" />
		</transition-group>
		<LoaderBlock v-if="icon" :icon="icon" :minHeight="sizeCSS"  />
		<Observer @intersecting="fetchQuery" class="bottom" v-show="!fetchLoading && !completedQuery" />
	</Observer>
</template>



<script setup lang="ts">
import Observer from '@/components/function/Observer.vue'
import LoaderBlock from '@/components/layout/LoaderBlock.vue'
import { computed, ref } from 'vue'
import { ICON } from '@/store/Theme'

const props = defineProps<{
	query: any
	component: any
	itemName?: string
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
const itemName = computed(() => props.itemName ?? 'tx')
const size = ref(undefined as undefined | number)
const setSize = (e: ResizeObserverEntry) => {
	// resize observer loop limit exceeded?
	const el = e.target.parentElement
	if (!el) { return size.value = undefined }
	const style = getComputedStyle(e.target)
	const height = el.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom)
	size.value = height > 0 ? height : undefined
}
const sizeCSS = computed(() => size.value ? `${size.value - 1}px` : undefined)
const sizeObserversCSS = computed(() => size.value ? `${0.4 * size.value}px` : `calc(200px + 40vh)`)
</script>



<style scoped>
.list {
	/*background: var(--background);*/
	position: relative;
}

.top {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	width: 100%;
	height: v-bind(sizeObserversCSS);
	z-index: 1;
	pointer-events: none;
	touch-action: none;
}

.bottom {
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	width: 100%;
	height: v-bind(sizeObserversCSS);
	z-index: 1;
	pointer-events: none;
	touch-action: none;
}

.fade-list-item {
	width: 100%;
}
</style>