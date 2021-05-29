<template>
	<div class="balance">
		<div class="amounts">
			<Ar class="ar" :ar="wallet.balance" /><br>
			<LocaleCurrency class="currency" :ar="wallet.balance" />
		</div>
		<div class="info">
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
}
</script>

<style scoped>
.balance {
	border: 1px solid var(--border);
	border-radius: var(--border-radius);
	overflow: hidden;
	background: var(--background2);

}

.amounts {
	padding: var(--spacing);
	font-size: 2em;
}

.currency {
	font-size: 0.75em;
}

.info {
	padding: var(--spacing);
	font-size: 0.75em;
	color: var(--element-secondary);
	background: var(--background);
}
</style>
