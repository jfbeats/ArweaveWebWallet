<template>
	<div class="wallet-options">
		<div class="left">
			<AddressIcon class="profile" :address="wallet.key" />
			<div class="profile-info">
				<WalletInfo :wallet="wallet" />
			</div>
		</div>
		<div class="content">
			<div class="bottom">
				<div><button v-if="wallet.download && !wallet.metadata.methods.download?.unavailable" @click="wallet.download">Download</button></div>
				<div><button @click="deleteWallet(wallet)">Delete</button></div>
			</div>
		</div>
	</div>
</template>



<script setup lang="ts">
import AddressIcon from '@/components/atomic/AddressIcon.vue'
import WalletInfo from '@/components/composed/WalletInfo.vue'
import { deleteWallet } from '@/functions/Wallets'

const props = defineProps<{
	wallet: Provider
}>()
</script>



<style scoped>
.wallet-options {
	display: flex;
	flex-direction: column;
	/* padding: 16px 16px 16px 0; */
	/* background: var(--background2); */
	overflow: hidden;
}

.left {
	/* align-self: center; */
	flex: 0 0 auto;
	display: flex;
	/* flex-direction: column; */
	/* background: var(--background3); */
	align-items: center;
}

.content {
	flex: 1 1 auto;
	min-width: 0;
	display: flex;
	flex-direction: column;
	padding: 24px;
}

.bottom {
	/* background: var(--background2); */
	border-radius: var(--border-radius);
}

.profile {
	flex: 0 0 auto;
	width: 92px;
	height: 92px;
	background: var(--background);
	border-radius: var(--border-radius);
	/* border-radius: 50%; */
	padding: 24px;
}

.profile-info {
	min-width: 0;
	padding: 0 var(--spacing);
}
</style>