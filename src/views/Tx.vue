<template>
	<TransitionsManager :vector="vector" axis="x">
		<div v-if="!tx" style="position: relative; width: 100%; min-height: var(--current-vh); color: var(--element-secondary);">
			<OverlayPrompt :options="{ icon: 'loader' }" class="box">
				<h2 v-if="queryStatus.error">{{ queryStatus.error }}</h2>
				<h2 v-else>Loading</h2>
			</OverlayPrompt>
		</div>
		<FoldingLayout v-else :key="txId">
			<template #left>
				<div class="meta flex-column">
					<div class="box" style="padding: 0;">
						<div class="box-padding flex-column" :style="[tx.tags.length && 'padding-bottom: 0']">
							<TxCard :tx="tx" :options="{ half: true }" />
							
							<ProfilePreview v-if="tx.recipient" :wallet="recipient" />
							
							<div v-if="tx.recipient" class="spacer" />
							<div v-if="tx.recipient" class="divider" />
							
							<ProfilePreview :wallet="sender" />
							
							<div>
								<h3>Transaction</h3>
								<div class="flex-column">
									<div v-if="isData"><a :href="ArweaveStore.gatewayURL + tx.id" target="_blank">{{ gatewayHostname }}</a></div>
									<div v-if="type === 'application/x.arweave-manifest+json'"><a :href="ArweaveStore.gatewayURL + 'raw/' + tx.id" target="_blank">Manifest</a></div>
									<div class="secondary-text"><Address :tx="tx.id">ID:&nbsp;</Address></div>
								</div>
							</div>
							
							<div v-if="tx.bundledIn?.id">
								<h3>Bundle</h3>
								<div class="flex-column">
									<TxCard v-if="bundleTx" :tx="bundleTx" :options="{ space: true }" />
									<div class="secondary-text"><Address :tx="tx.bundledIn?.id">ID:&nbsp;</Address></div>
								</div>
							</div>
							
							<div v-if="isPending">
								<h3>Pending</h3>
								<div>Status: {{ status ? status : '...' }}</div>
							</div>
							<div v-else>
								<h3>Block</h3>
								<div>
									Height: {{ tx.block.height }}
									<span class="secondary-text" v-if="networkInfo?.height">/ {{ networkInfo.height }} ({{ confirmations }} confirmation{{ confirmations > 1 ? 's' : ''}})</span>
								</div>
								<div>{{ date }}</div>
								<div class="spacer" />
								<div class="secondary-text"><Address :block="tx.block.id">ID:&nbsp;</Address></div>
							</div>
		
							<div>
								<h3>Data</h3>
								<div>Size: {{ humanFileSize(tx.data.size) }}</div>
								<div>
									Fee:
									<Amount :ar="tx.fee.ar" />
								</div>
							</div>
						</div>
						<div v-if="tx.tags.length" style="background: var(--background);">
							<h3 style="margin-bottom: 0; padding: var(--spacing) 0 0 var(--spacing);">Tags</h3>
							<InputTags v-model="tx.tags" disabled />
						</div>
					</div>
				</div>
			</template>
	
			<template #right v-if="tx && isData">
				<Selector :tx="tx" :class="{ inline: !verticalContent }" />
			</template>
		</FoldingLayout>
	</TransitionsManager>
</template>



<script setup lang="ts">
import Selector from '@/components/handlers/Selector.vue'
import FoldingLayout from '@/components/layout/FoldingLayout.vue'
import Address from '@/components/atomic/Address.vue'
import InputTags from '@/components/form/InputTags.vue'
import Amount from '@/components/composed/Amount.vue'
import ArweaveStore, { arweave, useWatchTx, networkInfo } from '@/store/ArweaveStore'
import InterfaceStore from '@/store/InterfaceStore'
import { humanFileSize } from '@/functions/Utils'
import { watch, computed, ref, toRef } from 'vue'
import TxCard from '@/components/composed/TxCard.vue'
import { getAccountByAddress } from '@/functions/Wallets'
import ProfilePreview from '@/components/composed/ProfilePreview.vue'
import OverlayPrompt from '@/components/layout/OverlayPrompt.vue'
import TransitionsManager from '@/components/visual/TransitionsManager.vue'
import { getReactiveAsyncData } from '@/functions/AsyncData'
import { unpackTags } from '@/functions/Transactions'

const props = defineProps<{
	txId: string
}>()

const handler = useWatchTx(toRef(props, 'txId'))
const tx = handler.state
const queryStatus = handler.queryStatus

const bundleId = computed(() => tx.value?.bundledIn?.id)
const bundleHandler = useWatchTx(bundleId)
const bundleTx = bundleHandler.state

const gatewayHostname = computed(() => ArweaveStore.gatewayURL && new URL(ArweaveStore.gatewayURL).hostname)

const statusId = computed(() => tx.value?.bundledIn?.id || props.txId)
const status = getReactiveAsyncData({
	name: 'single tx status',
	params: statusId,
	query: async param => (await arweave.transactions.getStatus(param)).status,
	completed: (state: any) => !statusId.value || tx.value?.block || state && state !== 404,
	seconds: 30,
}).state

const sender = computed(() => tx.value?.owner && getAccountByAddress(tx.value?.owner.address))
const recipient = computed(() => tx.value?.recipient && getAccountByAddress(tx.value?.recipient))
const type = computed(() => unpackTags(tx.value?.tags || [])['Content-Type'])

const isData = computed(() => tx.value?.data?.size !== '0')
const isPending = computed(() => !tx.value?.block)
const date = computed(() => {
	if (!tx.value?.block) { return '' }
	const dateObj = new Date(tx.value?.block.timestamp * 1000)
	return dateObj.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
		+ ' ' + dateObj.toLocaleTimeString()
})
const confirmations = computed(() => networkInfo.value?.height && tx.value?.block?.height && (networkInfo.value?.height - tx.value?.block?.height + 1))

const verticalContent = toRef(InterfaceStore.breakpoints, 'verticalContent')
const vector = ref(0)
watch(tx, (val, oldVal) => {
	if (!oldVal) return
	if (oldVal?.bundledIn?.id === props.txId) return vector.value = -1
	vector.value = 1
})
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
	border-top: solid 1px var(--border2);
	border-left: solid 1px var(--border2);
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
</style>