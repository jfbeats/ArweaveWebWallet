<template>
	<div class="settings">
		<div class="column">
			<h2>Wallet Settings</h2>
			<div class="flex-column">
				<WalletOptions class="wallet-options" v-for="wallet in Wallets" :key="wallet.id" :wallet="wallet" />
				<Button v-if="!Wallets.length" style="font-size:1.5em; background:var(--background3);" @click="$router.push({ name: 'AddWallet' })" icon="+" />
			</div>
			<h2>App Settings</h2>
			<div class="group">
				<p>Gateway</p>
				<div class="flex-row">
					<Input v-model="gateway" :placeholder="ArweaveStore.gatewayURL" :icon="LogoArweave" style="flex:1 1 0;" @keyup.enter="gateway && setGateway()" />
					<Button @click="setGateway()">{{ gateway ? 'Submit' : 'Reset' }}</Button>
				</div>
			</div>
			<div class="group">
				<p>Currency</p>
				<Select v-model="ArweaveStore.conversion.settings" :options="options" :icon="currencySymbol" />
			</div>
			<!-- <div class="group">
				<p>Fund the project</p>
				<InputAr v-model="amount" />
			</div>-->
		</div>
	</div>
</template>



<script setup>
import WalletOptions from '@/components/composed/WalletOptions.vue'
import Input from '@/components/atomic/Input.vue'
import Select from '@/components/atomic/Select.vue'
import Button from '@/components/atomic/Button.vue'
import { Wallets } from '@/functions/Wallets'
import ArweaveStore, { updateArweave } from '@/store/ArweaveStore'
import axios from 'axios'
import { reactive, ref, computed } from 'vue'

import LogoArweave from '@/assets/logos/arweave.svg?component'

const gateway = ref('')
const setGateway = () => {
	// TODO test gateway url return if fail
	gateway.value ? updateArweave(gateway.value) : updateArweave()
	localStorage.setItem('gateway', gateway.value)
	gateway.value = ''
}

let options = reactive([])
axios.get('https://api.redstone.finance/configs/tokens').then(response => {
	const results = response.data
	const message = ' Redstone Finance'
	options.push({ value: { currency: 'USD', provider: 'redstone' }, text: 'USD' + message })
	for (const key in results) {
		if (results[key].tags?.includes('currencies')) { options.push({ value: { currency: key, provider: 'redstone' }, text: key + message }) }
	}
})
const currencySymbol = computed(() => new Intl.NumberFormat(navigator.languages, { style: 'currency', currency: ArweaveStore.conversion.settings.currency }).format(0).replace(/[\w\d\.\,\s]/g, '') || '$')

const amount = ref('')
</script>



<style scoped>
.settings {
	padding: var(--spacing);
	min-height: var(--current-vh);
	width: 100%;
	display: flex;
	justify-content: center;
	background: var(--background2);
}

.column {
	width: 100%;
	max-width: var(--column-width);
}

.group {
	margin-bottom: 3em;
}

.wallet-options {
	border-radius: var(--border-radius);
}
</style>