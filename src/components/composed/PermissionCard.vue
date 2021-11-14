<template>
	<div v-if="messageEntry.message.method === 'signTransaction'" class="permission-card">
		<TxCard :tx="tx" />
		<TxCardExtension :tx="tx" />
		<ActionList :actions="actions" />
	</div>
</template>



<script>
import TxCard from '@/components/composed/TxCard.vue'
import TxCardExtension from '@/components/composed/TxCardExtension.vue'
import ActionList from '@/components/composed/ActionsList.vue'
import { ref } from 'vue'

import IconY from '@/assets/icons/y.svg?component'
import IconX from '@/assets/icons/x.svg?component'

export default {
	components: { TxCard, TxCardExtension, ActionList },
	props: ['messageEntry'],
	setup (props) {
		const tx = ref(null)
		if (props.messageEntry.message.method === 'signTransaction') {
			console.log(props.messageEntry.message.params.tx)
			const receivedTx = props.messageEntry.message.params.tx
			const tags = receivedTx.tags.map(({name, value}) => ({ name: window.atob(name), value: window.atob(value) }))
			tx.value = { ...receivedTx, tags }
		}
		const actions = [
			{ name: 'Accept', icon: IconY, run: () => props.messageEntry.status = 'accepted' },
			{ name: 'Reject', icon: IconX, run: () => props.messageEntry.status = 'rejected' },
		]
		return { tx, actions }
	}
}
</script>



<style scoped>
.actions-list {
	justify-content: space-around;
}
</style>