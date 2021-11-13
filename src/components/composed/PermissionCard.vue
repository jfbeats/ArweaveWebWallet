<template>
	<div v-if="messageEntry.message.method === 'signTransaction'">
		<TxCard :tx="tx" />
		<TxCardExtension :tx="tx" />
	</div>
</template>



<script>
import TxCard from '@/components/composed/TxCard.vue'
import TxCardExtension from '@/components/composed/TxCardExtension.vue'
import { ref } from 'vue'

export default {
	components: { TxCard, TxCardExtension },
	props: ['messageEntry'],
	setup (props) {
		const tx = ref(null)
		if (props.messageEntry.message.method === 'signTransaction') {
			console.log(props.messageEntry.message.params.tx)
			const receivedTx = props.messageEntry.message.params.tx
			const tags = receivedTx.tags.map(({name, value}) => ({ name: window.atob(name), value: window.atob(value) }))
			tx.value = { ...receivedTx, tags }
		}
		return { tx }
	}
}
</script>