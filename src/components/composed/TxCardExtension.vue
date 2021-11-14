<template>
	<div class="tx-card-extension">
		<div class="flex-row" style="justify-content:space-between;">
			<div>Tags:</div>
			<div>Data: {{ humanFileSize(tx.data_size) }}</div>
		</div>
		<ul class="tags secondary-text">
			<li v-for="tag in tx.tags">
				{{ tag.name + ' | ' + tag.value }}
			</li>
		</ul>
	</div>
</template>

<script>
import Address from '@/components/atomic/Address.vue'
import ArweaveStore, { arweave } from '@/store/ArweaveStore'
import InterfaceStore from '@/store/InterfaceStore'
import { unpackTags } from '@/functions/Transactions'
import { humanFileSize } from '@/functions/Utils'

import { computed } from 'vue'

export default {
	components: { Address },
	props: ['tx'],
	setup (props) {
		// owner - verify
		// tags
		// data_size
		// data
		// reward
		
		const verticalElement = computed(() => InterfaceStore.breakpoints.verticalLayout)



		return { verticalElement, humanFileSize }
	}
}
</script>

<style scoped>
.tags {
	white-space: normal;
}

ul {
	padding-inline-start: 1em;
	margin-block-start: 0;
}
</style>