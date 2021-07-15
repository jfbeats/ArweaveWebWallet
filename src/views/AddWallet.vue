<template>
	<div class="add-wallet">

		<div class="card">
			<h2 style="display:flex; justify-content:space-between;">
				<span>Passphrase</span>
				<span>Key file</span>
			</h2>
			<InputData v-model="passphraseInput" @files="importFile" :disabled="isCreatingWallet" /><br>
			<Button v-if="!isCreatingWallet && !passphraseInput.length" @click="create()" :disabled="passphraseInput.length && !isPassphrase">
				<Icon :icon="require('@/assets/logos/arweave.svg')" />
				<div>Create new wallet</div>
			</Button>

			<Button v-else-if="isCreatingWallet" :disabled="!createdWallet" @click="goToCreatedWallet">
				<template v-if="!createdWallet">
					<Icon :icon="'loader'" />
					<div>Write down the passphrase</div>
				</template>
				<div v-else>Passphrase saved? Click here to proceed</div>
			</Button>

			<Button v-else :disabled="!isPassphrase || isGeneratingWallet" @click="isValidPassphrase ? importPassphrase() : confirmPassphrase()">
				<!-- TODO loading icon, disabled textarea -->
				<div>Import wallet</div>
			</Button>
			<transition name="fade-fast" mode="in-out">
				<div v-if="popup.enabled" :key="popup.message" class="overlay">
					<div style="flex:1 1 auto; display:flex; flex-direction:column; align-items:center; justify-content:space-evenly;">
						<Icon :icon="popup.icon" style="font-size: 2em;" />
						{{ popup.message }}
					</div>
					<div style="width:100%; display:flex; gap:var(--spacing);">
						<Button v-for="action in popup.actions" :key="action.name" @click="action.action">{{ action.name }}</Button>
					</div>
				</div>
			</transition>

		</div>

		<div class="card">
			<h2>Hardware</h2>
			<Button v-if="supportsWebUSB()" @click="importLedger()">
				<Icon :icon="require('@/assets/logos/ledger.svg')" />
				<div>Ledger</div>
			</Button>
			<Button v-else disabled>
				<Icon :icon="require('@/assets/logos/ledger.svg')" />
				<div>Ledger not supported for this browser</div>
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
			const wallet = await addMnemonic(passphraseInput.value)
			router.push({ name: 'EditWallet', query: { wallet: wallet.id } })
		}
		const confirmPassphrase = () => {
			popup.enabled = true
			popup.icon = ''
			popup.message = 'This passphrase is not valid, do you want to import it anyway?'
			popup.actions = [
				{ name: 'Back', action: () => popup.enabled = false },
				{
					name: 'Import Passphrase', action: () => {
						importPassphrase()
						popup.icon = 'loader'
						popup.message = 'Importing'
						popup.actions = []
					}
				}
			]
		}
		const importFile = async (file) => {
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
	padding: var(--spacing);
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-evenly;
	gap: var(--spacing);
	backdrop-filter: brightness(1.7);
}

.card {
	width: 100%;
	max-width: 700px;
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
	border: 1px solid var(--border);
}

.button:disabled {
	filter: grayscale(0.5) brightness(0.5);
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
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-evenly;
	gap: var(--spacing);
}
</style>