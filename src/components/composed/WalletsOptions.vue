<template>
	<div>
		<div class="flex-row" style="justify-content: space-between; align-items: baseline">
			<h2>Wallet{{ selectedWallets.length > 1 ? 's' : '' }}</h2>
			<div class="update-message" v-if="hasUpdate">
				<Icon :icon="IconWarning" style="vertical-align: text-top" />
				<span> Update encryption</span>
			</div>
		</div>
		<div class="flex-column">
			<template v-for="wallet in selectedWallets" :key="wallet.id">
				<WalletOptions :wallet="wallet" />
				<Button v-if="canConnect" @click="() => sharedState.walletId = wallet.id">Connect</Button>
				<div></div>
			</template>
		</div>
		<Button v-if="!Wallets.length" style="font-size:1.5em; background:var(--background3);" @click="$router.push({ name: 'AddWallet' })" icon="+" />
	</div>
</template>



<script setup lang="ts">
import WalletOptions from '@/components/composed/WalletOptions.vue'
import Button from '@/components/atomic/Button.vue'
import Icon from '@/components/atomic/Icon.vue'
import { Wallets } from '@/functions/Wallets'
import { state } from '@/functions/Channels'
import { sharedState } from '@/functions/Connect'
import { hasUpdate } from '@/functions/Password'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import IconWarning from '@/assets/icons/shield_warning.svg?component'

const route = useRoute()

const selectedWallets = computed(() => {
	const editWallet = route.query.wallet
	if (!editWallet) { return Wallets.value }
	const editWalletArray = Array.isArray(editWallet) ? editWallet : [editWallet]
	return Wallets.value.filter(wallet => editWalletArray.includes(wallet.id + ''))
})
const canConnect = computed(() => ['popup', 'iframe', 'ws'].includes(state.value.type!) && !sharedState.value.walletId)
</script>



<style scoped>
.update-message {
	color: var(--red);
}
</style>