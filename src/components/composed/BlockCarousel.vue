<template>
	<Carousel v-model="index" :options="{ align: 'center', overscroll: true }" @start="start" @end="end" class="block-carousel">
		<BlockCard v-for="block in state" :key="block.node.id" :block="block" class="block fade-list-item box">
		
		</BlockCard>
	</Carousel>
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
query?.fetchQuery.query()

const start = (val: IntersectionObserverEntry) => val.isIntersecting && query?.fetchQuery.query()
const end = (val: IntersectionObserverEntry) => val.isIntersecting
</script>



<style>


.block {
	margin-top: var(--spacing);
	/*height: var(--current-vh);*/
	width: var(--current-vw);
	max-width: var(--column-width-small);
	/*padding: 0;*/
	display: inline-block;
}
</style>