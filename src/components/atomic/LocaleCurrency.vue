<template>
	<transition name="fade-fast" mode="out-in">
		<span class="locale-currency" :key="converted">{{ converted || '' }}</span>
	</transition>
</template>



<script setup>
import ArweaveStore from '@/store/ArweaveStore'
import { computed } from 'vue'

const props = defineProps(['ar'])
const currency = computed(() => ArweaveStore.conversion.settings.currency)
const converted = computed(() => {
	if (props.ar == null || !ArweaveStore.conversion.currentPrice) { return }
	const num = ArweaveStore.conversion.currentPrice * props.ar
	return new Intl.NumberFormat(navigator.languages, { style: 'currency', currency: currency.value }).format(num)
})
</script>



<style scoped>
.locale-currency {
	white-space: nowrap;
	display: inline-block;
}

.locale-currency::before {
	content: "\200b";
}
</style>