<template>
	<div class="settings">
		<div class="column flex-column">
			<div>
				<h2>App Settings</h2>
				<SettingItem name="Install" v-if="PWA.installState" description="Use this website as an application that can also be added to your home screen" row="true">
					<Button @click="() => PWA.install()">{{ PWA.installState }}</Button>
				</SettingItem>
<!--				<SettingItem name="Notifications">-->
<!--				-->
<!--				</SettingItem>-->
				<SettingItem name="Gateway" description="URL of the service used to access network data">
					<Input v-model="gateway" :submit="gatewayAction" :placeholder="ArweaveStore.gatewayURL" :icon="IconDownload" style="flex:1 1 0;" />
				</SettingItem>
				<SettingItem name="Bundler" description="URL of the service used to submit data to the network when possible instead of using the gateway">
					<Input v-model="bundler" :submit="bundlerAction" :placeholder="ArweaveStore.bundlerURL" :icon="IconUpload" style="flex:1 1 0;" />
				</SettingItem>
				<SettingItem name="Currency">
					<Select v-model="currentSetting" :options="redstoneOptions" :icon="currency.symbol" />
				</SettingItem>
			</div>
			<div>
				<h2>Security</h2>
				<SettingItem name="Password" description="Used to encrypt selected wallets">
					<Input v-model="password" type="password" :placeholder="hasPassword ? 'Change password or remove' : 'Create a new password'" :submit="passwordAction" />
				</SettingItem>
				<SettingItem name="Stay unlocked" description="Time to wait before requiring the password again">
					<Select v-model="AppSettings.password.invalidateCache" :options="AppSettingsOptions.password.invalidateCache" />
				</SettingItem>
			</div>
			<WalletsOptions />
			<div>
				<h2>Links</h2>
				<Links />
			</div>
			<div>
				<h2>Browser Extensions</h2>
				<LinksExtension />
			</div>
			<div>
				<h2>Version Alpha</h2>
				<!-- Todo version history -->
			</div>
		</div>
	</div>
</template>



<script setup lang="ts">
import WalletsOptions from '@/components/composed/WalletsOptions.vue'
import SettingItem from '@/components/composed/SettingItem.vue'
import Input from '@/components/form/Input.vue'
import Select from '@/components/form/Select.vue'
import Button from '@/components/atomic/Button.vue'
import Links from '@/components/composed/Links.vue'
import LinksExtension from '@/components/composed/LinksExtension.vue'
import { PWA } from '@/pwa'
import { hasPassword, setPassword } from '@/functions/Password'
import ArweaveStore, { bundlerDefault, gatewayDefault, updateArweave, updateBundler } from '@/store/ArweaveStore'
import { AppSettings, AppSettingsOptions } from '@/store/SettingsStore'
import { currency, redstoneOptions } from '@/store/CurrencyStore'
import { notify } from '@/store/NotificationStore'
import { computed, ref } from 'vue'

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
const passwordAction = computed(() => ({
	run: async () => await setPassword(password.value) && (password.value = ''),
	icon: hasPassword.value && !password.value ? IconX : IconY
}))
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