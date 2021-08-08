<template>
	<span class="ar">
		<transition name="fade-fast" mode="out-in">
			<span v-if="ar" :key="ar"> {{ amountRounded }} <span class="symbol">AR</span></span>
		</transition>
	</span>
</template>

<script>
export default {
	props: ['ar'],
	computed: {
		amountRounded () {
			if (!this.ar) { return null }
			const FractionDigits = new Intl.NumberFormat(navigator.languages, { maximumFractionDigits: 3 }).format(this.ar)
			const SignificantDigits = new Intl.NumberFormat(navigator.languages, { maximumSignificantDigits: 1 }).format(this.ar)
			return FractionDigits.length >= SignificantDigits.length ? FractionDigits : SignificantDigits
		}
	}
}
</script>

<style scoped>
.ar {
	white-space: nowrap;
	display: inline-block;
}

.symbol {
	font-size: 0.75em;
}
</style>
