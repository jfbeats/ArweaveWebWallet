<template>
	<div class="settings">
		<h2>Wallet Settings</h2>
		<div class="wallets">
		<WalletOptions class="wallet-options" v-for="wallet in ArweaveStore.wallets" :key="wallet.id" :wallet="wallet" />
		</div>
		<h2>App Settings</h2>
	</div>
</template>



<script>
import WalletOptions from '@/components/WalletOptions'
import ArweaveStore from '@/store/ArweaveStore'

export default {
	components: { WalletOptions },
	setup () {
		return { ArweaveStore }
	}
}
</script>


<style scoped>
.settings {
	padding: 32px;
	background: var(--background2);
	width: 100%;
	/* box-shadow: 0 0 32px 0 #00000033; */
}

.wallets {
	display: flex;
	flex-direction: column;
	gap:var(--spacing);
}

.wallet-options {
	/* background: var(--background); */
	border-radius: var(--border-radius);
}
</style>