<template>
	<div class="settings">
		<div class="container">
			<div class="column">
				<GlobalSearch @height="goTo = $event" style="z-index: 2;" />
				<div class="group">
					<h2><span style="text-transform: capitalize;">{{ gatewayHostname }}</span> Gateway State</h2>
					<div class="flex-column">
						<div>Peers: {{ networkInfo?.peers ?? '...' }}</div>
						<div>Pending Transactions: {{ pendingList?.length ?? '...' }}</div>
						<div>Network Height: {{ networkInfo?.height ?? '...' }}{{ totalStored }}</div>
					</div>
				</div>
				<div class="group">
					<h2>Weave State</h2>
					<div class="flex-column">
						<div>Weave Size: {{ currentBlock?.weave_size && humanFileSize(currentBlock?.weave_size) || '...' }}</div>
						<div>Endowment Pool: <Amount :winston="currentBlock?.reward_pool" /></div>
					</div>
				</div>
			</div>
		</div>
		<BlockCarousel :height="networkInfo?.height" :goTo="goTo" />
	</div>
</template>



<script setup lang="ts">
import ArweaveStore, { currentBlock, networkInfo } from '@/store/ArweaveStore'
import { humanFileSize, round } from '@/functions/Utils'
import Amount from '@/components/composed/Amount.vue'
import { pendingList } from '@/store/BlockStore'
import GlobalSearch from '@/components/composed/GlobalSearch.vue'
import BlockCarousel from '@/components/composed/BlockCarousel.vue'
import { computed, ref } from 'vue'

const gatewayHostname = computed(() => ArweaveStore.gatewayURL && new URL(ArweaveStore.gatewayURL).hostname)
const totalStored = computed(() => {
	const blocks = networkInfo.value?.blocks
	const height = networkInfo.value?.height
	if (blocks == null || height == null) { return '' }
	const percent = 100 * Math.min(blocks / Math.max(height - 1, 1), 1)
	if (percent === 100) { return '' }
	return ` (${round(percent, 2)}% known)`
})
const goTo = ref(undefined as undefined | number)
</script>



<style scoped>
.settings {
	min-height: var(--current-vh);
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.container {
	background: var(--background2);
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	outline: 0.5px solid var(--border);
}

.column {
	padding: var(--spacing);
	width: 100%;
	max-width: var(--column-width);
}

.group {
	margin-top: 3em;
}

.wallet-options {
	border-radius: var(--border-radius);
}

.block-carousel {
	flex: 1 0 auto;
}
</style>