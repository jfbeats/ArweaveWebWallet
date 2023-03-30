<template>
	<div class="tx-card no-scrollbar" :class="{ verticalElement }">
		<div class="tx-content" :class="{ 'flex-row': !verticalElement, 'flex-column': verticalElement }">
			<Link class="left reset" :to="(tx.id && !options?.half) ? { name: 'Tx', params: { txId: tx.id } } : ''">
				<TxIcon class="tx-icon" :tx="tx" :options="{ isData, isValue, direction, status }" />
				<div class="margin" />
				<div>
					<Amount v-if="isValue" :ar="value" />
					<div v-else-if="isData">{{ dataType || 'Data' }}</div>
					<div v-else>Transaction</div>
					<div class="secondary-text">{{ context }}</div>
				</div>
			</Link>
			<div v-if="!options?.half" class="right">
				<div class="right-content">
					<div class="right-text">
						<Address v-if="relativeAddress" class="address" :address="relativeAddress" />
						<div v-else-if="dataSize" class="secondary-text ellipsis">Size: {{ dataSize }}</div>
						<div class="secondary-text ellipsis">
							<template v-if="statusText">{{ statusText }}</template>
							<template v-else-if="options?.space">Fee: <Amount :ar="tx.fee.ar" /></template>
							<Date v-else-if="timestamp" :timestamp="timestamp" />
						</div>
					</div>
					<div class="margin" />
				</div>
				<AddressIcon :key="relativeAddress" :address="relativeAddress" :class="{ empty: !relativeAddress }" />
			</div>
		</div>
	</div>
</template>



<script setup lang="ts">
import Address from '@/components/atomic/Address.vue'
import TxIcon from '@/components/atomic/TxIcon.vue'
import AddressIcon from '@/components/atomic/AddressIcon.vue'
import Date from '@/components/atomic/Date.vue'
import Link from '@/components/function/Link.vue'
import Amount from '@/components/composed/Amount.vue'
import ArweaveStore, { arweave } from '@/store/ArweaveStore'
import InterfaceStore from '@/store/InterfaceStore'
import { unpackTags } from '@/functions/Transactions'
import { computed } from 'vue'
import { humanFileSize } from '@/functions/Utils'
import { DataItemParams } from 'arweave-wallet-connector/lib/Arweave'

const props = defineProps<{
	tx: Widen<AnyTransaction | DataItemParams>
	options?: {
		currentAddress?: any
		half?: any
		space?: boolean
	}
}>()

const tags = computed(() => unpackTags(props.tx.tags, { lowercase: true }))
const timestamp = computed(() => props.tx.block?.timestamp * 1000)
const statusText = computed(() => {
	if (ArweaveStore.uploads[props.tx.id]) { return `Uploading ${ArweaveStore.uploads[props.tx.id].upload}%` }
	if (!props.tx.id) { return 'Awaiting approval' }
	if (!props.tx.block) { return 'Pending' }
})
const direction = computed(() => props.tx.recipient && props.tx.recipient === props.options?.currentAddress ? 'in' : 'out')
const relativeAddress = computed(() => direction.value === 'in' ? props.tx.owner.address : (props.tx.recipient || props.tx.target))
const value = computed(() => props.tx.quantity && (props.tx.quantity?.ar || arweave.ar.winstonToAr(props.tx.quantity)))
const isValue = computed(() => value.value && parseFloat(value.value) > 0)
const isData = computed(() => (ArrayBuffer.isView(props.tx.data) && props.tx.data.size > 0) || (props.tx.data?.size || props.tx.data_size) > 0)
const status = computed(() => {
	if (!props.tx.id || !props.tx.block) { return 'pending' }
	return 'confirmed'
})
const dataSize = computed(() => isData.value && humanFileSize(props.tx.data?.size || props.tx.data_size))
const dataType = computed(() => {
	if (tags.value['bundle-version']) return 'Bundle'
	if (tags.value['content-type'] === 'text/html') { return 'Website' }
	if (tags.value['content-type'] === 'application/x.arweave-manifest+json') { return 'Manifest' }
	return tags.value['content-type']?.split('/').join(' ')
})
const dataInfo = computed(() => tags.value['app'] || tags.value['application'] || tags.value['app-name'] || tags.value['application-name']
	|| tags.value['service'] || tags.value['service-name']
	|| tags.value['protocol'] || tags.value['protocol-name']
	|| tags.value['arweave-app'] || tags.value['uploading-app']
	|| tags.value['user-agent']?.split('/').join(' ') || tags.value['file-name']
	|| tags.value['type'])
const context = computed(() => {
	const fallback = isValue.value && isData.value ? 'Payment | Data' : isValue.value ? 'Payment' : isData.value ? 'Data' : props.tx.tags?.length ? 'Tags' : 'Empty'
	const dataTypeUsed = !isValue.value && isData.value
	return (dataTypeUsed ? null : dataType.value) || props.tx.path || dataInfo.value || fallback
})
const verticalElement = computed(() => InterfaceStore.breakpoints.verticalLayout)
</script>



<style scoped>
.tx-card {
	overflow: auto hidden;
	display: inline;
}

.tx-content {
	position: relative;
	justify-content: space-between;
}

.verticalElement .tx-content {
	min-width: 256px;
}

.left {
	flex: 0 0 auto;
	display: flex;
	align-items: center;
}

.right {
	flex: 1 1 0;
	min-width: 200px;
	display: flex;
	justify-content: flex-end;
	align-items: center;
	position: relative;
}

.right-content {
	flex: 1 1 0;
	min-width: 0;
	justify-content: flex-end;
	display: flex;
}

.right-text {
	flex: 0 1 auto;
	min-width: 0;
	text-align: end;
	white-space: nowrap;
}

.margin {
	flex: 0 0 auto;
	width: var(--spacing);
}

.address {
	max-width: Min(200px, 100%);
	margin-inline-start: auto;
}

.tx-icon,
.address-icon {
	width: 48px;
	height: 48px;
	flex: 0 0 auto;
	border-radius: var(--border-radius2);
}

.address-icon {
	background: var(--background);
}

.address-icon.empty {
	padding: 8px;
	background: none;
}

.cloud {
	width: 48px;
	height: 48px;
	padding: 8px;
}

.file-type {
	width: 100%;
	height: 100%;
	opacity: 0.2;
}
</style>