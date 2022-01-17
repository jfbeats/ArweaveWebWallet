<template>
	<FoldingLayout v-if="tx">
		<template #left>
			<div class="meta flex-column">
				<div class="box" style="padding: 0;">
					<div class="box-padding flex-column" :style="[tagsSchema.length && 'padding-bottom: 0']">
						
						<TxCard :tx="tx" half="true" />
						<div class="spacer" />
						
						<div class="row flex-column" style="align-items: center;">
							<div class="address-icon-margin">
								<AddressIcon :address="tx.owner.address" />
							</div>
							<WalletInfo :wallet="sender" />
						</div>
						<div class="spacer" />
						<div v-if="tx.recipient" class="divider" />
						<div v-if="tx.recipient" class="spacer" />
						
						<div v-if="tx.recipient" class="row flex-column" style="align-items: center;">
							<div class="address-icon-margin">
								<AddressIcon :address="tx.recipient" />
							</div>
							<WalletInfo :wallet="recipient" />
							<div class="spacer" />
						</div>
						
						<div>
							<h3>Transaction</h3>
							<Address :address="tx.id">ID:&nbsp;</Address>
							<!-- Status: included, number of confirmations /50 -> settled -->
							<div v-if="isData"><a :href="ArweaveStore.gatewayURL + tx.id" target="_blank">{{ ArweaveStore.gatewayURLObject?.hostname }}</a></div>
							<div v-if="tx.data?.type === 'application/x.arweave-manifest+json'"><a :href="ArweaveStore.gatewayURL + 'tx/' + tx.id + '/data.json'" target="_blank">Manifest</a></div>
						</div>
						
						<div v-if="isPending">
							<h3>Pending</h3>
							<div v-if="status">Status: {{ status }}</div>
						</div>
						<div v-else>
							<h3>Block</h3>
							<Address :address="tx.block.id">ID:&nbsp;</Address>
							<div>
								Height: {{ tx.block.height }}
								<span class="secondary-text" v-if="networkInfo?.height">/ {{ networkInfo.height }}</span>
							</div>
							<div>{{ date }}</div>
						</div>
	
						<div>
							<h3>Data</h3>
							<div>Size: {{ humanFileSize(tx.data.size) }}</div>
							<div>
								Fee:
								<Amount :ar="tx.fee.ar" />
							</div>
						</div>
						<div v-if="tagsSchema.length">
							<h3>Tags</h3>
						</div>
					</div>
					<div v-if="tagsSchema.length" style="background: var(--background2); border-radius: var(--border-radius);">
						<InputGrid :schema="tagsSchema" disabled />
					</div>
				</div>
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
import ArweaveStore, { arweave, useWatchTx, networkInfo } from '@/store/ArweaveStore'
import InterfaceStore from '@/store/InterfaceStore'
import { humanFileSize } from '@/functions/Utils'
import { watch, computed, ref, toRef } from 'vue'
import TxCard from '@/components/composed/TxCard.vue'
import WalletInfo from '@/components/composed/WalletInfo.vue'
import { getAccountByAddress } from '@/functions/Wallets'

const props = defineProps<{
	txId: string
}>()

const tx = useWatchTx(toRef(props, 'txId'))

const sender = computed(() => tx.value.owner && getAccountByAddress(tx.value.owner.address))
const recipient = computed(() => tx.value.recipient && getAccountByAddress(tx.value.recipient))

const isData = computed(() => tx.value.data?.size != 0)
const isPending = computed(() => !tx.value.block)
const date = computed(() => {
	if (!tx.value.block) { return '' }
	const dateObj = new Date(tx.value.block.timestamp * 1000)
	return dateObj.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
		+ ' ' + dateObj.toLocaleTimeString()
})
const status = ref(null as any)
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
	arweave.transactions.getStatus(props.txId).then(s => status.value = s.status).catch(() => status.value = 'Not Found')
}, { immediate: true })
const verticalContent = toRef(InterfaceStore.breakpoints, 'verticalContent')
</script>



<style scoped>
.meta {
	max-width: var(--column-large-width);
	padding: var(--spacing);
	white-space: nowrap;
}

.box-padding {
	padding: var(--spacing);
}

.spacer {
	height: var(--spacing);
}

.divider {
	border-bottom: solid 1px var(--border2);
	position: relative;
}

.divider:after {
	--size: 32px;
	content: "";
	background: var(--background2);
	height: var(--size);
	width: var(--size);
	border-bottom: solid 1px var(--border2);
	border-right: solid 1px var(--border2);
	position: absolute;
	right: calc(50% - var(--size) / 2);
	bottom: calc(-1px - var(--size) / 2);
	transform: rotate(45deg);
	margin-top: -1rem;
}

.verticalContent .meta {
	max-width: 100%;
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

.address-icon-margin {
	padding: var(--spacing);
}

.address-icon {
	width: 80px;
	height: 80px;
	border-radius: var(--border-radius);
}

.address {
	max-width: 100%;
}

.input-grid {
	padding: var(--spacing) 0;
	border-radius: 0;
	background: var(--background);
	border: 0;
}

.selector.inline {
	min-height: var(--current-vh);
}

.verticalContent .selector.iframe-container {
	min-height: 80vh;
}
</style>