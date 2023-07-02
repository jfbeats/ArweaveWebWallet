<template>
	<div v-show="message" class="permission-card">
		<template v-if="message?.method === 'signTransaction'">
			<span>Sign transaction</span>
			<TxCard :tx="tx" />
			<TxCardExtension :tx="tx" />
		</template>
		<template v-if="message?.method === 'dispatch'">
			<span>Sign transaction and upload</span>
			<TxCard :tx="tx" />
			<TxCardExtension :tx="tx" />
		</template>
		<template v-if="message?.method === 'signDataItem'">
			<span>Sign data</span>
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
import { computed, ref, watch } from 'vue'
import { ICON } from '@/store/Theme'
import { recode } from '@/functions/Encode'
import type { ArweaveVerifier } from 'arweave-wallet-connector/lib/Arweave.js'

const props = defineProps<{ messageEntry: MessageEntry }>()

const message = ref(null as null | StoredMessage)

const tx = computed(() => {
	if (!['signTransaction', 'dispatch', 'signDataItem'].includes(message.value?.method!)) { return }
	const receivedTx = message.value?.params?.[0] as Parameters<ArweaveVerifier['signTransaction'] | ArweaveVerifier['signDataItem']>[0] | undefined
	if (!receivedTx) { return }
	if (message.value?.method === 'signDataItem') { return receivedTx }
	const tags = receivedTx.tags?.map(({name, value}) => ({ name: recode(name, 'b64url', 'string'), value: recode(value, 'b64url', 'string') }))
	return { ...receivedTx, tags }
})

watch(() => props.messageEntry, async () => {
	message.value = await getMessage(props.messageEntry)
}, { immediate: true })

const actions = [
	{ name: 'Accept', icon: ICON.y, run: () => props.messageEntry.status = 'accepted' },
	{ name: 'Reject', icon: ICON.x, run: () => props.messageEntry.status = 'rejected' },
]
const actionsPending = [{ name: 'Pending', icon: ICON.connection, run: () => {} }]
</script>



<style scoped>
.actions-list {
	justify-content: space-around;
}
</style>