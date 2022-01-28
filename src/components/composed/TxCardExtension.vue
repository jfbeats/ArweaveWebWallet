<template>
	<div class="tx-card-extension">
		<div v-if="tx.tags.length || tx.data_size" class="flex-row" style="justify-content:space-between;">
			<div v-if="tx.tags.length">Tags:</div>
			<div v-if="tx.data_size">Data: {{ humanFileSize(tx.data_size) }}</div>
		</div>
		<ul v-if="tx.tags.length" class="tags secondary-text no-scrollbar">
			<li v-for="tag in tx.tags">
				{{ tag.name + ' | ' + tag.value }}
			</li>
		</ul>
	</div>
</template>



<script setup>
import Address from '@/components/atomic/Address.vue'
import ArweaveStore, { arweave } from '@/store/ArweaveStore'
import InterfaceStore from '@/store/InterfaceStore'
import { unpackTags } from '@/functions/Transactions'
import { humanFileSize } from '@/functions/Utils'
import { computed } from 'vue'

const props = defineProps(['tx'])

// owner - verify
// tags
// data_size
// data
// reward

const verticalElement = computed(() => InterfaceStore.breakpoints.verticalLayout)
</script>



<style scoped>
.tags {
	white-space: normal;
	overflow-x: auto;
}

ul {
	padding-inline-start: 1em;
	margin-block-start: 0;
}

li {
	white-space: nowrap;
}
</style>