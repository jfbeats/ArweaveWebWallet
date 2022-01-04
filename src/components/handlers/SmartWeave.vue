<template>
	<div class="smart-weave">
		SmartWeave Contract
	</div>
</template>



<script setup>
import SmartweaveStore from '@/store/SmartweaveStore'
import { watch } from 'vue'

const props = defineProps(['tx'])

watch(() => props.tx, (tx) => {
	console.log(tx)
	if (!tx) { return }
	// get contract info
}, { immediate: true })
</script>