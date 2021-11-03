<template>
	<div class="connection-card flex-column">
		<div class="flex-row">
			<button type="button" class="flex-row" @click="navigateBack" :disabled="!navigateBackAvailable(state.origin, state.session)">
				<IconBackground :img="state.appInfo?.logo" :icon="iconConnection" />
				<div>
					<div>{{ state.appInfo?.name || 'Connector' }}</div>
					<div class="secondary-text">{{ state.origin }}</div>
				</div>
				<Icon v-if="navigateBackAvailable(state.origin, state.session)" :icon="iconLauch" />
			</button>
			<WalletSelector v-model="state.wallet" :default="defaultAddress" :exit="true" :active="!isSelectingWallet" @selectWallet="selectWallet" @exit="disconnect" />
		</div>
		<div class="flex-column" style="flex: 1 1 0;">
			<Tabs :tabs="tabs" v-model="currentTab" :disabled="!currentAddress" />
			<div class="container">
				<transition :name="transitionName" mode="out-in">
					<div :key="(currentAddress || '') + currentTab" class="content">
						<div v-if="currentTab === 'Requests'">
							<transition-group name="fade-list">
								<WalletTabs v-if="isSelectingWallet" :addresses="addresses" v-model="currentAddress" class="fade-list-item" key="0" />
								<div v-if="currentAddress === state.wallet" class="status fade-list-item" key="0">Connected</div>
								<Notification v-else :data="connectData" class="fade-list-item" key="1">{{ connectData.content }}</Notification>
								<div v-if="test" style="padding: var(--spacing);" key="2" class="fade-list-item">
									<TxCard :tx="test"  />
								</div>
							</transition-group>
						</div>
						<div v-else-if="currentTab === 'Permissions'">
							<transition-group name="fade-list">
								<WalletTabs v-if="isSelectingWallet" :addresses="addresses" v-model="currentAddress" class="fade-list-item" key="0" />
								<div class="status fade-list-item" key="0">WIP</div>
							</transition-group>
						</div>
					</div>
				</transition>
			</div>
		</div>
	</div>
</template>



<script>
import WalletSelector from '@/components/composed/WalletSelector.vue'
import WalletTabs from '@/components/composed/WalletTabs.vue'
import Tabs from '@/components/atomic/Tabs.vue'
import IconBackground from '@/components/atomic/IconBackground.vue'
import Icon from '@/components/atomic/Icon.vue'
import Notification from '@/components/composed/Notification.vue'
import TxCard from '@/components/composed/TxCard.vue'
import ArweaveStore, { arweave } from '@/store/ArweaveStore'
import InterfaceStore, { emitter } from '@/store/InterfaceStore'
import { navigateBack, navigateBackAvailable } from '@/functions/Connect'
import { computed, ref, toRef, watch } from 'vue'

import iconConnection from '@/assets/icons/connection.svg'
import iconY from '@/assets/icons/y.svg'
import iconX from '@/assets/icons/x.svg'
import iconLauch from '@/assets/icons/launch.svg'

export default {
	components: { WalletSelector, WalletTabs, Tabs, IconBackground, Icon, Notification, TxCard },
	props: ['state'],
	setup (props) {
		const defaultAddress = ArweaveStore.wallets[0]?.key
		const addresses = computed(() => ArweaveStore.wallets.map(wallet => wallet.key))
		const currentAddress = ref(props.state.wallet || defaultAddress)
		const tabs = [
			{ name: 'Requests', color: 'var(--orange)' },
			{ name: 'Permissions', color: 'var(--green)' },
		]
		const currentTab = ref(currentAddress.value ? tabs[0].name : null)
		watch(() => props.state.wallet, (wallet) => {
			isSelectingWallet.value = false
			currentAddress.value = wallet
			currentTab.value = tabs[0].name
		})

		const disconnect = () => props.state.wallet = false
		const connect = () => {
			isSelectingWallet.value = false
			props.state.wallet = currentAddress.value
		}
		const goBack = () => {
			isSelectingWallet.value = false
			currentAddress.value = props.state.wallet
		}

		const isSelectingWallet = ref(!props.state.wallet)
		const selectWallet = () => {
			if (!isSelectingWallet.value) { isSelectingWallet.value = true; return }
			currentAddress.value = props.state.wallet || ArweaveStore.wallets[0]?.key
			isSelectingWallet.value = false
		}

		const connectData = computed(() => {
			const content = !props.state.wallet ?
				`Connect to ${props.state.appInfo?.name || props.state.origin} from the account ${currentAddress.value}`
				: `Switch to ${currentAddress.value}`
			return {
				title: props.state.wallet ? 'Switch' : 'Connect',
				timestamp: Date.now(), // todo
				actions: [
					{ name: 'Connect', img: iconY, run: connect },
					{ name: !props.state.wallet ? 'Switch' : 'Cancel', img: iconX, run: !props.state.wallet ? selectWallet : goBack },
				],
				expanded: true,
				content,
			}
		})



		const verticalLayout = toRef(InterfaceStore.breakpoints, 'verticalLayout')
		const transitionName = ref(null)
		const selectTransitionName = (val, oldVal) => val > oldVal ? transitionName.value = 'slide-left' : transitionName.value = 'slide-right'
		watch(() => tabs.findIndex(tab => tab.name === currentTab.value), selectTransitionName)
		watch(() => ArweaveStore.wallets.findIndex(wallet => wallet.key === currentAddress.value), selectTransitionName)

		const test = ref(null)
		const testing = async () => test.value = await arweave.createTransaction({ data: 'hello', quantity: '100000000000', target: '32s5eCodNO16YMtSkmKNipQMtjpWz_SORUKwkGvrcrg' })
		testing().then(() => console.log(test.value))

		return { test, defaultAddress, addresses, currentAddress, tabs, currentTab, isSelectingWallet, selectWallet, connectData, verticalLayout, transitionName, disconnect, navigateBack, navigateBackAvailable, iconConnection, iconLauch }
	}
}
</script>



<style scoped>
.flex-row {
	align-items: center;
}

.wallet-selector {
	flex: 1 1 0;
	justify-content: flex-end;
}

.wallet-tabs {
	padding: var(--spacing);
	justify-content: center;
	width: 100%;
	border-bottom: 0.5px solid var(--border);
	margin-bottom: var(--spacing);
}

.container {
	flex: 1 1 0;
	min-height: 200px;
	/* max-height: 60vh; */
	background: var(--background);
	border-radius: var(--border-radius) var(--border-radius) 0 0;
	align-items: center;
	justify-content: flex-start;
	overflow: hidden auto;
	position: relative;
}

.content {
	width: 100%;
	height: 100%;
	position: relative;
	/* padding: var(--spacing);
	border-bottom: 0.5px solid #ffffff20; */
}

.status {
	height: 8em;
	display: flex;
	align-items: center;
	justify-content: center;
	opacity: 0.4;
}

.notification {
	width: 100%;
	padding: var(--spacing);
	border-bottom: 0.5px solid var(--border);
}

.icon-background {
	flex: 0 0 auto;
}

.icon {
	opacity: var(--element-secondary-opacity);
}
</style>