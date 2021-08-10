<template>
	<div class="smart-weave">
		SmartWeave Contract
	</div>
</template>

<script>
import SmartweaveStore from '@/store/SmartweaveStore'
import { watch } from 'vue'

export default {
	props: ['tx'],
	setup (props) {
		watch(() => props.tx, (tx) => {
			console.log(tx)
			if (!tx) { return }
			// get contract info
		}, { immediate: true })
	},
}
</script>

<style scoped>
</style>