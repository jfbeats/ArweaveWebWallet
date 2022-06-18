<template>
	<div class="settings">
		<div class="column flex-column">
			<div>
				<h2>App Settings</h2>
				<SettingItem name="Install" v-if="PWA.installState" description="Use this website as an application that can be added to your home screen" row="true">
					<Button @click="() => PWA.install()">{{ PWA.installState }}</Button>
				</SettingItem>
<!--				<SettingItem name="Notifications">-->
<!--				-->
<!--				</SettingItem>-->
				<SettingItem name="Gateway" description="URL of the service used to access network data">
					<Input v-model="gateway" :actions="[gatewayAction]" :placeholder="ArweaveStore.gatewayURL" :icon="IconDownload" style="flex:1 1 0;" />
				</SettingItem>
				<SettingItem name="Bundler" description="URL of the service used to submit data to the network when possible instead of using the gateway">
					<Input v-model="bundler" :actions="[bundlerAction]" :placeholder="ArweaveStore.bundlerURL" :icon="IconUpload" style="flex:1 1 0;" />
				</SettingItem>
				<SettingItem name="Currency">
					<Select v-model="currentSetting" :options="redstoneOptions" :icon="currency.symbol" />
				</SettingItem>
			</div>
<!--			<div>-->
<!--				<h2>Security</h2>-->
<!--				<SettingItem name="Password" description="Used to encrypt selected wallets">-->
<!--					<Input v-model="password" :actions="[passwordAction]" />-->
<!--				</SettingItem>-->
<!--				<SettingItem name="Stay unlocked" description="Time to wait before requiring the password again">-->
<!--					<Select />-->
<!--				</SettingItem>-->
<!--			</div>-->
			<div>
				<h2>Wallets</h2>
				<div class="flex-column">
					<template v-for="wallet in Wallets" :key="wallet.id">
						<WalletOptions class="wallet-options" :wallet="wallet" />
						<div></div>
					</template>
				</div>
				<Button v-if="!Wallets.length" style="font-size:1.5em; background:var(--background3);" @click="$router.push({ name: 'AddWallet' })" icon="+" />
			</div>
			<div>
				<h2>Links</h2>
				<SettingItem v-if="Wallets.length" :icon="LogoDiscord" name="Discord" description="Send feedback, questions or talk about anything" href="https://discord.gg/W6VybRqwBP" />
				<SettingItem :icon="LogoGithub" name="Github | Web Wallet" description="Source code" href="https://github.com/jfbeats/ArweaveWebWallet" />
				<SettingItem :icon="LogoGithub" name="Github | Wallet Connector" description="Integrate the universal connector to use web wallets like arweave.app inside your own applications" href="https://jfbeats.github.io/ArweaveWalletConnector" />
				<SettingItem :icon="IconText" name="Arwiki" description="Wiki on the Arweave protocol" href="https://arwiki.wiki" />
				<SettingItem :icon="IconText" name="Guide" description="How to get started using the wallet" href="https://docs.arweave.org/info/wallets/arweave-wallet" />
			</div>
			<div>
				<h2>Version Alpha</h2>
				<!-- Todo version history -->
			</div>
		</div>
	</div>
</template>



<script setup lang="ts">
import WalletOptions from '@/components/composed/WalletOptions.vue'
import SettingItem from '@/components/composed/SettingItem.vue'
import Input from '@/components/atomic/Input.vue'
import Select from '@/components/atomic/Select.vue'
import Button from '@/components/atomic/Button.vue'
import { PWA } from '@/pwa'
import { Wallets } from '@/functions/Wallets'
import { setPassword } from '@/functions/Password'
import ArweaveStore, { gatewayDefault, bundlerDefault, updateArweave, updateBundler } from '@/store/ArweaveStore'
import { currency, redstoneOptions } from '@/store/CurrencyStore'
import { notify } from '@/store/NotificationStore'
import { ref, computed } from 'vue'

import LogoGithub from '@/assets/logos/socials/github.svg?component'
import LogoDiscord from '@/assets/logos/socials/discord.svg?component'
import IconText from '@/assets/icons/text.svg?component'

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

const password = ref('')
const passwordAction = computed(() => ({ run: () => setPassword(password.value), icon: IconY }))
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

.wallet-options {
	border-radius: var(--border-radius);
}
</style>