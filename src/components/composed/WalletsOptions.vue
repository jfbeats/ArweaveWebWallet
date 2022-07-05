<template>
	<div>
		<div class="flex-row" style="justify-content: space-between; align-items: baseline">
			<h2>Wallet{{ selectedWallets.length > 1 ? 's' : '' }}</h2>
			<Link class="update-message" v-if="hasUpdate" @click="updateEncryption" :disabled="!hasPassword">
				<Icon :icon="IconWarning" style="vertical-align: text-top" />
				<span v-if="hasPassword"> Click to update encryption</span>
				<span v-else> Create a new password to encrypt selected wallets</span>
			</Link>
		</div>
		<div class="flex-column">
			<template v-for="wallet in selectedWallets" :key="wallet.id">
				<WalletOptions :wallet="wallet" />
				<Button v-if="canConnect" @click="() => sharedState.walletId = wallet.id">Connect</Button>
				<div></div>
			</template>
		</div>
		<Button v-if="!Wallets.length" style="font-size:1.5em; background:var(--background3); width: 100%;" @click="$router.push({ name: 'AddWallet' })" icon="+" />
	</div>
</template>



<script setup lang="ts">
import WalletOptions from '@/components/composed/WalletOptions.vue'
import Button from '@/components/atomic/Button.vue'
import Icon from '@/components/atomic/Icon.vue'
import { Wallets } from '@/functions/Wallets'
import { state } from '@/functions/Channels'
import { sharedState } from '@/functions/Connect'
import { hasPassword, hasUpdate, updateEncryption } from '@/functions/Password'
import { computed, watch } from 'vue'
import { onBeforeRouteLeave, useRoute } from 'vue-router'

import IconWarning from '@/assets/icons/shield_warning.svg?component'
import Link from '@/components/function/Link.vue'
import { notify } from '@/store/NotificationStore'

const route = useRoute()

const selectedWallets = computed(() => {
	const editWallet = route.query.wallet
	if (!editWallet) { return Wallets.value }
	const editWalletArray = Array.isArray(editWallet) ? editWallet : [editWallet]
	return Wallets.value.filter(wallet => editWalletArray.includes(wallet.id + ''))
})
const canConnect = computed(() => ['popup', 'iframe', 'ws'].includes(state.value.type!) && !sharedState.value.walletId)

onBeforeRouteLeave(() => {
	if (!hasUpdate.value) { return }
	const { promise, close } = notify.confirm('exit?')
	watch(hasUpdate, value => value && close())
	return promise
})
</script>



<style scoped>
.update-message {
	color: var(--red);
}
</style>