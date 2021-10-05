<template>
	<div class="add-wallet flex-column">

		<div class="card">
			<h2 style="display:flex; justify-content:space-between;">
				<span>Passphrase</span>
				<span>Key file</span>
			</h2>
			<InputData v-model="passphraseInput" @files="importFile" :disabled="isCreatingWallet" placeholder="Import passphrase or key file" /><br>
			<Button v-if="!isCreatingWallet && !passphraseInput.length" @click="create()" :disabled="passphraseInput.length && !isPassphrase" :icon="require('@/assets/logos/arweave.svg')">
				Create new wallet
			</Button>

			<Button v-else-if="isCreatingWallet" :disabled="!createdWallet" @click="goToCreatedWallet" :icon="!createdWallet ? 'loader' : ''">
				{{ !createdWallet ? 'Generating, write down the passphrase' : 'Passphrase saved? Click here to proceed' }}
			</Button>

			<Button v-else :disabled="!isPassphrase || isGeneratingWallet" @click="isValidPassphrase ? importPassphrase() : confirmPassphrase()">
				Import passphrase
			</Button>
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
			<Button v-if="supportsWebUSB()" @click="importLedger()" :icon="require('@/assets/logos/ledger.svg')">
				Ledger
			</Button>
			<Button v-else disabled :icon="require('@/assets/logos/ledger.svg')">
				Ledger not supported for this browser
			</Button>
		</div>

	</div>
</template>

<script>
import InputData from '@/components/atomic/InputData.vue'
import Button from '@/components/atomic/Button.vue'
import Icon from '@/components/atomic/Icon.vue'
import Ledger from '@/functions/Ledger.js'
import { addWallet, watchWallet, generateMnemonic, validateMnemonic, addMnemonic } from '@/functions/Wallets.js'
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
	components: { InputData, Button, Icon },
	setup () {
		const router = useRouter()
		const passphraseInput = ref('')
		const popup = reactive({})
		const isPassphrase = computed(() => passphraseInput.value.trim().split(/\s+/g).length >= 12)
		const isValidPassphrase = computed(() => validateMnemonic(passphraseInput.value))
		const isCreatingWallet = ref(false)
		const isGeneratingWallet = ref(false)
		const createdWallet = ref(null)
		const create = async () => {
			isCreatingWallet.value = true
			passphraseInput.value = generateMnemonic()
			const wallet = addMnemonic(passphraseInput.value)
			setTimeout(async () => createdWallet.value = await wallet, 10000)
		}
		const goToCreatedWallet = () => {
			router.push({ name: 'EditWallet', query: { wallet: createdWallet.value.id } })
		}
		const importPassphrase = async () => {
			isGeneratingWallet.value = true
			const wallet = addMnemonic(passphraseInput.value)
			popup.enabled = true
			popup.icon = 'loader'
			popup.message = 'Importing'
			popup.actions = []
			router.push({ name: 'EditWallet', query: { wallet: (await wallet).id } })
		}
		const confirmPassphrase = () => {
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
		return { passphraseInput, popup, isPassphrase, isValidPassphrase, create, importLedger, supportsWebUSB, isCreatingWallet, isGeneratingWallet, createdWallet, goToCreatedWallet, importPassphrase, confirmPassphrase, importFile }
	},
}
</script>

<style scoped>
.add-wallet {
	width: 100%;
	min-height: var(--current-vh);
	padding: var(--spacing);
	align-items: center;
	justify-content: space-evenly;
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