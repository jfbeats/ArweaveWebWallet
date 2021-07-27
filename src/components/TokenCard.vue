<template>
	<div class="token-card">
		<div class="token-content">
			<img class="img" :src="img">
			<div>
				<div>{{ token.name }}</div>
				<div>{{ balance }} <span>{{ token.ticker }}</span></div>
			</div>
		</div>
	</div>
</template>

<script>
import ArweaveStore from '@/store/ArweaveStore'

export default {
	props: ['token', 'wallet'],
	computed: {
		img () {
			if (!this.token.settings) { return }
			for (const setting of this.token.settings) {
				if (setting[0] === 'communityLogo') {
					return ArweaveStore.gatewayURL + setting[1]
				}
			}
		},
		balance () {
			return this.token.balances[this.wallet.key]
		}
	}
}
</script>

<style scoped>
.token-content {
	display: flex;
	align-items: center;
	gap: var(--spacing);
}

.img {
	width: 48px;
	height: 48px;
}
</style>