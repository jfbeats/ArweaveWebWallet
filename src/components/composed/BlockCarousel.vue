<template>
	<div class="block-carousel">
		<Carousel :index="index" :options="{ align: 'center', overscroll: true, immediate: true }" @start="start" @end="end" class="block-carousel">
			<div v-for="block in state" :key="block.node.id" class="block fade-list-item">
				<BlockCard :block="block" class="box" />
			</div>
			<div v-if="canMine && state.length" class="block fade-list-item box flex-column" style="align-items: center; justify-content: center">
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


const index = ref(undefined as undefined | number)
const query = arweaveQueryBlocks({})
const state = computed(() => query.state.value && [...query.state.value].reverse())
watch(state, (state, oldState) => !oldState?.length && state?.length && (index.value = state.length - 1))

const canMine = computed(() => networkInfo.value?.network?.includes('arlocal'))
const mine = async () => {
	await fetch(ArweaveStore.gatewayURL + 'mine')
	await query.updateQuery.getState(true)
	setTimeout(() => index.value = state.value!.length - 1, 500)
}

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