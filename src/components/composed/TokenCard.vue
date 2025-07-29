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

<script setup lang="ts">
import ArweaveStore from '@/store/ArweaveStore'
import SmartweaveStore from '@/store/SmartweaveStore'
import { computed } from 'vue'

const props = defineProps<{ txId: string, wallet: Wallet }>()

const token = computed(() => ({}))
const img = computed(() => {
	if (!token.value.settings) { return }
	for (const setting of token.value.settings) {
		if (setting[0] === 'communityLogo') {
			return ArweaveStore.gatewayURL + setting[1]
		}
	}
})
const balance = computed(() => {
	return 0
	return new Intl.NumberFormat(navigator.languages).format(token.value.balances[props.wallet.key])
})

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