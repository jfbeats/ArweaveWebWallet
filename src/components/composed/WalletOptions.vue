<template>
	<div class="wallet-options flex-column">
		<div class="left">
			<AddressIcon class="profile" :address="wallet.key" />
			<div class="profile-info">
				<WalletInfo :wallet="wallet" />
			</div>
		</div>
		<div class="content flex-column">
<!--			<div class="flex-row">-->
<!--				<Select v-if="wallet.hasPrivateKey" v-model="wallet.settings.securityLevel" :options="securityOptions" />-->
<!--			</div>-->
			<div class="flex-row">
				<Button v-if="wallet.download && !wallet.metadata.methods.download?.unavailable" :icon="IconDownload" @click="() => wallet.download()">Download</Button>
				<Button :icon="IconX" @click="deleteWallet(wallet)">Delete</Button>
			</div>
		</div>
	</div>
</template>



<script setup lang="ts">
import AddressIcon from '@/components/atomic/AddressIcon.vue'
import WalletInfo from '@/components/composed/WalletInfo.vue'
import Button from '@/components/atomic/Button.vue'
import Select from '@/components/atomic/Select.vue'
import { deleteWallet } from '@/functions/Wallets'
import { Wallet } from '@/providers/WalletProxy'

import IconDownload from '@/assets/icons/download.svg?component'
import IconX from '@/assets/icons/x.svg?component'
import IconLock from '@/assets/icons/lock.svg?component'
import IconUnlock from '@/assets/icons/unlock.svg?component'

const props = defineProps<{
	wallet: Wallet
}>()

const securityOptions = [
	{ value: undefined, text: 'Unencrypted', icon: IconUnlock },
	{ value: 'inactivity', text: 'Encrypted - Lock when away', icon: IconLock },
	{ value: 'always', text: 'Encrypted - Always locked', icon: IconLock },
]
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