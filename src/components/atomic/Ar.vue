<template>
	<span class="ar">
		{{ amountRounded }} <span class="symbol">AR</span>
	</span>
</template>

<script>
export default {
	props: ['ar'],
	computed: {
		amountRounded () {
			if (!this.ar) { return null }
			const precision = 3
			return +(Math.round(this.ar + "e+" + precision) + "e-" + precision)
		}
	}
}
</script>

<style scoped>
.ar {
	white-space: nowrap;
}

.symbol {
	font-size: 0.75em;
}
</style>
