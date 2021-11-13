<template>
	<div class="tx-card-extension">
		<div class="secondary-text">
			<div v-for="tag in tx.tags">
				{{ tag.name + ': ' + tag.value }}
			</div>
		</div>
	</div>
</template>

<script>
import Address from '@/components/atomic/Address.vue'
import ArweaveStore, { arweave } from '@/store/ArweaveStore'
import InterfaceStore from '@/store/InterfaceStore'
import { unpackTags } from '@/functions/Transactions'
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

		return { verticalElement }
	}
}
</script>

<style scoped>

</style>