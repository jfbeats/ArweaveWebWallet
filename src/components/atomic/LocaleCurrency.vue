<template>
	<transition name="fade-fast" mode="out-in">
		<span class="locale-currency" :key="converted">{{ converted || '' }}</span>
	</transition>
</template>

<script>
import ArweaveStore from '@/store/ArweaveStore'

export default {
	props: ['ar'],
	computed: {
		converted () {
			if (!this.ar || !ArweaveStore.conversion.currentPrice) { return }
			const num = ArweaveStore.conversion.currentPrice * this.ar
			return new Intl.NumberFormat(navigator.languages, { style: 'currency', currency: this.currency }).format(num)
		},
		currency () {
			return ArweaveStore.conversion.settings.currency
		},
	},
}
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