<template>
	<div class="list flex-column">
		<transition-group name="fade-list-rise">
			<component v-for="tx in txs" :tx="tx.node" :key="tx.node.id" :is="component" v-bind="componentProps" class="fade-list-item" :class="[card && 'card']" />
		</transition-group>
		<div v-if="txs && !txs.length && completedQuery" class="loader-container">
			<Icon :icon="IconNoResult" />
		</div>
		<div v-else-if="!completedQuery" class="loader-container">
			<Icon icon="loader" />
		</div>
		<Observer @intersection="val => val.isIntersecting && fetchQuery()" class="bottom" v-show="!fetchLoading && !completedQuery" />
	</div>
</template>



<script setup lang="ts">
import Observer from '@/components/function/Observer.vue'
import Icon from '@/components/atomic/Icon.vue'
import { computed } from 'vue'

import IconNoResult from '@/assets/icons/no_result.svg?component'

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
</script>



<style scoped>
.list {
	/*background: var(--background);*/
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
	font-size: 4em;
	color: #ffffff66;
}
</style>