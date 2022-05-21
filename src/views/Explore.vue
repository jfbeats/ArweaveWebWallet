<template>
	<div class="settings">
		<div class="container">
			<div class="column">
				<GlobalSearch />
				<div class="group">
					<h2><span style="text-transform: capitalize;">{{ gatewayHostname }}</span> Gateway State</h2>
					<div class="flex-column">
						<div>Peers: {{ networkInfo?.peers ?? '...' }}</div>
						<div>Queue: {{ networkInfo?.queue_length ?? '...' }}</div>
						<div>State Latency: {{ networkInfo?.node_state_latency ?? '...' }}</div>
						<div>Pending Transactions: {{ pendingList?.length ?? '...' }}</div>
					</div>
				</div>
				<div class="group">
					<h2>Weave State</h2>
					<div class="flex-column">
						<div>Network Height: {{ networkInfo?.height ?? '...' }}</div>
						<div>Weave Size: {{ currentBlock?.weave_size && humanFileSize(currentBlock?.weave_size) || '...' }}</div>
						<div>Endowment Pool: <Amount :winston="currentBlock?.reward_pool" /></div>
					</div>
				</div>
			</div>
		</div>
		<BlockCarousel />
	</div>
</template>



<script setup lang="ts">
import ArweaveStore, { currentBlock, networkInfo } from '@/store/ArweaveStore'
import { humanFileSize } from '@/functions/Utils'
import Amount from '@/components/composed/Amount.vue'
import { pendingList } from '@/store/BlockStore'
import GlobalSearch from '@/components/composed/GlobalSearch.vue'
import BlockCarousel from '@/components/composed/BlockCarousel.vue'
import { computed } from 'vue'

const gatewayHostname = computed(() => ArweaveStore.gatewayURL && new URL(ArweaveStore.gatewayURL).hostname)
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