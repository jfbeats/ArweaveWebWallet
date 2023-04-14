<template>
	<div class="block-carousel">
		<Carousel :index="index" @index="onIndex = $event" :options="{ align: 'center', overscroll: true, immediate: true }" @start="start" @end="end" class="block-carousel">
			<div v-for="block in state" :key="block.node.id" class="block fade-list-item" :class="{ active: height && height == block.node.height }">
				<BlockCard :block="block" class="box" />
			</div>
			<div v-if="canMine && state?.length" class="block fade-list-item box flex-column" style="align-items: center; justify-content: center">
				<Icon :icon="ICON.cube" style="font-size: 4em; opacity: 0.8;" />
				<Button @click="mine">Mine new block</Button>
			</div>
		</Carousel>
	</div>
</template>



<script setup lang="ts">
import Carousel from '@/components/layout/Carousel.vue'
import Icon from '@/components/atomic/Icon.vue'
import { ICON } from '@/store/Theme'
import { ref, computed, watch } from 'vue'
import ArweaveStore, { arweaveQueryBlocks, networkInfo } from '@/store/ArweaveStore'
import BlockCard from '@/components/composed/BlockCard.vue'
import Button from '@/components/atomic/Button.vue'

const props = defineProps<{
	height?: number | string
	onHeight?: number | string
}>()
const emit = defineEmits<{
	(e: 'height', val: number | string): void
}>()

const index = ref(undefined as undefined | number)
const onIndex = ref(undefined as undefined | number)
const query = arweaveQueryBlocks({})
const state = computed(() => query.state.value && [...query.state.value].reverse())
watch(onIndex, i => i != null && state.value?.[i] && emit('height', state.value?.[i].node.height))
watch(state, (state, oldState) => {
	if (!state) { return }
	if (!oldState?.length && state.length) { index.value = state.length - 1 }
	if (oldState && oldState.length !== state.length && onIndex.value === oldState.length - 1) { setTimeout(() => index.value = state.length - 1, 1000) }
})

const canMine = computed(() => networkInfo.value?.network?.includes('arlocal'))
const mine = async () => {
	await fetch(ArweaveStore.gatewayURL + 'mine')
	await query.updateQuery.getState(true)
	setTimeout(() => index.value = state.value!.length - 1, 1000)
}

const start = (val: IntersectionObserverEntry) => val.isIntersecting && query?.fetchQuery.query()
const end = (val: IntersectionObserverEntry) => query.refreshSwitch.value = val.isIntersecting
</script>



<style>
.block-carousel {
	display: flex;
	justify-content: stretch;
	flex-direction: column;
	min-height: 500px;
	width: 100%;
}

.carousel {
	height: 100%;
	flex: 1 1 0;
}

.block {
	padding-top: var(--spacing);
	height: 100%;
	width: var(--current-vw);
	max-width: var(--column-width-small);
	/*padding: 0;*/
	display: inline-flex;
	flex-direction: column;
}

.block > *::before {
	content: '';
	position: absolute;
	top: 0;
	height: 2px;
	background: var(--orange);
	left: 0;
	right: 0;
	opacity: 0;
	transition: 2s ease;
    outline: 0.5px solid var(--border);
	overflow: visible;
}

.block.active > *::before {
	opacity: 0.6;
}

.box {
	flex: 1 1 0;
}
</style>