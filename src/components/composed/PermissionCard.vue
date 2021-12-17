<template>
	<div class="permission-card">
		<template v-if="messageEntry.message.method === 'signTransaction'">
			<TxCard :tx="tx" />
			<TxCardExtension :tx="tx" />
		</template>
		<template v-else-if="messageEntry.message.method === 'getPublicKey'" class="permission-card">
			Share the public key
		</template>
		<template v-else-if="messageEntry.message.method === 'getArweaveConfig'" class="permission-card">
			Share the arweave config
		</template>
		<template v-else-if="messageEntry.message.method === 'sign'" class="permission-card">
			Sign data
		</template>
		<template v-else-if="messageEntry.message.method === 'decrypt'" class="permission-card">
			Decrypt data
		</template>
		<ActionList :actions="actions" />
	</div>
</template>



<script setup>
import TxCard from '@/components/composed/TxCard.vue'
import TxCardExtension from '@/components/composed/TxCardExtension.vue'
import ActionList from '@/components/composed/ActionsList.vue'
import { ref } from 'vue'

import IconY from '@/assets/icons/y.svg?component'
import IconX from '@/assets/icons/x.svg?component'

const props = defineProps(['messageEntry'])
const tx = ref(null)
if (props.messageEntry.message.method === 'signTransaction') {
	const receivedTx = props.messageEntry.message.params[0]
	const tags = receivedTx.tags.map(({name, value}) => ({ name: window.atob(name), value: window.atob(value) }))
	tx.value = { ...receivedTx, tags }
}
const actions = [
	{ name: 'Accept', icon: IconY, run: () => props.messageEntry.status = 'accepted' },
	{ name: 'Reject', icon: IconX, run: () => props.messageEntry.status = 'rejected' },
]
</script>



<style scoped>
.actions-list {
	justify-content: space-around;
}
</style>