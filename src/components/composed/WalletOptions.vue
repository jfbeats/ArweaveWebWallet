<template>
	<div class="wallet-options flex-column">
		<div class="left">
			<AddressIcon class="profile" :address="wallet.key" />
			<div class="profile-info">
				<WalletInfo :wallet="wallet" />
			</div>
		</div>
		<div class="content flex-column">
			<div v-if="wallet.hasPrivateKey" class="flex-row">
				<Select v-model="wallet.settings.securityLevel" :options="securityOptions" />
			</div>
			<div class="flex-row">
				<Button v-if="addRelay" :run="addRelay" :icon="ICON.upload" :glow="glow" color="var(--blue)">Add Relay</Button>
				<Button v-if="wallet.download && !wallet.metadata.methods.download?.unavailable" :icon="ICON.download" @click="() => wallet.download()">Backup Keyfile</Button>
				<Button :icon="ICON.x" @click="deleteWallet(wallet)">Delete</Button>
			</div>
		</div>
	</div>
</template>



<script setup lang="ts">
import AddressIcon from '@/components/atomic/AddressIcon.vue'
import WalletInfo from '@/components/composed/WalletInfo.vue'
import Button from '@/components/atomic/Button.vue'
import Select from '@/components/form/Select.vue'
import { deleteWallet } from '@/functions/Wallets'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { coldState } from '@/store/Cold'
import { requestRelay } from '@/functions/Export'
import { ICON } from '@/store/Theme'

const props = defineProps<{
	wallet: Wallet
}>()

const securityOptions = [
	{ value: undefined, text: 'Unencrypted', icon: ICON.unlock },
	{ value: 'inactivity', text: 'Encrypted - Lock when away', icon: ICON.lock },
	{ value: 'always', text: 'Encrypted - Always locked', icon: ICON.lock },
]
const glow = ref(true)
onMounted(async () => {
	const unmount = new Promise<void>(res => onUnmounted(res))
	const interval = setInterval(() => glow.value = !glow.value, 1000)
	await unmount
	clearInterval(interval)
})
const addRelay = computed(() => {
	if (!coldState.value?.status || !props.wallet.hasPrivateKey || props.wallet.state.hot) { return }
	return () => requestRelay(props.wallet)
})
</script>



<style scoped>
.wallet-options {
	display: flex;
	flex-direction: column;
}

.left {
	flex: 0 0 auto;
	display: flex;
	align-items: center;
}

.content {
	flex: 1 1 auto;
	min-width: 0;
	overflow: visible;
}

.bottom {
	border-radius: var(--border-radius);
}

.profile {
	flex: 0 0 auto;
	width: 92px;
	height: 92px;
	background: var(--background);
	border-radius: var(--border-radius);
	padding: 24px;
}

.profile-info {
	min-width: 0;
	padding: 0 var(--spacing);
}
</style>