<template>
	<span class="locale-currency">
		<slot></slot> {{ converted }} <span class="symbol">{{ currency }}</span>
	</span>
</template>

<script>
import ArweaveStore from '@/store/ArweaveStore'

export default {
	props: ['ar'],
	computed: {
		converted () {
			if (!this.ar || !ArweaveStore.redstone.currentPrice) { return }
			const num = ArweaveStore.redstone.currentPrice * this.ar
			return num.toFixed(2)
		},
		currency () {
			return ArweaveStore.redstone.currency
		}
	},
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