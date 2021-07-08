<template>
	<span class="ar">
		<transition name="fade-fast">
			<span v-if="ar"> {{ amountRounded }} <span class="symbol">AR</span></span>
		</transition>
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
	display: inline-block;
}

.symbol {
	font-size: 0.75em;
}
</style>
