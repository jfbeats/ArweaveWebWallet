<template>
	<div class="settings">
		<div class="column">
<!--			<Input v-model="search" placeholder="Search" style="flex:1 1 0;" @keyup.enter="" />-->
<!--			search in address, tx, username (arweave id tags) -->
			<div class="group">
				<h2>Gateway State</h2>
				<div class="flex-column">
					<div>Peers: {{ networkInfo?.peers }}</div>
					<div>Queue: {{ networkInfo?.queue_length }}</div>
					<div>State Latency: {{ networkInfo?.node_state_latency }}</div>
					<div>Pending Transactions: {{ pendingList?.length }}</div>
				</div>
			</div>
			<div class="group">
				<h2>Weave State</h2>
				<div class="flex-column">
					<div>Network Height: {{ networkInfo?.height }}</div>
					<div>Weave Size: {{ humanFileSize(currentBlock?.weave_size) }}</div>
					<div>Endowment Pool: <Amount :winston="currentBlock?.reward_pool" /></div>
				</div>
			</div>
			<div class="group">
				<h2>Latest Block</h2>
				<div class="flex-column">
					<div>Block Height: {{ currentBlock?.height }}</div>
					<div>Block Size: {{ humanFileSize(currentBlock?.block_size) }}</div>
					<div>Block Time: <Date :timestamp="currentBlock?.timestamp * 1000" /></div>
					<div>Transactions ({{ currentBlock?.txs?.length }})
						<div v-for="tx in currentBlock?.txs" :key="tx" class="secondary-text">
							<Link :to="{ name: 'Tx', params: { txId: tx } }">{{ tx }}</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>



<script setup lang="ts">
import Input from '@/components/atomic/Input.vue'
import Select from '@/components/atomic/Select.vue'
import Button from '@/components/atomic/Button.vue'
import ArweaveStore, { currentBlock, networkInfo } from '@/store/ArweaveStore'
import { reactive, ref, computed } from 'vue'
import LogoArweave from '@/assets/logos/arweave.svg?component'
import { humanFileSize } from '@/functions/Utils'
import Date from '@/components/atomic/Date.vue'
import Amount from '@/components/composed/Amount.vue'
import { pendingList } from '@/store/BlockStore'
import Link from '@/components/function/Link.vue'

const search = ref('')



</script>



<style scoped>
.settings {
	padding: var(--spacing);
	min-height: var(--current-vh);
	width: 100%;
	display: flex;
	justify-content: center;
	background: var(--background2);
}

.column {
	width: 100%;
	max-width: var(--column-width);
}

.group {
	margin-top: 3em;
}

.wallet-options {
	border-radius: var(--border-radius);
}
</style>