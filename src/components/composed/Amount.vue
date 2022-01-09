<template>
	<span>
		<Ar :ar="amount" />&nbsp;
		<LocaleCurrency class="secondary-text" :ar="amount" />
	</span>
</template>



<script setup lang="ts">
import Ar from '@/components/atomic/Ar.vue'
import LocaleCurrency from '@/components/atomic/LocaleCurrency.vue'
import { arweave } from '@/store/ArweaveStore'
import { ref, watch } from 'vue'

const props = defineProps(['ar', 'winston'])

const amount = ref(undefined as undefined | string)
watch(() => props, async () => {
	if (props.ar) { return amount.value = props.ar }
	if (props.winston) { return amount.value = arweave.ar.winstonToAr(props.winston) }
	amount.value = undefined
}, { immediate: true, deep: true })
</script>