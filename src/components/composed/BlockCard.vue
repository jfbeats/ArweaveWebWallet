<template>
	<div class="block-card">
		<Observer @intersection="visible = true" />
			<div class="flex-row" style="align-items: center; justify-content: space-between">
				<h2>
					Block {{ block.node.height }}
				</h2>
				<div v-if="data" style="text-align: end">
					<div>{{ data.txs?.length }} Transactions | {{ humanFileSize(data.block_size) }}</div>
					<div><Date :timestamp="data.timestamp * 1000" /></div>
				</div>
			</div>
	</div>
</template>



<script setup lang="ts">
import Observer from '@/components/function/Observer.vue'
import { ref, watch } from 'vue'
import { arweave } from '@/store/ArweaveStore'
import { humanFileSize } from '@/functions/Utils'
import Date from '@/components/atomic/Date.vue'

const props = defineProps<{ block: any }>()

const visible = ref(false)
const data = ref(undefined as any)


watch(visible, async visible => visible && !data.value && (data.value = await arweave.blocks.get(props.block.node.id)))
</script>



<style>
.block-card {

}
</style>