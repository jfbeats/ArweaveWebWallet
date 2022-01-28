<template>
	<div class="add-wallet flex-column">
		<div class="card">
			<h2 style="display:flex; justify-content:space-between;">
				<span>Passphrase</span>
				<span>Key file</span>
			</h2>
			<div class="flex-column">
				<InputData v-model="passphraseInput" @files="importFile" :disabled="isCreatingWallet" placeholder="Import passphrase or key file" />
				<div />
				<Button v-if="!isCreatingWallet && !passphraseInput.length" @click="create()" :disabled="passphraseInput.length && !isPassphrase" :icon="LogoArweave">Create new wallet</Button>
				<Button v-else-if="isCreatingWallet" :disabled="createdWallet == null" @click="goToCreatedWallet" :icon="createdWallet == null ? 'loader' : ''">{{ createdWallet == null ? 'Generating, write down the passphrase' : 'Passphrase saved? Click here to proceed' }}</Button>
				<Button v-else :disabled="!isPassphrase || isGeneratingWallet" @click="confirmPassphrase">Import passphrase</Button>
			</div>
			<OverlayPrompt :options="popup" />
		</div>
		<div class="card">
			<h2>Hardware</h2>
			<template v-for="provider in hardwareProviders" :key="provider.metadata.name">
				<Button :disabled="!provider.metadata.isSupported" @click="importProvider(provider)" :icon="provider.metadata.icon">
					{{ provider.metadata.name }} {{ !provider.metadata.isSupported ? ' not supported for this browser' : '' }}
				</Button>
			</template>
		</div>
		<div class="card">
			<h2>Address Only</h2>
			<InputAddress v-model="targetInput" :actions="[importAddressOnlyAction]" />
		</div>
	</div>
</template>



<script setup lang="ts">
import InputData from '@/components/atomic/InputData.vue'
import InputAddress from '@/components/atomic/InputAddress.vue';
import Button from '@/components/atomic/Button.vue'
import Icon from '@/components/atomic/Icon.vue'
import { LedgerProvider } from '@/providers/Ledger'
import { arweave } from '@/store/ArweaveStore'
import { addWallet, addAddress, generateMnemonic, validateMnemonic, addMnemonic, addProvider } from '@/functions/Wallets'
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

import LogoArweave from '@/assets/logos/arweave.svg?component'
import IconAddBox from '@/assets/icons/add_box.svg?component'
import OverlayPrompt from '@/components/layout/OverlayPrompt.vue'

const router = useRouter()
const passphraseInput = ref('')
const targetInput = ref('')
// const maskAddress = (address) => { return address.match(/^[a-z0-9_-]{0,43}$/i) }
const popup = ref(undefined as undefined | object)
const isPassphrase = computed(() => passphraseInput.value.trim().split(/\s+/g).length >= 12)
const isCreatingWallet = ref(false)
const isGeneratingWallet = ref(false)
const createdWallet = ref(null as null | string)
const create = async () => {
	isCreatingWallet.value = true
	passphraseInput.value = await generateMnemonic()
	const id = addMnemonic(passphraseInput.value)
	setTimeout(async () => createdWallet.value = await id, 10000)
}
const goToCreatedWallet = () => {
	router.push({ name: 'EditWallet', query: { wallet: createdWallet.value } })
}
const importPassphrase = async () => {
	isGeneratingWallet.value = true
	const id = addMnemonic(passphraseInput.value)
	popup.value = {
		icon: 'loader',
		message: 'importing',
	}
	router.push({ name: 'EditWallet', query: { wallet: await id } })
}
const confirmPassphrase = async () => {
	if (await validateMnemonic(passphraseInput.value)) { return importPassphrase() }
	popup.value = {
		message: 'This passphrase is not valid, do you want to import it anyway?',
		actions: [
			{ name: 'Back', run: () => popup.value = undefined },
			{ name: 'Import Passphrase', run: () => importPassphrase() },
		]
	}
}
const importFile = async (file: File[]) => {
	if (!file) { return }
	const id = await addWallet(JSON.parse(await file[0].text()))
	router.push({ name: 'EditWallet', query: { wallet: id } })
}
const importProvider = async (provider: Provider) => {
	const id = await addProvider(provider)
	router.push({ name: 'EditWallet', query: { wallet: id } })
}
const hardwareProviders = [LedgerProvider]
const importAddressOnlyAction = { icon: IconAddBox, run: async () => {
	const id = await addAddress(targetInput.value)
	router.push({ name: 'EditWallet', query: { wallet: id } })
}}
</script>



<style scoped>
.add-wallet {
	width: 100%;
	min-height: var(--current-vh);
	padding: var(--spacing);
	align-items: center;
}

.card {
	width: 100%;
	max-width: var(--column-width);
	overflow: hidden;
}

.input-data {
	text-align: center;
}

.button {
	background-image: radial-gradient(circle at center, #81a1c166, #81a1c133);
	height: 5em;
	font-size: 1.1em;
	width: 100%;
}
</style>