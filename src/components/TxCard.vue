<template>
	<div class="tx-card" :class="{ verticalElement }">
		<div class="tx-content">
			<div class="left">

				<router-link :to="{ name: 'Tx', params: { txId: tx.id } }">
					<TxIcon class="tx-icon" :direction="direction" :isValue="isValue" :isData="isData" :isPending="isPending" />
				</router-link>
				<div class="margin" />

				<div>
					<div v-if="isValue">
						<Ar class="ar" :ar="value" />&nbsp;<LocaleCurrency class="small" :ar="value">|</LocaleCurrency>
					</div>
					<div v-else>
						{{ dataType || 'Data' }}
					</div>
					<div class="small">
						{{ context }}
					</div>
				</div>

			</div>
			<div class="right">

				<div class="right-content">
					<div class="right-text">
						<Address v-if="relativeAddress" class="address" :address="relativeAddress" />
						<div v-else class="ellipsis">
							<Ar :ar="tx.fee.ar" />&nbsp;<LocaleCurrency class="small" :ar="tx.fee.ar">|</LocaleCurrency>
						</div>
						<div class="small ellipsis">{{ date + ' ' + time }}</div>
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
				<span v-else class="cloud"><img class="file-type no-select" src="@/assets/icons/cloud.svg" draggable="false"></span>

			</div>
		</div>
	</div>
</template>

<script>
import Address from '@/components/atomic/Address'
import Ar from '@/components/atomic/Ar'
import LocaleCurrency from '@/components/atomic/LocaleCurrency'
import TxIcon from '@/components/atomic/TxIcon'
import AddressIcon from '@/components/atomic/AddressIcon'
import MoreInfo from '@/components/MoreInfo'
import ArweaveStore from '@/store/ArweaveStore'
import InterfaceStore from '@/store/InterfaceStore'

export default {
	components: { Address, Ar, TxIcon, AddressIcon, LocaleCurrency, MoreInfo },
	props: ['tx'],
	computed: {
		date () {
			if (this.isPending) { return 'pending' }
			return new Date(this.tx.block.timestamp * 1000).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
		},
		time () {
			if (this.isPending) { return '' }
			return new Date(this.tx.block.timestamp * 1000).toLocaleTimeString()
		},
		direction () {
			if (!ArweaveStore.currentWallet) { return null }
			const currentAddress = ArweaveStore.currentWallet.key
			if (currentAddress === this.tx.recipient) { return 'in' }
			else if (currentAddress === this.tx.owner.address) { return 'out' }
			return null
		},
		isData () { return this.tx.data.size !== "0" },
		isValue () { return this.tx.quantity.winston !== "0" },
		isPending () { return !this.tx.block },
		relativeAddress () {
			if (this.direction === 'in') { return this.tx.owner.address }
			if (this.direction === 'out') { return this.tx.recipient }
			return null
		},
		value () {
			return this.tx.quantity.ar
		},
		dataType () {
			if (!this.tx.data.type) { return }
			if (this.tx.data.type === 'application/x.arweave-manifest+json') { return 'Website'}
			return this.tx.data.type.split('/').join(' ')
		},
		dataInfo () {
			for (const tag of this.tx.tags) {
				if (tag.name == 'Service') { return tag.value }
			}
			for (const tag of this.tx.tags) {
				if (tag.name == 'App-Name') { return tag.value }
			}
			for (const tag of this.tx.tags) {
				if (tag.name == 'User-Agent') { return tag.value.split('/')[0] }
			}
		},
		context () {
			if (this.isValue && this.isData) {
				return this.dataInfo || this.dataType || 'Payment | Data'
			} else if (this.isValue) {
				return this.dataInfo || this.dataType || 'Payment'
			} else if (this.isData) {
				return this.dataInfo || 'Data'
			}
		},
		verticalElement () { return InterfaceStore.breakpoints.verticalLayout }
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
	display: flex;
	gap: var(--spacing);
	justify-content: space-between;
}

.verticalElement .tx-content {
	flex-direction: column;
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

.small {
	font-size: 0.75em;
	color: var(--element-secondary);
}
</style>