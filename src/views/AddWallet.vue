<template>
	<div class="add-wallet">

		<div class="card">
			<h2 style="display:flex; justify-content:space-between;">
				<span>Passphrase</span>
				<span>Key file</span>
				<!-- TODO drag and drop -->
			</h2>
			<InputData v-model="passphraseInput" /><br>
			<Button v-if="!isCreatingWallet && !passphraseInput.length" @click="create()" :disabled="passphraseInput.length && !passphraseIsValid">
				<Icon :icon="require('@/assets/logos/arweave.svg')" />
				<div>Create new wallet</div>
			</Button>

			<Button v-else-if="isCreatingWallet" :disabled="!createdWallet" @click="goToCreatedWallet">
				<!-- TODO loading icon, disabled textarea -->
				<div v-if="!createdWallet">Write down the passphrase</div>
				<div v-else>Passphrase saved? Click here to proceed</div>
			</Button>

			<Button v-else :disabled="!passphraseIsValid || isGeneratingWallet" @click="importWallet()">
				<!-- TODO loading icon, disabled textarea -->
				<div>Import wallet</div>
			</Button>

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
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
	components: { InputData, Button, Icon },
	setup () {
		const router = useRouter()
		const passphraseInput = ref('')
		const passphraseIsValid = computed(() => validateMnemonic(passphraseInput.value))
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
		const importWallet = async () => {
			isGeneratingWallet.value = true
			const wallet = await addMnemonic(passphraseInput.value)
			router.push({ name: 'TxList', params: { walletId: wallet.id } })
		}
		const importLedger = async () => {
			const wallet = await watchWallet(Ledger)
			router.push({ name: 'EditWallet', query: { wallet: wallet.id } })
		}
		const supportsWebUSB = () => {
			return !!window.navigator.usb
		}
		return { passphraseInput, passphraseIsValid, create, importLedger, supportsWebUSB, isCreatingWallet, isGeneratingWallet, createdWallet, goToCreatedWallet, importWallet }
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
</style>