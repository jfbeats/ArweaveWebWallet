<template>
	<Observer @intersecting="visible = true">
		<div class="flex-row" style="align-items: center; justify-content: space-between; flex-wrap: wrap;">
			<h2 class="flex-row" style="align-items: center;">
				<Icon :icon="ICON.cube" class="cube" :glow="active" />
				<span>Block {{ block.height }}</span>
			</h2>
			<TransitionsManager>
				<div v-if="blockData" style="text-align: end; flex: 1 1 auto;">
					<div>{{ blockData.txs?.length }} Transactions | {{ humanFileSize(blockData.block_size) }}</div>
					<div><Date :timestamp="blockData.timestamp * 1000" /></div>
				</div>
			</TransitionsManager>
		</div>
	</Observer>
</template>



<script setup lang="ts">
import Date from '@/components/atomic/Date.vue'
import TransitionsManager from '@/components/visual/TransitionsManager.vue'
import Icon from '@/components/atomic/Icon.vue'
import { ICON } from '@/store/Theme'
import { humanFileSize } from '@/functions/Utils'
import { arweave } from '@/store/ArweaveStore'
import { getAsyncData } from '@/functions/AsyncData'
import Observer from '@/components/function/Observer.vue'
import { computed, ref } from 'vue'

const props = defineProps<{
	block: any
	active?: boolean
}>()

const block = computed(() => props.block?.node ? props.block.node : props.block)

const blockData = getAsyncData({
	name: 'single block header',
	awaitEffect: () => visible.value,
	query: async () => block.value && arweave.blocks.get(block.value.id),
	processResult: r => typeof r === 'string' ? JSON.parse(r) : r,
	seconds: 10,
	completed: state => state
}).state
const visible = ref(false)
</script>



<style scoped>
.cube {
	font-size: 1.5em;
	color: var(--orange);
}
</style>