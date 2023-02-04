import { useChannel } from '@/functions/Channels'
import { Wallets } from '@/functions/Wallets'
import { computed, watch } from 'vue'

const { state: cold } = useChannel('cold')
export const hotWallets = computed(() => Wallets.value.filter(wallet => wallet.hasPrivateKey && wallet.state.hot))
export const coldWallets = computed(() => Wallets.value.filter(wallet => wallet.hasPrivateKey && !wallet.state.hot))

watch(() => [cold.value, hotWallets.value.length], () => {
	if (!cold.value || !hotWallets.value.length) { return }
	if (cold.value.status !== 'compromised') { cold.value.status = 'compromised' }
	// todo notify user
})

export async function init () {
	if (cold.value) { return }
	const excluded = hotWallets.value.map(wallet => wallet.key!)
	cold.value = { status: 'active', excluded }
	// todo delete hot wallets
}