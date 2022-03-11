<template>
	<div class="block-carousel">
		<Carousel v-model="index" :options="{ align: 'center', overscroll: true, immediate: true }" @start="start" @end="end" class="block-carousel">
			<div v-for="block in state" :key="block.node.id" class="block fade-list-item">
				<BlockCard :block="block" class="box" />
			</div>
		</Carousel>
	</div>
</template>



<script setup lang="ts">
import Carousel from '@/components/layout/Carousel.vue'
import { ref, computed, watch } from 'vue'
import { getAccountByAddress } from '@/functions/Wallets'
import { arweaveQuery, arweaveQueryBlocks, queryAggregator } from '@/store/ArweaveStore'
import BlockCard from '@/components/composed/BlockCard.vue'

const index = ref(undefined as undefined | number)

const query = arweaveQueryBlocks({})
const state = computed(() => query.state.value && [...query.state.value].reverse())
watch(state, (state, oldState) => !oldState?.length && state?.length && (index.value = state.length - 1))

const start = (val: IntersectionObserverEntry) => val.isIntersecting && query?.fetchQuery.query()
const end = (val: IntersectionObserverEntry) => val.isIntersecting
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

.box {
	flex: 1 1 0;
}
</style>