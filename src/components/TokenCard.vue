<template>
	<div class="token-card">
		<div class="token-content">
			<router-link class="left reset" :to="{ name: 'Tx', params: { txId: txId } }">
				<img class="img" :src="img">
				<div>
					<div>{{ token.name }}</div>
					<div>{{ balance }} <span class="small">{{ token.ticker }}</span></div>
				</div>
			</router-link>
		</div>
	</div>
</template>

<script>
import ArweaveStore from '@/store/ArweaveStore'

export default {
	props: ['token', 'txId', 'wallet'],
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
			return new Intl.NumberFormat(navigator.languages).format(this.token.balances[this.wallet.key])
		}
	}
}
</script>

<style scoped>
.left {
	display: flex;
	align-items: center;
	gap: var(--spacing);
}

.img {
	width: 48px;
	height: 48px;
}

.small {
	font-size: 0.75em;
}
</style>