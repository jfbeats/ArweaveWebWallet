<template>
	<FoldingLayout v-if="tx">
		<template #left>
			<div class="meta flex-column">
				<div class="card">
					<div class="row flex-row">
						<div class="item" style="font-size:1.5em;">
							<Amount :ar="tx.quantity.ar" />
						</div>
					</div>
					<div class="row flex-row">
						<div class="item">
							<AddressIcon :address="tx.owner.address" />
							<Address class="secondary-text" :address="tx.owner.address" />
						</div>
					</div>
					<div class="row flex-row">
						<div class="item">
							<AddressIcon :address="tx.recipient" />
							<Address class="secondary-text" :address="tx.recipient" />
						</div>
					</div>
				</div>

				<h3>Properties</h3>
				<div class="card flex-column">
					<div>
						<h3>ID</h3>
						<div class="ellipsis">{{ tx.id }}</div>
						<div v-if="isData"><a :href="ArweaveStore.gatewayURL + tx.id" target="_blank">Link</a></div>
						<div v-if="tx.data?.type === 'application/x.arweave-manifest+json'"><a :href="ArweaveStore.gatewayURL + 'tx/' + tx.id + '/data.json'" target="_blank">Manifest</a></div>
					</div>
					
					<div v-if="isPending">
						<h3>Pending</h3>
						<div v-if="status">Status: {{ status }}</div>
					</div>
					<div v-else>
						<h3>Block</h3>
						<div class="ellipsis">{{ tx.block.id }}</div>
						<span>
							{{ tx.block.height }}
							<template v-if="currentBlock">/ {{ currentBlock }}</template>
						</span>
						<div>{{ date }}</div>
					</div>

					<div>
						<h3>Data</h3>
						<div>Data size {{ humanFileSize(tx.data.size) }}</div>
						<div>
							Fee
							<Amount :ar="tx.fee.ar" />
						</div>
					</div>
				</div>

				<template v-if="tagsSchema.length">
					<h3>Tags</h3>
					<div style="background: var(--background2); border-radius: var(--border-radius);">
						<InputGrid :schema="tagsSchema" disabled />
					</div>
				</template>

				<br v-if="verticalContent" />
			</div>
		</template>

		<template #right v-if="isData">
			<Selector :tx="tx" :class="{ inline: !verticalContent }" />
		</template>
	</FoldingLayout>
</template>



<script setup lang="ts">
import Selector from '@/components/handlers/Selector.vue'
import FoldingLayout from '@/components/layout/FoldingLayout.vue'
import Address from '@/components/atomic/Address.vue'
import AddressIcon from '@/components/atomic/AddressIcon.vue'
import InputGrid from '@/components/atomic/InputGrid.vue'
import Amount from '@/components/composed/Amount.vue'
import ArweaveStore, { arweave, useWatchTx } from '@/store/ArweaveStore'
import BlockStore, { getCurrentHeight } from '@/store/BlockStore'
import InterfaceStore from '@/store/InterfaceStore'
import { humanFileSize } from '@/functions/Utils'
import { watch, computed, ref, toRef } from 'vue'

const props = defineProps<{
	txId: string
}>()

const tx = useWatchTx(toRef(props, 'txId'))

const isData = computed(() => tx.value.data?.size != 0)
const isPending = computed(() => !tx.value.block)
const date = computed(() => {
	if (!tx.value.block) { return '' }
	const dateObj = new Date(tx.value.block.timestamp * 1000)
	return dateObj.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
		+ ' ' + dateObj.toLocaleTimeString()
})
const status = ref(null as any)
const currentBlock = toRef(BlockStore, 'currentHeight')
const tagsSchema = computed(() => {
	if (!tx.value.tags) { return }
	const result = []
	for (const tag of tx.value.tags) {
		result.push({
			items: [
				{ name: '', value: tag.name, attrs: { disabled: true } },
				{ name: '', value: tag.value, attrs: { disabled: true } }
			]
		})
	}
	return result
})
watch(() => props.txId, async () => {
	getCurrentHeight()
	arweave.transactions.getStatus(props.txId).then(s => status.value = s.status).catch(() => status.value = 'Not Found')
}, { immediate: true })
const verticalContent = toRef(InterfaceStore.breakpoints, 'verticalContent')
</script>



<style scoped>
.meta {
	max-width: var(--column-large-width);
	padding: var(--spacing);
}

.verticalContent .meta {
	max-width: 100%;
}

h3 {
	margin-bottom: 0;
}

.row {
	min-height: 2em;
	align-items: flex-start;
	justify-content: space-between;
}

.row > .item {
	flex: 1 1 0;
	min-width: 0;
	min-height: 200px;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.circle {
	flex: 0 0 auto;
	width: 200px;
	height: 200px;
	font-size: 1.5em;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	border: 4px solid var(--border);
	border-radius: 50%;
}

.address-icon {
	width: 64px;
	height: 64px;
	margin-bottom: 32px;
	border-radius: var(--border-radius);
}

.address {
	max-width: 100%;
}

.input-grid {
	padding: var(--spacing) 0;
	background: var(--background2);
	border: 0.5px solid var(--border);
}

.selector.inline {
	min-height: var(--current-vh);
}

.verticalContent .selector.iframe-container {
	min-height: 80vh;
}
</style>