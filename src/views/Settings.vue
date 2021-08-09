<template>
	<div class="settings">
		<div class="column">
			<h2>Wallet Settings</h2>
			<div class="flex-column">
				<WalletOptions class="wallet-options" v-for="wallet in ArweaveStore.wallets" :key="wallet.id" :wallet="wallet" />
				<Button v-if="!ArweaveStore.wallets.length" style="font-size:1.5em; background:var(--background3);" @click="$router.push({ name: 'AddWallet'})" icon="+" />
			</div>
			<h2>App Settings</h2>
			<div class="group">
				<p>Gateway</p>
				<div class="flex-row">
					<Input v-model="gateway" :placeholder="ArweaveStore.gatewayURL" :icon="require('@/assets/logos/arweave.svg')" style="flex:1 1 0;" />
					<Button @click="setGateway()">{{ gateway ? 'Submit' : 'Reset' }}</Button>
				</div>
			</div>
			<div class="group">
				<p>Currency</p>
				<Select v-model="ArweaveStore.redstone.currency" :options="options" :icon="currencySymbol" />
			</div>
			<!-- <div class="group">
				<p>Fund the project</p>
				<InputAr v-model="amount" />
			</div> -->
		</div>
	</div>
</template>



<script>
import WalletOptions from '@/components/WalletOptions.vue'
import Input from '@/components/atomic/Input.vue'
import InputAr from '@/components/atomic/InputAr.vue'
import Select from '@/components/atomic/Select.vue'
import Button from '@/components/atomic/Button.vue'
import Icon from '@/components/atomic/Icon.vue'
import ArweaveStore, { updateArweave } from '@/store/ArweaveStore'
import axios from 'axios'
import { reactive, ref, computed } from 'vue'

export default {
	components: { WalletOptions, Input, InputAr, Select, Button, Icon },
	setup () {
		const gateway = ref('')
		const setGateway = () => {
			gateway.value ? updateArweave(gateway.value) : updateArweave()
			localStorage.setItem('gateway', gateway.value)
		}

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

		const amount = ref('')

		return { ArweaveStore, gateway, setGateway, options, amount, currencySymbol }
	},
}
</script>


<style scoped>
.settings {
	padding: 32px;
	background: var(--background2);
	width: 100%;
	min-height: 100%;
	display: flex;
	justify-content: center;
}

.column {
	width: 100%;
	max-width: 700px;
}

.group {
	margin-bottom: 3em;
}

.wallet-options {
	border-radius: var(--border-radius);
}
</style>