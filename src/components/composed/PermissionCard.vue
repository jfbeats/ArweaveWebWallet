<template>
	<div v-if="message" class="permission-card">
		<template v-if="message?.method === 'signTransaction'">
			<TxCard :tx="tx" />
			<TxCardExtension :tx="tx" />
		</template>
		<template v-else-if="message?.method === 'getPublicKey'" class="permission-card">
			Share the public key
		</template>
		<template v-else-if="message?.method === 'getArweaveConfig'" class="permission-card">
			Share the arweave config
		</template>
		<template v-else-if="message?.method === 'sign'" class="permission-card">
			Sign data
		</template>
		<template v-else-if="message?.method === 'decrypt'" class="permission-card">
			Decrypt data
		</template>
		<transition name="fade" mode="out-in">
			<ActionList v-if="!messageEntry.status" :actions="actions" />
			<ActionList v-else :actions="actionsPending" />
		</transition>
	</div>
</template>



<script setup lang="ts">
import TxCard from '@/components/composed/TxCard.vue'
import TxCardExtension from '@/components/composed/TxCardExtension.vue'
import ActionList from '@/components/composed/ActionsList.vue'
import { getMessage } from '@/functions/JsonRpc'
import { ArweaveVerifier } from 'arweave-wallet-connector/lib/ArweaveWebWallet'
import { computed, ref, watch } from 'vue'

import IconY from '@/assets/icons/y.svg?component'
import IconX from '@/assets/icons/x.svg?component'
import IconConnection from '@/assets/icons/connection.svg?component'

const props = defineProps<{ messageEntry: MessageEntry }>()

const message = ref(null as null | StoredMessage)

const tx = computed(() => {
	if (message.value?.method !== 'signTransaction') { return }
	const receivedTx = message.value?.params?.[0] as Parameters<ArweaveVerifier['signTransaction']>[0]
	const tags = receivedTx.tags?.map(({name, value}) => ({ name: window.atob(name), value: window.atob(value) }))
	return { ...receivedTx, tags }
})

watch(() => props.messageEntry, async () => {
	message.value = await getMessage(props.messageEntry)
}, { immediate: true })

const actions = [
	{ name: 'Accept', icon: IconY, run: () => props.messageEntry.status = 'accepted' },
	{ name: 'Reject', icon: IconX, run: () => props.messageEntry.status = 'rejected' },
]
const actionsPending = [{ name: 'Pending', icon: IconConnection, run: () => {} }]
</script>



<style scoped>
.actions-list {
	justify-content: space-around;
}
</style>