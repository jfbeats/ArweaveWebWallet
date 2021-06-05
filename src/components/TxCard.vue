<template>
	<div class="tx-card">
		<div class="left">

			<TxIcon class="tx-icon" :direction="direction" :isValue="isValue" :isData="isData" />

			<div v-if="isValue">
				<div>
					<Ar class="ar" :ar="value" />
				</div>
				<div class="bottom">
					<LocaleCurrency :ar="value" />
				</div>
			</div>
			<div v-else>
				<div>
					{{ tx.node.data.type.split('/').join(' ') }}
				</div>
				<div class="bottom">
					{{ dataInfo }}
				</div>
			</div>

		</div>
		<div class="right">

			<div class="right-content">
				<div class="right-text">
					<Address v-if="relativeAddress" class="address" :address="relativeAddress" />
					<div v-else class="ellipsis">
						<Ar :ar="tx.node.fee.ar" /> /
						<LocaleCurrency :ar="tx.node.fee.ar" />
					</div>
					<div class="bottom ellipsis">{{ date + ' ' + time }}</div>
				</div>
				<div class="margin"></div>
			</div>

			<MoreInfo v-if="relativeAddress" :key="relativeAddress" class="no-select">
				<template v-slot:icon>
					<AddressIcon :address="relativeAddress" />
				</template>
				<template v-slot:content>
					<div>Info here</div>
				</template>
			</MoreInfo>
			<span v-else class="cloud"><img class="file-type no-select" src="cloud.svg" draggable="false"></span>

		</div>
	</div>
</template>

<script>
import Address from '@/components/atomic/Address'
import Ar from '@/components/atomic/Ar'
import TxIcon from '@/components/atomic/TxIcon'
import AddressIcon from '@/components/atomic/AddressIcon'
import LocaleCurrency from '@/components/atomic/LocaleCurrency'
import MoreInfo from '@/components/MoreInfo'
import { ArweaveStore } from '@/store/ArweaveStore'

export default {
	components: { Address, Ar, TxIcon, AddressIcon, LocaleCurrency, MoreInfo },
	props: ['tx'],
	computed: {
		date () {
			return new Date(this.tx.node.block.timestamp * 1000).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
		},
		time () {
			return new Date(this.tx.node.block.timestamp * 1000).toLocaleTimeString()
		},
		direction () {
			if (!ArweaveStore.currentWallet) { return null }
			const currentAddress = ArweaveStore.currentWallet.key
			if (currentAddress === this.tx.node.recipient) { return 'in' }
			else if (currentAddress === this.tx.node.owner.address) { return 'out' }
			return null
		},
		isData () { return this.tx.node.data.size !== "0" },
		isValue () { return this.tx.node.quantity.winston !== "0" },
		relativeAddress () {
			if (this.direction === 'in') { return this.tx.node.owner.address }
			if (this.direction === 'out') { return this.tx.node.recipient }
			return null
		},
		value () {
			// return this.tx.node.fee.ar
			return this.tx.node.quantity.ar
		},
		dataInfo () {
			for (const tag of this.tx.node.tags) {
				if (tag.name == 'Service') { return tag.value }
			}
			for (const tag of this.tx.node.tags) {
				if (tag.name == 'App-Name') { return tag.value }
			}
			for (const tag of this.tx.node.tags) {
				if (tag.name == 'User-Agent') { return tag.value.split('/')[0] }
			}
		}
	}
}
</script>

<style scoped>
.tx-card {
	position: relative;
	display: flex;
	gap: var(--spacing);
	justify-content: space-between;
}

.left {
	flex: 0 0 auto;
	display: flex;
	align-items: center;
}

.right {
	flex: 1 1 0;
	display: flex;
	justify-content: flex-end;
	align-items: center;
	min-width: 0;
	overflow: hidden;
}

.right-content {
	flex: 1 1 0;
	min-width: 0;
	/* display: flex; */
	justify-content: flex-end;
	display: flex;
}

.right-text {
	flex: 0 1 auto;
	min-width: 0;
	text-align: right;
	white-space: nowrap;
}

.margin {
	flex: 0 0 auto;
	width: var(--spacing);
}

.address {
	max-width: 150px;
	margin-left: auto;
}

.tx-icon {
	width: 48px;
	height: 48px;
	padding: 8px;
	border-radius: var(--border-radius2);
	background: var(--background);
	flex: 0 0 auto;

	margin-right: var(--spacing);
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

.bottom {
	font-size: 0.75em;
	color: var(--element-secondary);
}
</style>