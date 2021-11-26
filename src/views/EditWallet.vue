<template>
	<div class="edit-wallet">
		<h2>Edit New Wallets</h2>
		<WalletOptions class="wallet-options card" v-for="wallet in wallets" :key="wallet.id" :wallet="wallet" />
	</div>
</template>



<script setup>
import WalletOptions from '@/components/composed/WalletOptions.vue'
import { computed } from 'vue'
import { Wallets } from '@/functions/Wallets'
import { useRoute } from 'vue-router'

const route = useRoute()
const wallets = computed(() => {
	const editWallet = route.query.wallet
	const editWalletArray = Array.isArray(editWallet) ? editWallet : [editWallet]
	console.log(editWalletArray)
	return Wallets.value.filter(wallet => editWalletArray.includes(wallet.id + ''))
})
</script>



<style scoped>
.edit-wallet {
	padding: var(--spacing);
	width: 100%;
}
</style>