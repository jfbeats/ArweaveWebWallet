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
			<transition name="fade-fast" mode="in-out">
				<div v-if="popup.enabled" :key="popup.message" class="overlay flex-column">
					<div style="flex:1 1 auto; display:flex; flex-direction:column; align-items:center; justify-content:space-evenly; margin-bottom:var(--spacing);">
						<Icon v-if="popup.icon" :icon="popup.icon" style="font-size: 2em;" />
						{{ popup.message }}
					</div>
					<div class="actions-container flex-row">
						<Button v-for="action in popup.actions" :key="action.name" @click="action.action">{{ action.name }}</Button>
					</div>
				</div>
			</transition>
		</div>
		<div class="card">
			<h2>Hardware</h2>
			<Button v-if="supportsWebUSB()" @click="importLedger()" :icon="LogoLedger">Ledger</Button>
			<Button v-else disabled :icon="LogoLedger">Ledger not supported for this browser</Button>
		</div>
<!--		<div class="card">-->
<!--			<h2>Address Only</h2>-->
<!--			<InputAddress v-model="targetInput" :actions="[importAddressOnlyAction]" />-->
<!--		</div>-->
	</div>
</template>



<script>
import InputData from '@/components/atomic/InputData.vue'
import InputAddress from '@/components/atomic/InputAddress.vue';
import Button from '@/components/atomic/Button.vue'
import Icon from '@/components/atomic/Icon.vue'
import Ledger from '@/functions/Ledger.js'
import { arweave } from '@/store/ArweaveStore'
import { addWallet, watchWallet, generateMnemonic, validateMnemonic, addMnemonic } from '@/functions/Wallets.ts'
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

import LogoArweave from '@/assets/logos/arweave.svg?component'
import LogoLedger from '@/assets/logos/ledger.svg?component'
import IconAddBox from '@/assets/icons/add_box.svg?component'

export default {
	components: { InputAddress, InputData, Button, Icon },
	setup () {
		const router = useRouter()
		const passphraseInput = ref('')
		const targetInput = ref('')
		const maskAddress = (address) => { return address.match(/^[a-z0-9_-]{0,43}$/i) }
		const popup = reactive({})
		const isPassphrase = computed(() => passphraseInput.value.trim().split(/\s+/g).length >= 12)
		const isCreatingWallet = ref(false)
		const isGeneratingWallet = ref(false)
		const createdWallet = ref(null)
		const create = async () => {
			isCreatingWallet.value = true
			passphraseInput.value = await generateMnemonic()
			const wallet = addMnemonic(passphraseInput.value)
			setTimeout(async () => createdWallet.value = await wallet, 10000)
		}
		const goToCreatedWallet = () => {
			router.push({ name: 'EditWallet', query: { wallet: createdWallet.value } })
		}
		const importPassphrase = async () => {
			isGeneratingWallet.value = true
			const wallet = addMnemonic(passphraseInput.value)
			popup.enabled = true
			popup.icon = 'loader'
			popup.message = 'Importing'
			popup.actions = []
			router.push({ name: 'EditWallet', query: { wallet: (await wallet) } })
		}
		const confirmPassphrase = async () => {
			if (await validateMnemonic(passphraseInput.value)) { return importPassphrase() }
			popup.enabled = true
			popup.icon = ''
			popup.message = 'This passphrase is not valid, do you want to import it anyway?'
			popup.actions = [
				{ name: 'Back', action: () => popup.enabled = false },
				{ name: 'Import Passphrase', action: () => importPassphrase() }
			]
		}
		const importFile = async (file) => {
			if (!file) { return }
			const wallet = await addWallet(JSON.parse(await file[0].text()))
			router.push({ name: 'EditWallet', query: { wallet: wallet.id } })
		}
		const importLedger = async () => {
			const wallet = await watchWallet(Ledger)
			router.push({ name: 'EditWallet', query: { wallet: wallet.id } })
		}
		const supportsWebUSB = () => {
			return !!window.navigator.usb
		}
		const importAddressOnlyAction = { icon: IconAddBox, run: () => {} }
		return { passphraseInput, targetInput, maskAddress, popup, isPassphrase, create, importLedger, supportsWebUSB, importAddressOnlyAction, isCreatingWallet, isGeneratingWallet, createdWallet, goToCreatedWallet, importPassphrase, confirmPassphrase, importFile, LogoArweave, LogoLedger }
	},
}
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

.actions-container {
	width: 100%;
}

.button {
	background-image: radial-gradient(circle at center, #81a1c166, #81a1c133);
	height: 5em;
	font-size: 1.1em;
	width: 100%;
}

.overlay {
	background: inherit;
	border-radius: inherit;
	padding: inherit;
	position: absolute;
	width: 100%;
	height: 100%;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	z-index: 10;
	align-items: center;
	justify-content: space-evenly;
}
</style>