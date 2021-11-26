<template>
	<transition name="fade-fast" mode="out-in">
		<span class="ar" :key="amountRounded">
			{{ amountRounded || '' }}
			<span v-if="amountRounded" class="symbol">AR</span>
		</span>
	</transition>
</template>



<script setup>
import { computed } from 'vue'

const props = defineProps(['ar'])
const amountRounded = computed(() => {
	if (props.ar == null) { return null }
	const FractionDigits = new Intl.NumberFormat(navigator.languages, { maximumFractionDigits: 3 }).format(props.ar)
	const SignificantDigits = new Intl.NumberFormat(navigator.languages, { maximumSignificantDigits: 1 }).format(props.ar)
	return FractionDigits.length >= SignificantDigits.length ? FractionDigits : SignificantDigits
})
</script>



<style scoped>
.ar {
	white-space: nowrap;
	display: inline-block;
}

.ar::before {
	content: "\200b";
}

.symbol {
	font-size: 0.75em;
}
</style>
