<template>
	<div class="tx-card" :class="{ verticalElement }">
		<div class="tx-content" :class="{ 'flex-row': !verticalElement, 'flex-column': verticalElement }">
			<Link class="left reset" :to="tx.id ? { name: 'Tx', params: { txId: tx.id } } : ''">
				<TxIcon class="tx-icon" :tx="tx" :direction="direction" />
				<div class="margin" />
				<div>
					<div v-if="isValue">
						<Ar class="ar" :ar="value" />&nbsp;
						<LocaleCurrency class="secondary-text" :ar="value">|</LocaleCurrency>
					</div>
					<div v-else>{{ dataType || 'Data' }}</div>
					<div class="secondary-text">{{ context }}</div>
				</div>
			</Link>
			<div class="right">
				<div class="right-content">
					<div class="right-text">
						<Address v-if="relativeAddress" class="address" :address="relativeAddress" />
						<!-- <div v-else class="ellipsis">
							<Ar :ar="tx.fee.ar" />&nbsp;
							<LocaleCurrency class="secondary-text" :ar="tx.fee.ar">|</LocaleCurrency>
						</div>-->
						<div v-if="upload" class="secondary-text ellipsis">{{ upload }}</div>
						<div v-else-if="isPending" class="secondary-text ellipsis">Pending</div>
						<div v-else class="secondary-text ellipsis">
							<Date :timestamp="timestamp" />
						</div>
					</div>
					<div class="margin" />
				</div>
				<MoreInfo v-if="relativeAddress" :key="relativeAddress">
					<template v-slot:icon>
						<AddressIcon :address="relativeAddress" />
					</template>
					<template v-slot:content>
						<div>Info here</div>
					</template>
				</MoreInfo>
				<span v-else class="cloud">
					<img class="file-type no-select" src="@/assets/icons/cloud.svg" draggable="false" />
				</span>
			</div>
		</div>
	</div>
</template>

<script>
import Address from '@/components/atomic/Address.vue'
import Ar from '@/components/atomic/Ar.vue'
import LocaleCurrency from '@/components/atomic/LocaleCurrency.vue'
import TxIcon from '@/components/atomic/TxIcon.vue'
import AddressIcon from '@/components/atomic/AddressIcon.vue'
import MoreInfo from '@/components/composed/MoreInfo.vue'
import Date from '@/components/atomic/Date.vue'
import Link from '@/components/function/Link.vue'
import ArweaveStore from '@/store/ArweaveStore'
import InterfaceStore from '@/store/InterfaceStore'
import { computed } from 'vue'

export default {
	components: { Address, Ar, TxIcon, AddressIcon, LocaleCurrency, MoreInfo, Date, Link },
	props: ['tx'],
	setup (props) {
		const timestamp = computed(() => props.tx.block.timestamp * 1000)
		const upload = computed(() => {
			if (!ArweaveStore.uploads[props.tx.id]) { return null }
			return `Uploading ${ArweaveStore.uploads[props.tx.id].upload}%`
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
		const isPending = computed(() => !props.tx.block)
		const relativeAddress = computed(() => {
			if (direction.value === 'in') { return props.tx.owner.address }
			if (direction.value === 'out') { return props.tx.recipient }
			return null
		})
		const value = computed(() => props.tx.quantity.ar)
		const dataType = computed(() => {
			if (!props.tx.data.type) { return }
			if (props.tx.data.type === 'application/x.arweave-manifest+json') { return 'Website' }
			return props.tx.data.type.split('/').join(' ')
		})
		const dataInfo = computed(() => {
			for (const tag of props.tx.tags) {
				if (tag.name == 'Service') { return tag.value }
			}
			for (const tag of props.tx.tags) {
				if (tag.name == 'App-Name') { return tag.value }
			}
			for (const tag of props.tx.tags) {
				if (tag.name == 'User-Agent') { return tag.value.split('/')[0] }
			}
		})
		const context = computed(() => {
			if (isValue.value && isData.value) {
				return dataInfo.value || dataType.value || 'Payment | Data'
			} else if (isValue.value) {
				return dataInfo.value || dataType.value || 'Payment'
			} else if (isData.value) {
				return dataInfo.value || 'Data'
			}
		})
		const verticalElement = computed(() => InterfaceStore.breakpoints.verticalLayout)

		return { timestamp, upload, direction, isData, isValue, isPending, relativeAddress, value, dataType, dataInfo, context, verticalElement }
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

.tx-icon {
	width: 48px;
	height: 48px;
	border-radius: var(--border-radius2);
	/* background: var(--background); */
	flex: 0 0 auto;
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