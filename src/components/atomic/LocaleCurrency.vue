<template>
	<transition name="fade-fast" mode="out-in">
		<span class="locale-currency" :key="converted">{{ converted || '' }}</span>
	</transition>
</template>



<script setup lang="ts">
import { currency } from '@/store/CurrencyStore'
import { computed } from 'vue'
import { normalizeTo } from '@/store/ArweaveStore'

const props = defineProps<{
	ar?: string | number
	winston?: string | number
}>()

const ar = computed(() => normalizeTo('ar', props))
const currencyType = computed(() => currency.settings.currency)
const converted = computed(() => {
	if (ar.value == undefined || !currency.currentPrice.value) { return }
	const num = currency.currentPrice.value * parseFloat(ar.value)
	return new Intl.NumberFormat([...navigator.languages], { style: 'currency', currency: currencyType.value }).format(num)
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