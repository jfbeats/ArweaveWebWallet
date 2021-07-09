<template>
	<div class="settings">
		<h2>Wallet Settings</h2>
		<div class="wallets">
			<WalletOptions class="wallet-options" v-for="wallet in ArweaveStore.wallets" :key="wallet.id" :wallet="wallet" />
		</div>
		<h2>App Settings</h2>
		<select v-model="ArweaveStore.redstone.currency">
			<option>USD</option>
			<option v-for="option in options" :key="option">{{ option }}</option>
		</select>
		<div>Data provided by Redstone Finance</div>
		<h2>Fund the project</h2>
		<InputAr v-model="amount" />
	</div>
</template>



<script>
import WalletOptions from '@/components/WalletOptions.vue'
import ArweaveStore from '@/store/ArweaveStore'
import InputAr from '@/components/atomic/InputAr.vue'
import axios from 'axios'
import { reactive, ref } from 'vue'

export default {
	components: { WalletOptions, InputAr },
	setup () {
		const options = reactive([])
		const amount = ref('')
		axios.get('https://raw.githubusercontent.com/redstone-finance/redstone-app/main/src/assets/data/tokens.json').then(response => {
			const results = response.data
			for (const key in results) {
				if (results[key].tags?.includes('currencies')) { options.push(key) }
			}
		})
		return { ArweaveStore, options, amount }
	},
}
</script>


<style scoped>
.settings {
	padding: 32px;
	background: var(--background2);
	width: 100%;
	/* box-shadow: 0 0 32px 0 #00000033; */
}

.wallets {
	display: flex;
	flex-direction: column;
	gap: var(--spacing);
}

.wallet-options {
	/* background: var(--background); */
	border-radius: var(--border-radius);
}
</style>