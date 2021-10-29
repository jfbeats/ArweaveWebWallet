<template>
	<div class="balance flex-column">
		<div class="amounts">
			<div>
				<Ar :ar="wallet.balance" />
			</div>
			<div>
				<LocaleCurrency :ar="wallet.balance" />
			</div>
		</div>
		<WalletInfo :wallet="wallet" />
	</div>
</template>

<script>
import Ar from '@/components/atomic/Ar.vue'
import LocaleCurrency from '@/components/atomic/LocaleCurrency.vue'
import WalletInfo from '@/components/composed/WalletInfo.vue'

export default {
	components: { Ar, LocaleCurrency, WalletInfo },
	props: ['wallet'],
}
</script>

<style scoped>
.balance {
	border-radius: 24px;
	overflow: hidden;
	/* line-height: 1.2; */
	/* padding: var(--spacing) 0; */
	display: flex;
	flex-direction: column;
}

.balance > * {
	padding: var(--spacing);
}

.ar {
	font-size: 2em;
}
</style>
