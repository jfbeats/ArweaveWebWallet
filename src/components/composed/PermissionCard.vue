<template>
	<div v-if="messageEntry.message.method === 'signTransaction'">
		<TxCard :tx="messageEntry.message.params.tx" />
		<TxCardExtension :tx="messageEntry.message.params.tx" />
	</div>
</template>



<script>
import TxCard from '@/components/composed/TxCard.vue'
import TxCardExtension from '@/components/composed/TxCardExtension.vue'

export default {
	components: { TxCard, TxCardExtension },
	props: ['messageEntry'],
}
</script>