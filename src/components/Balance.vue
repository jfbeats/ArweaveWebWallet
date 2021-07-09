<template>
	<div class="balance">
		<div class="amounts">
			<Ar class="ar" :ar="wallet.balance" /><br>
			<LocaleCurrency class="currency" :ar="wallet.balance" />
		</div>
		<div>
			<div class="wallet-info"><img class="logo" :src="walletInfo.img">{{ walletInfo.name }}</div>
			<Address :address="wallet.key" />
		</div>
	</div>
</template>

<script>
import Address from '@/components/atomic/Address'
import Ar from '@/components/atomic/Ar'
import LocaleCurrency from '@/components/atomic/LocaleCurrency'

export default {
	components: { Address, Ar, LocaleCurrency },
	props: ['wallet'],
	computed: {
		walletInfo () {
			if (this.wallet.metaData?.provider === 'Ledger') { return { img: require('@/assets/logos/ledger.svg'), name: 'Ledger' } }
			return { img: require('@/assets/logos/arweave.svg'), name: 'Arweave wallet' }
		}
	}
}
</script>

<style scoped>
.balance {
	border-radius: 24px;
	overflow: hidden;
	line-height: 1.2;
	padding: var(--spacing) 0;
	display: flex;
	flex-direction: column;
}

.balance > * {
	padding: var(--spacing);
	margin-bottom: var(--spacing);
}

.amounts {
	font-size: 2em;
}

.currency {
	font-size: 0.5em;
}

.wallet-info {
	margin: 0 0 var(--spacing) 0;
	display: flex;
	height: 1em;
}

.logo {
	opacity: var(--element-secondary-opacity);
	margin-inline-end: 8px;
}

.address {
	font-size: 0.75em;
	color: var(--element-secondary);
}
</style>
