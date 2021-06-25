<template>
	<div v-if="tx" class="tx">
		<div class="content">

			<div>id {{ tx.id }}</div>
			<div>block {{ tx.block }}</div>

			<div>data.size {{ tx.data.size }}</div>
			<div>fee.ar {{ tx.fee.ar }}</div>

			<div>owner.address {{ tx.owner.address }}</div>
			<div>quantity.ar {{ tx.quantity.ar }}</div>
			<div>recipient {{ tx.recipient }}</div>

			<div>tags {{ tx.tags }}</div>

			<div>data...</div>
			
		</div>
	</div>
</template>

<script>
import ArweaveStore from '@/store/ArweaveStore'
import { ref, watch } from 'vue'

export default {
	props: ['txId'],
	setup (props) {
		const tx = ref(null)
		watch(() => props.txId, async () => {
			tx.value = await ArweaveStore.arDB.search('transaction').id(props.txId).find()
			console.log(tx.value)
		}, { immediate: true })
		return { tx }
	},
}
</script>

<style scoped>
.content {
	width: 100%;
	height: 100%;
	padding: var(--spacing);
}
</style>