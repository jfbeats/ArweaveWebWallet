<template>
	<div class="connection-card flex-column no-scrollbar">
		<div class="flex-row">
			<button type="button" class="info flex-row" @click="navigateBack" :disabled="!navigateBackAvailable(state.origin, state.session)">
				<IconBackground :img="state.appInfo?.logo" :icon="IconConnection" />
				<div style="min-width: 0;">
					<div class="ellipsis">{{ state.appInfo?.name || 'Connector' }}</div>
					<div class="secondary-text ellipsis">{{ state.origin }}</div>
				</div>
				<Icon v-if="navigateBackAvailable(state.origin, state.session)" :icon="IconLaunch" />
			</button>
			<WalletSelector v-model="state.walletId" :default="defaultId" :exit="true" :active="!isSelectingWallet" @selectWallet="selectWallet" @exit="disconnect" />
		</div>
		<div class="flex-column" style="flex: 1 1 0;">
			<Tabs :tabs="tabs" v-model="currentTab" :disabled="!currentId" />
			<div class="container">
				<div class="container-scroll">
					<transition :name="transitionName" mode="out-in">
						<div :key="(currentId || '') + currentTab" class="content">
							<div v-if="currentTab === 'Requests'">
								<transition-group name="fade-list">
									<WalletTabs v-if="isSelectingWallet" :addresses="addresses" v-model="currentId" class="box fade-list-item" key="0" />
									<div v-if="connectionFeed?.length === 0 && state.walletId && state.walletId === currentId" class="box status fade-list-item" key="0">Connected</div>
									<Notification v-if="currentId !== state.walletId" :data="connectData" class="box fade-list-item" key="1">{{ connectData.content }}</Notification>
									<PermissionCard v-for="messageEntry in connectionFeed" :key="messageEntry.uuid" :messageEntry="messageEntry" style="padding: var(--spacing);" class="box flex-column fade-list-item" />
								</transition-group>
							</div>
							<div v-else-if="currentTab === 'Permissions'">
								<transition-group name="fade-list">
									<WalletTabs v-if="isSelectingWallet" :addresses="addresses" v-model="currentId" class="box fade-list-item" key="0" />
									<div class="box status fade-list-item" key="0">WIP</div>
								</transition-group>
							</div>
						</div>
					</transition>
				</div>
			</div>
		</div>
	</div>
</template>



<script setup lang="ts">
import WalletSelector from '@/components/composed/WalletSelector.vue'
import WalletTabs from '@/components/composed/WalletTabs.vue'
import Tabs from '@/components/atomic/Tabs.vue'
import IconBackground from '@/components/atomic/IconBackground.vue'
import Icon from '@/components/atomic/Icon.vue'
import Notification from '@/components/composed/Notification.vue'
import PermissionCard from '@/components/composed/PermissionCard.vue'
import { getWalletById, Wallets } from '@/functions/Wallets'
import InterfaceStore from '@/store/InterfaceStore'
import { navigateBack, navigateBackAvailable } from '@/functions/Connect'
import { computed, ref, toRef, watch } from 'vue'

import IconConnection from '@/assets/icons/connection.svg?component'
import IconY from '@/assets/icons/y.svg?component'
import IconX from '@/assets/icons/x.svg?component'
import IconLaunch from '@/assets/icons/launch.svg?component'

const props = defineProps<{ state: ConnectorState }>()

const defaultId = Wallets.value[0]?.id
const addresses = computed(() => Wallets.value.map(wallet => wallet.key))
const currentId = ref(props.state.walletId || defaultId)
const defaultWallet = computed(() => getWalletById(defaultId))
const tabs = [
	{ name: 'Requests', color: 'var(--orange)' },
	{ name: 'Permissions', color: 'var(--green)' },
]
const currentTab = ref(currentId.value ? tabs[0].name : null)
watch(() => props.state.walletId, (walletId) => {
	if (!walletId) { return }
	isSelectingWallet.value = false
	currentId.value = walletId
	currentTab.value = tabs[0].name
})

const disconnect = () => props.state.walletId = false
const connect = () => {
	isSelectingWallet.value = false
	props.state.walletId = currentId.value + ''
}
const goBack = () => {
	if (!props.state.walletId) { return }
	isSelectingWallet.value = false
	currentId.value = props.state.walletId
}

const isSelectingWallet = ref(!props.state.walletId)
const selectWallet = () => {
	if (!isSelectingWallet.value) { isSelectingWallet.value = true; return }
	currentId.value = props.state.walletId || Wallets.value[0]?.id
	isSelectingWallet.value = false
}

const connectData = computed(() => {
	const content = !props.state.walletId ?
		`Connect to ${props.state.appInfo?.name || props.state.origin} from the account ${currentId.value}`
		: `Switch to ${currentId.value}`
	return {
		title: props.state.walletId ? 'Switch' : 'Connect',
		timestamp: Date.now(), // todo
		actions: [
			{ name: 'Connect', icon: IconY, run: connect },
			{ name: !props.state.walletId ? 'Switch' : 'Cancel', icon: IconX, run: !props.state.walletId ? selectWallet : goBack },
		],
		expanded: true,
		content,
	}
})


const connectionFeed = computed(() => props.state.messageQueue?.filter((m) => !m.fulfilled))



const verticalLayout = toRef(InterfaceStore.breakpoints, 'verticalLayout')
const transitionName = ref(null)
const selectTransitionName = (val, oldVal) => val > oldVal ? transitionName.value = 'slide-left' : transitionName.value = 'slide-right'
watch(() => tabs.findIndex(tab => tab.name === currentTab.value), selectTransitionName)
watch(() => Wallets.value.findIndex(wallet => wallet.id === currentId.value), selectTransitionName)
</script>



<style scoped>
.connection-card {
	overflow-y: auto;
}

.flex-row {
	align-items: center;
}

.info {
	flex: 1 1 0;
	min-width: 0;
	overflow: hidden;
}

.wallet-selector {
	flex: 0 0 auto;
	justify-content: flex-end;
}

.wallet-tabs {
	padding: var(--spacing);
	justify-content: center;
	width: 100%;
}

.container {
	flex: 1 1 0;
	/* max-height: 60vh; */
	background: var(--background);
	border-radius: var(--border-radius) var(--border-radius) 0 0;
	align-items: center;
	justify-content: flex-start;
	overflow: hidden;
	position: relative;
	min-height: min(300px, calc(var(--current-vh) - calc(var(--spacing) + 5px)));
}

.container-scroll {
	overflow: hidden auto;
	height: 100%;
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
	color: #444;
}

.content > * > * {
	background: var(--background);
	width: 100%;
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