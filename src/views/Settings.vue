<template>
	<div class="settings">
		<div class="column flex-column">
			<div>
				<h2>App Settings</h2>
				<SettingItem name="Install" v-if="PWA.installState" description="Use this website as an application that can also be added to your home screen" row="true">
					<Button @click="() => PWA.install()">{{ PWA.installState }}</Button>
				</SettingItem>
<!--				<SettingItem name="Notifications">-->
<!--				</SettingItem>-->
				<SettingItem name="Gateway" description="URL of the service used to access network data">
					<Input v-model="gateway" :submit="gatewayAction" :placeholder="ArweaveStore.gatewayURL" :icon="ICON.download" style="flex:1 1 0;" />
				</SettingItem>
				<SettingItem name="Bundler" description="URL of the service used to submit data to the network when possible instead of using the gateway">
					<Input v-model="bundler" :submit="bundlerAction" :placeholder="ArweaveStore.bundlerURL" :icon="ICON.upload" style="flex:1 1 0;" />
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
				<SettingItem name="Reset application" description="Clear all accounts, settings and password" row="true">
					<Button :run="reset" :icon="ICON.x" :glow="true" color="var(--red)">Reset</Button>
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
				<div class="secondary-text">
					Permanently stored version history coming soon
				</div>
				<div class="secondary-text">
					Anonymized telemetry is used to improve the service
				</div>
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
import { ICON } from '@/store/Theme'

const gateway = ref('')
const setGateway = async () => {
	try { await updateArweave(gateway.value) }
	catch (e) { notify.error('Invalid'); throw e }
	gateway.value = ''
}
const gatewayAction = computed(() => {
	if (!gateway.value && ArweaveStore.gatewayURL === gatewayDefault) { return }
	return { run: setGateway, icon: gateway.value ? ICON.y : ICON.x }
})

const bundler = ref('')
const setBundler = async () => {
	try { await updateBundler(bundler.value) }
	catch (e) { notify.error('Invalid'); throw e }
	bundler.value = ''
}
const bundlerAction = computed(() => {
	if (!bundler.value && ArweaveStore.bundlerURL === bundlerDefault) { return }
	return { run: setBundler, icon: bundler.value ? ICON.y : ICON.x }
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
	icon: hasPassword.value && !password.value ? ICON.x : ICON.y
}))

const reset = async () => {
	if (!await notify.confirm('Reset application?').promise) { return }
	const clearDB = async (db: IDBDatabaseInfo) => new Promise<void>(res => { if (!db.name) { return res() }; setTimeout(res, 1000); const req = indexedDB.deleteDatabase(db.name); req.onerror = () => res(); req.onsuccess = () => res(); })
	const promise = Promise.all([
		indexedDB.databases().then(dbs => Promise.all(dbs.map(clearDB))),
		navigator.serviceWorker.getRegistrations().then(registrations => Promise.all(registrations.map(r => r.unregister()))),
		window.caches?.keys().then(keys => Promise.all(keys.map(key => window.caches.delete(key)))),
	].map(p => p && p.catch(e => notify.error(e))))
	try {
		localStorage.clear()
		sessionStorage.clear()
		document.cookie.split(';').forEach(c => { document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/'); })
	} catch (e: any) { notify.error(e) }
	await promise; notify.log('cleared'); location.reload();
}
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