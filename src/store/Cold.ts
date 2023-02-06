import { useChannel } from '@/functions/Channels'
import { Wallets } from '@/functions/Wallets'
import { computed, watch } from 'vue'
import InterfaceStore from '@/store/InterfaceStore'
import { notify } from '@/store/NotificationStore'
import { awaitEffect } from '@/functions/AsyncData'

export const { state: coldState } = useChannel('cold')

export const ready = computed(() => !InterfaceStore.online)

export async function launchVault () {
	if (!ready.value) { const error = 'Device must be offline'; notify.error(error); throw error }
	if (coldState.value) { return }
	const excluded = Wallets.value.filter(wallet => wallet.state.hot).map(wallet => wallet.key!)
	coldState.value = { status: 'active', excluded }
}

async function init () {
	awaitEffect(() => coldState.value?.status === 'active').then(() => watch(Wallets, () => {
		if (Wallets.value.find(w => w.state.hot && w.key && !coldState.value?.excluded.includes(w.key))) { coldState.value!.status = 'compromised' }
	}, { immediate: true, deep: true }))
	watch(() => coldState.value?.status, status => {
		if (status === 'compromised') { notify.error({ requireInteraction: true, title: 'Online presence detected', body: 'Cold wallets are at risk of being compromised. You must transfer everything to new cold accounts in order to restore the same security properties.' }) }
	}, { immediate: true })
}
init()