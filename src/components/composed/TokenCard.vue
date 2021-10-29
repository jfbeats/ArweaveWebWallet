<template>
	<div class="token-card">
		<div class="token-content">
			<router-link class="left reset flex-row" :to="{ name: 'Tx', params: { txId: txId } }">
				<img class="img" :src="img" />
				<div>
					<div>{{ token.name }}</div>
					<div>
						{{ balance }}
						<span class="secondary-text">{{ token.ticker }}</span>
					</div>
				</div>
			</router-link>
		</div>
	</div>
</template>

<script>
import ArweaveStore from '@/store/ArweaveStore'
import SmartweaveStore from '@/store/SmartweaveStore'
import { computed } from 'vue'

export default {
	props: ['txId', 'wallet'],
	setup (props) {
		const token = computed(() => SmartweaveStore.contracts[props.txId])
		const img = computed(() => {
			if (!token.value.settings) { return }
			for (const setting of token.value.settings) {
				if (setting[0] === 'communityLogo') {
					return ArweaveStore.gatewayURL + setting[1]
				}
			}
		})
		const balance = computed(() => {
			return new Intl.NumberFormat(navigator.languages).format(token.value.balances[props.wallet.key])
		})
		return { token, img, balance }
	},
}
</script>

<style scoped>
.left {
	align-items: center;
}

.img {
	width: 48px;
	height: 48px;
}
</style>