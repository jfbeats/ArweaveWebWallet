<template>
	<span class="locale-currency">
		<slot></slot> {{ converted }} <span class="symbol">USD</span>
	</span>
</template>

<script>
import { ArweaveStore } from '@/store/ArweaveStore'

export default {
	props: ['ar'],
	computed: {
		converted () {
			if (!this.ar || !ArweaveStore.currency.limestone) { return }
			const num = ArweaveStore.currency.limestone * this.ar
			return num.toFixed(2)
		}
	},
	async mounted () {
		ArweaveStore.updateConversionRate()
	}
}
</script>

<style scoped>
.locale-currency {
	white-space: nowrap;
}

.symbol {
	font-size: 0.75em;
}
</style>