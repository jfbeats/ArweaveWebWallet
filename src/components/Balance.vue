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
	--gradient1: var(--background2);
	--gradient2: var(--border);
	border-radius: 24px;
	overflow: hidden;
}

.amounts {
	padding: 48px var(--spacing);
	font-size: 2em;
	line-height: 1.2;
}

.currency {
	font-size: 0.5em;
}

.info {
	padding: var(--spacing);
	font-size: 0.75em;
	color: var(--element-secondary);
}

.actions {
	padding: var(--spacing);
	background: var(--background);
	display: flex;
}
</style>
