<template>
	<FoldingLayout v-if="tx">
		<template #left>
			<div class="meta flex-column">

				<div class="card">
					<div class="row flex-row">
						<div class="item" style="font-size:1.5em;">
							<Ar class="ar" :ar="tx.quantity.ar" />
							<LocaleCurrency class="small" :ar="tx.quantity.ar"></LocaleCurrency>
						</div>
					</div>
					<div class="row flex-row">
						<div class="item">
							<AddressIcon :address="tx.owner.address" />
							<Address class="small" :address="tx.owner.address" />
						</div>
					</div>
					<div class="row flex-row">
						<div class="item">
							<AddressIcon :address="tx.recipient" />
							<Address class="small" :address="tx.recipient" />
						</div>
					</div>
				</div>

				<h3>Properties</h3>
				<div class="card flex-column">

					<div>
						<h3>ID</h3>
						<div class="ellipsis">{{ tx.id }}</div>
						<a v-if="isData" :href="ArweaveStore.gatewayURL + tx.id" target="_blank">Link</a>
					</div>

					<div v-if="isPending">
						<h3>Pending</h3>
					</div>
					<div v-else>
						<h3>Block </h3>
						<div class="ellipsis">{{ tx.block.id }}</div>
						<span>{{ tx.block.height }}<template v-if="currentBlock"> / {{ currentBlock }}</template></span>
						<div>{{ date }}</div>
					</div>

					<div>
						<h3>Data</h3>
						<div>Data size {{ humanFileSize(tx.data.size) }}</div>
						<div>Fee
							<Ar class="ar" :ar="tx.fee.ar" />&nbsp;<LocaleCurrency class="small" :ar="tx.fee.ar">|</LocaleCurrency>
						</div>
					</div>
				</div>

				<template v-if="tagsSchema.length">
					<h3>Tags</h3>
					<div style="background: var(--background2); border-radius: var(--border-radius);">
						<InputGrid :schema="tagsSchema" disabled />
					</div>
				</template>

				<br v-if="verticalContent">

			</div>
		</template>

		<template #right v-if="isData">
			<Selector :tx="tx" class="selector" :class="{ inline: !verticalContent }" />
		</template>
	</FoldingLayout>
</template>

<script>
import Selector from '@/components/handlers/Selector.vue'
import FoldingLayout from '@/components/FoldingLayout.vue'
import Address from '@/components/atomic/Address'
import AddressIcon from '@/components/atomic/AddressIcon'
import InputGrid from '@/components/atomic/InputGrid.vue'
import Ar from '@/components/atomic/Ar.vue'
import LocaleCurrency from '@/components/atomic/LocaleCurrency.vue'
import ArweaveStore, { getTxById } from '@/store/ArweaveStore'
import BlockStore, { getCurrentBlock } from '@/store/BlockStore'
import InterfaceStore from '@/store/InterfaceStore'
import { humanFileSize } from '@/functions/Utils'
import { watch, computed, ref, toRef } from 'vue'

export default {
	components: { Selector, FoldingLayout, Address, AddressIcon, InputGrid, Ar, LocaleCurrency },
	props: {
		txId: String,
	},
	setup (props) {
		const tx = computed(() => ArweaveStore.txs[props.txId])
		const isData = computed(() => tx.value.data?.size !== '0')
		const isPending = computed(() => !tx.value.block)
		const date = computed(() => {
			if (isPending.value) { return '' }
			const dateObj = new Date(tx.value.block.timestamp * 1000)
			return dateObj.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
				+ ' ' + dateObj.toLocaleTimeString()
		})
		const currentBlock = toRef(BlockStore, 'currentBlock')
		const tagsSchema = computed(() => {
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
			getTxById(props.txId)
			getCurrentBlock()
		}, { immediate: true })

		const verticalContent = toRef(InterfaceStore.breakpoints, 'verticalContent')

		return { ArweaveStore, tx, currentBlock, isData, isPending, date, tagsSchema, verticalContent, humanFileSize }
	},
}
</script>

<style scoped>
.meta {
	max-width: 900px;
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

.small {
	font-size: 0.75em;
	color: var(--element-secondary);
}

.selector.inline {
	min-height: 100vh;
	border-start-end-radius: 0;
	border-end-end-radius: 0;
}

.verticalContent .selector {
	min-height: 80vh;
	border-end-start-radius: 0;
	border-end-end-radius: 0;
}
</style>