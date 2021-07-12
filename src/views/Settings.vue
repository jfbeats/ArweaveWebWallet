<template>
	<div class="settings">
		<div class="column">
			<h2>Wallet Settings</h2>
			<div class="wallets">
				<WalletOptions class="wallet-options" v-for="wallet in ArweaveStore.wallets" :key="wallet.id" :wallet="wallet" />
			</div>
			<h2>App Settings</h2>
			<div class="group">
				<p>Currency</p>
				<Select class="" v-model="ArweaveStore.redstone.currency" :options="options" :icon="currencySymbol" />
			</div>
			<div class="group">
				<p>Fund the project</p>
				<InputAr v-model="amount" />
			</div>
		</div>
	</div>
</template>



<script>
import WalletOptions from '@/components/WalletOptions.vue'
import ArweaveStore from '@/store/ArweaveStore'
import InputAr from '@/components/atomic/InputAr.vue'
import Select from '@/components/atomic/Select.vue'
import axios from 'axios'
import { reactive, ref, computed } from 'vue'

export default {
	components: { WalletOptions, InputAr, Select },
	setup () {
		const amount = ref('')
		let options = reactive([])
		axios.get('https://raw.githubusercontent.com/redstone-finance/redstone-app/main/src/assets/data/tokens.json').then(response => {
			const results = response.data
			const message = ' Redstone Finance'
			options.push({ value: 'USD', text: 'USD' + message })
			for (const key in results) {
				if (results[key].tags?.includes('currencies')) { options.push({ value: key, text: key + message }) }
			}
		})
		const currencySymbol = computed(() => new Intl.NumberFormat(navigator.languages, { style: 'currency', currency: ArweaveStore.redstone.currency }).format(0).replace(/[\w\d\.\,\s]/g, '') || '$')
		return { ArweaveStore, options, amount, currencySymbol }
	},
}
</script>


<style scoped>
.settings {
	padding: 32px;
	background: var(--background2);
	width: 100%;
	display: flex;
	justify-content: center;
	/* box-shadow: 0 0 32px 0 #00000033; */
}

.column {
	width: 100%;
	max-width: 700px;
}

.group {
	margin-bottom: 3em;
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