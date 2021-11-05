<template>
	<div class="tx-card" :class="{ verticalElement }">
		<div class="tx-content" :class="{ 'flex-row': !verticalElement, 'flex-column': verticalElement }">
			<Link class="left reset" :to="tx.id ? { name: 'Tx', params: { txId: tx.id } } : ''">
				<TxIcon class="tx-icon" :tx="tx" :direction="direction" />
				<div class="margin" />
				<div>
					<Amount v-if="isValue" :ar="value" />
					<div v-else-if="isData">{{ dataType || 'Data' }}</div>
					<div v-else>Transaction</div>
					<div class="secondary-text">{{ context }}</div>
				</div>
			</Link>
			<div class="right">
				<div class="right-content">
					<div class="right-text">
						<Address v-if="relativeAddress" class="address" :address="relativeAddress" />
						<!-- <div v-else class="ellipsis">
							<Amount :ar="tx.fee.ar" />
						</div>-->
						<div class="secondary-text ellipsis">
							<template v-if="status">{{ status }}</template>
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

<script>
import Address from '@/components/atomic/Address.vue'
import TxIcon from '@/components/atomic/TxIcon.vue'
import AddressIcon from '@/components/atomic/AddressIcon.vue'
import Date from '@/components/atomic/Date.vue'
import ArweaveStore from '@/store/ArweaveStore'
import InterfaceStore from '@/store/InterfaceStore'
import { unpackTags } from '@/functions/Utils'
import { computed } from 'vue'

export default {
	components: { Address, TxIcon, AddressIcon, Date },
	props: ['tx'],
	setup (props) {
		const timestamp = computed(() => props.tx.block.timestamp * 1000)
		const status = computed(() => {
			if (ArweaveStore.uploads[props.tx.id]) { return `Uploading ${ArweaveStore.uploads[props.tx.id].upload}%` }
			if (!props.tx.block) { return 'Pending' }
		})
		const direction = computed(() => {
			if (!ArweaveStore.currentWallet) { return null }
			const currentAddress = ArweaveStore.currentWallet.key
			if (currentAddress === props.tx.recipient) { return 'in' }
			else if (currentAddress === props.tx.owner.address) { return 'out' }
			return null
		})
		const isData = computed(() => props.tx.data.size != 0)
		const isValue = computed(() => props.tx.quantity.winston != 0)
		const relativeAddress = computed(() => {
			if (direction.value === 'in') { return props.tx.owner.address }
			if (direction.value === 'out') { return props.tx.recipient }
			return null
		})
		const value = computed(() => props.tx.quantity.ar)
		const dataType = computed(() => {
			if (!props.tx.data.type) { return }
			if (props.tx.data.type === 'application/x.arweave-manifest+json') { return 'Folder' }
			return props.tx.data.type.split('/').join(' ')
		})
		const dataInfo = computed(() => {
			const tags = unpackTags(props.tx.tags)
			return tags['Service'] || tags['App-Name'] || tags['User-Agent']?.split('/')[0]
		})
		const context = computed(() => {
			const fallback = isValue.value && isData.value ? 'Payment | Data' : isValue.value ? 'Payment' : isData.value ? 'Data' : props.tx.tags ? 'Tags' : 'Empty'
			const dataTypeUsed = !isValue.value && isData.value
			return (dataTypeUsed ? null : dataType.value) || dataInfo.value || fallback
		})
		const verticalElement = computed(() => InterfaceStore.breakpoints.verticalLayout)

		return { timestamp, status, direction, isData, isValue, relativeAddress, value, dataType, dataInfo, context, verticalElement }
	}
}
</script>

<style scoped>
.tx-card {
	overflow: auto;
	scrollbar-width: none;
}

.tx-card::-webkit-scrollbar {
	display: none;
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
	max-width: 200px;
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