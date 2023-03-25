<template>
	<div>
		<div class="flex-row" style="justify-content: space-between; align-items: center">
			<h2>Wallet{{ selectedWallets.length > 1 ? 's' : '' }}</h2>
			<TransitionsManager :fast="true">
				<Link v-if="securityMismatch" class="update-message" :key="'' + hasNoTargetWallets + hasPassword" @click="securityMismatchAction" style="text-align: right;">
					<Icon :icon="ICON.shieldWarning" style="vertical-align: text-top" />
					<span v-if="hasNoTargetWallets"> Select wallets to encrypt or click here to remove password</span>
					<span v-else-if="hasPassword"> Click here to update encryption</span>
					<span v-else> Click here to create a new password</span>
				</Link>
			</TransitionsManager>
		</div>
		<div class="flex-column">
			<template v-for="wallet in selectedWallets" :key="wallet.id">
				<WalletOptions :wallet="wallet" />
				<Button v-if="canConnect" @click="() => { sharedState.walletId = wallet.id; router.push('Connect') }">Connect</Button>
			</template>
		</div>
		<Button v-if="!Wallets.length" style="font-size:1.5em; background:var(--background3); width: 100%;" :to="{ name: 'AddWallet' }" icon="+" />
	</div>
</template>



<script setup lang="ts">
import WalletOptions from '@/components/composed/WalletOptions.vue'
import Button from '@/components/atomic/Button.vue'
import Icon from '@/components/atomic/Icon.vue'
import Link from '@/components/function/Link.vue'
import TransitionsManager from '@/components/visual/TransitionsManager.vue'
import { notify } from '@/store/NotificationStore'
import { Wallets } from '@/functions/Wallets'
import { state } from '@/functions/Channels'
import { sharedState } from '@/functions/Connect'
import { hasPassword, setPassword, hasUpdate, updateEncryption, hasNoTargetWallets } from '@/functions/Password'
import { computed, watch } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import { useRoute, useRouter } from '@/router'
import { ICON } from '@/store/Theme'

const route = useRoute()
const router = useRouter()

const selectedWallets = computed(() => {
	const editWallet = route.query.wallet
	if (!editWallet) { return Wallets.value }
	const editWalletArray = Array.isArray(editWallet) ? editWallet : [editWallet]
	return Wallets.value.filter(wallet => editWalletArray.includes(wallet.id + ''))
})
const canConnect = computed(() => ['popup', 'iframe', 'ws'].includes(state.value.type!) && !sharedState.value?.walletId)
const securityMismatch = computed(() => hasUpdate.value || hasNoTargetWallets.value)
const securityMismatchAction = computed(() => {
	if (hasNoTargetWallets.value) { return () => setPassword('') }
	if (hasUpdate.value) { return hasPassword.value ? () => updateEncryption() : () => setPassword('', true) }
})

let notificationClose: Function | undefined
onBeforeRouteLeave(() => {
	if (!securityMismatch.value) { return }
	const { promise, close } = notify.confirm({ title: 'Security changes are not applied', body: 'Are you sure you want to leave this page?' })
	if (notificationClose) { notificationClose() }
	notificationClose = close
	watch(hasUpdate, value => value && close())
	return promise
})
</script>



<style scoped>
.update-message {
	color: var(--red);
}
</style>