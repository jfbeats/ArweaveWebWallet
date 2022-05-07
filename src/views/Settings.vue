<template>
	<div class="settings">
		<div class="column">
			<h2>Wallet Settings</h2>
			<div class="flex-column">
				<template v-for="wallet in Wallets" :key="wallet.id">
					<WalletOptions class="wallet-options" :wallet="wallet" />
					<div></div>
				</template>
				<Button v-if="!Wallets.length" style="font-size:1.5em; background:var(--background3);" @click="$router.push({ name: 'AddWallet' })" icon="+" />
			</div>
			<h2>App Settings</h2>
			<div class="group">
				<p>Gateway</p>
				<div class="flex-row">
					<Input v-model="gateway" :actions="[gatewayAction]" :placeholder="ArweaveStore.gatewayURL" :icon="IconDownload" style="flex:1 1 0;" />
				</div>
				<p>Bundler</p>
				<div class="flex-row">
					<Input v-model="bundler" :actions="[bundlerAction]" :placeholder="ArweaveStore.bundlerURL" :icon="IconUpload" style="flex:1 1 0;" />
				</div>
				<p>Currency</p>
				<Select v-model="currentSetting" :options="redstoneOptions" :icon="currency.symbol" />
			</div>
			<h2>Links</h2>
			<div class="group">
				<p v-if="isUser"><a href="https://discord.gg/W6VybRqwBP"><Icon :icon="LogoDiscord" style="vertical-align: text-top;" /> Discord</a> - Send feedback, questions or talk about anything</p>
				<p><a href="https://github.com/jfbeats/ArweaveWebWallet"><Icon :icon="LogoGithub" style="vertical-align: text-top;" /> ArweaveWebWallet</a> - Source code</p>
				<p><a href="https://jfbeats.github.io/ArweaveWalletConnector"><Icon :icon="LogoGithub" style="vertical-align: text-top;" /> ArweaveWalletConnector</a> - Integrate the universal connector to use web wallets like arweave.app inside your own applications</p>
				<p><a href="https://arwiki.wiki" target="_blank"><Icon :icon="LogoArweave" style="vertical-align: text-top;" /> Arwiki</a> - Information about Arweave</p>
			</div>
			Version: Alpha
			<!-- Todo version history -->
		</div>
	</div>
</template>



<script setup lang="ts">
import WalletOptions from '@/components/composed/WalletOptions.vue'
import Input from '@/components/atomic/Input.vue'
import Select from '@/components/atomic/Select.vue'
import Button from '@/components/atomic/Button.vue'
import Icon from '@/components/atomic/Icon.vue'
import { Wallets } from '@/functions/Wallets'
import ArweaveStore, { gatewayDefault, bundlerDefault, updateArweave, updateBundler } from '@/store/ArweaveStore'
import { currency, redstoneOptions } from '@/store/CurrencyStore'
import { notify } from '@/store/NotificationStore'
import { ref, computed } from 'vue'

import LogoArweave from '@/assets/logos/arweave.svg?component'
import LogoGithub from '@/assets/logos/socials/github.svg?component'
import LogoDiscord from '@/assets/logos/socials/discord.svg?component'

import IconDownload from '@/assets/icons/download.svg?component'
import IconUpload from '@/assets/icons/upload.svg?component'
import IconY from '@/assets/icons/y.svg?component'
import IconX from '@/assets/icons/x.svg?component'

const gateway = ref('')
const setGateway = async () => {
	try { await updateArweave(gateway.value) }
	catch (e) { notify.error('Invalid'); throw e }
	gateway.value = ''
}
const gatewayAction = computed(() => {
	if (!gateway.value && ArweaveStore.gatewayURL === gatewayDefault) { return }
	return { run: setGateway, icon: gateway.value ? IconY : IconX }
})

const bundler = ref('')
const setBundler = async () => {
	try { await updateBundler(bundler.value) }
	catch (e) { notify.error('Invalid'); throw e }
	bundler.value = ''
}
const bundlerAction = computed(() => {
	if (!bundler.value && ArweaveStore.bundlerURL === bundlerDefault) { return }
	return { run: setBundler, icon: bundler.value ? IconY : IconX }
})

const currentSetting = computed<{ currency: string, provider: string }>({
	get () { return { currency: currency.settings.currency, provider: currency.settings.provider } },
	set (value) {
		currency.settings.currency = value.currency
		currency.settings.provider = value.provider
	}
})

const isUser = computed(() => Wallets.value.length)

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

a {
	text-decoration: none;
}
</style>