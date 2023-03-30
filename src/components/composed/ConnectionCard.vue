<template>
	<ListContainer class="connection-card flex-column no-scrollbar">
		<template #header>
			<div class="flex-row">
				<button type="button" class="info flex-row" @click="navigateBack" :disabled="!navigateBackAvailable(state.origin, state.session)">
					<IconBackground :img="state.appInfo?.logo" :icon="ICON.connection" />
					<div style="min-width: 0;">
						<div class="ellipsis">{{ state.appInfo?.name || 'Connector' }}</div>
						<div class="secondary-text ellipsis">{{ state.origin }}</div>
					</div>
					<Icon v-if="navigateBackAvailable(state.origin, state.session)" :icon="ICON.launch" />
				</button>
				<WalletSelector v-model="state.walletId" :active="!selectActive" @selectWallet="selectWallet" @exit="disconnect" />
			</div>
			<Tabs :tabs="tabs" v-model="currentTab" :disabled="!currentId" />
		</template>
		<template #default>
			<TransitionsManager :vector="transitionName" axis="x">
				<OverlayPrompt v-if="!Wallets.length" :options="{ action: { icon: ICON.addBox, name: 'Add wallet', run: () => router.push('/add') } }" />
				<div v-else class="container-scroll" :key="contentKey">
					<transition-group name="fade-list">
						<WalletTabs v-if="selectActive" v-model="currentId" class="fade-list-item" key="-1" />
						<div class="page-container" key="0">
							<TransitionsManager :vector="transitionName" axis="x">
								<div :key="(currentId || '') + currentTab" class="content">
									<div v-if="currentTab === 'Requests'">
										<transition-group name="fade-list">
											<div class="fade-list-item" key="0" :style="{ padding: 0, border: 0, outline: '0.5px solid var(--border)' }"/>
											<div v-if="connectionFeed?.length === 0 && state.walletId && state.walletId === currentId" class="status fade-list-item" key="1">Connected</div>
											<OverlayPrompt v-if="currentId !== state.walletId" :options="connectOptions" :inline="true" class="fade-list-item" key="2">
												<ProfilePreview v-if="currentWallet" :wallet="currentWallet" />
											</OverlayPrompt>
<!--												stay logged in here -->
											<PermissionCard v-for="messageEntry in connectionFeed" :key="messageEntry.uuid" :messageEntry="messageEntry" style="padding: var(--spacing);" class="flex-column fade-list-item" />
										</transition-group>
									</div>
									<div v-else-if="currentTab === 'Permissions'">
										<transition-group name="fade-list">
											<div class="fade-list-item" key="0" :style="{ padding: 0, border: 0, outline: '0.5px solid var(--border)' }"/>
											<PermissionSettings :state="state" :walletId="currentId" class="fade-list-item" key="2" />
										</transition-group>
									</div>
								</div>
							</TransitionsManager>
						</div>
					</transition-group>
				</div>
			</TransitionsManager>
		</template>
	</ListContainer>
</template>



<script setup lang="ts">
import ListContainer from '@/components/layout/ListContainer.vue'
import WalletSelector from '@/components/composed/WalletSelector.vue'
import WalletTabs from '@/components/composed/WalletTabs.vue'
import Tabs from '@/components/atomic/Tabs.vue'
import IconBackground from '@/components/atomic/IconBackground.vue'
import Icon from '@/components/atomic/Icon.vue'
import PermissionCard from '@/components/composed/PermissionCard.vue'
import PermissionSettings from '@/components/composed/PermissionSettings.vue'
import TransitionsManager from '@/components/visual/TransitionsManager.vue'
import ProfilePreview from '@/components/composed/ProfilePreview.vue'
import { getWalletById, Wallets } from '@/functions/Wallets'
import InterfaceStore from '@/store/InterfaceStore'
import { navigateBack, navigateBackAvailable } from '@/functions/Connect'
import { computed, ref, toRef, watch } from 'vue'
import { useRouter } from '@/router'
import { ICON } from '@/store/Theme'
import OverlayPrompt from '@/components/layout/OverlayPrompt.vue'

const props = defineProps<{ state: ConnectorState }>()
const router = useRouter()

const defaultId = Wallets.value[0]?.id
const addresses = computed(() => Wallets.value.map(wallet => wallet.key))
const currentId = ref(props.state.walletId || defaultId)
const currentWallet = computed(() => getWalletById(currentId.value))
const defaultWallet = computed(() => getWalletById(defaultId))
const tabs = [
	{ name: 'Requests', color: 'var(--orange)' },
	{ name: 'Permissions', color: 'var(--green)' },
]
const currentTab = ref(currentId.value ? tabs[0].name : null)
watch(() => props.state.walletId, (walletId) => {
	if (!walletId) { return }
	selectEnabled.value = false
	currentId.value = walletId
	currentTab.value = tabs[0].name
})

const disconnect = () => props.state.walletId = false
const connect = () => {
	selectEnabled.value = false
	props.state.walletId = currentId.value + ''
}
const goBack = () => {
	if (!props.state.walletId) { return }
	if (currentId.value !== (props.state.walletId || Wallets.value[0]?.id)) { contentKey.value++ }
	selectEnabled.value = false
	currentId.value = props.state.walletId
}

const selectEnabled = ref(!props.state.walletId)
const selectActive = computed(() => selectEnabled.value && Wallets.value.length > 1)
const contentKey = ref(0)
const selectWallet = () => {
	if (!selectEnabled.value) { selectEnabled.value = true; return }
	if (currentId.value !== (props.state.walletId || Wallets.value[0]?.id)) { contentKey.value++ }
	currentId.value = props.state.walletId || Wallets.value[0]?.id
	selectEnabled.value = false
}

const connectOptions = computed(() => ({
	actions: [{ name: props.state.walletId ? 'Switch' : 'Connect', icon: ICON.y, run: connect }],
}))



const connectionFeed = computed(() => {
	if (currentId.value !== props.state.walletId) { return [] }
	return props.state.messageQueue?.filter((m) => !m.fulfilled)
})



const verticalLayout = toRef(InterfaceStore.breakpoints, 'verticalLayout')
const transitionName = ref(null as null | number)
const selectTransitionName = (val: number, oldVal: number) => transitionName.value = val - oldVal
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

.fade-list-item {
	padding: var(--spacing);
	border-bottom: 0.5px solid var(--border);
	position: relative;
	background: var(--background);
}

.wallet-tabs {
	padding: var(--spacing) 0;
	justify-content: center;
	width: 100%;
	z-index: 0;
	border-bottom: 0;
}

.container-scroll {
	overflow: hidden auto;
	height: 100%;
	display: flex;
	flex-direction: column;
}

.page-container {
	height: 100%;
	position: relative;
}

.content {
	width: 100%;
	height: 100%;
	position: relative;
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

.icon-background {
	flex: 0 0 auto;
}

.icon {
	opacity: var(--element-secondary-opacity);
}

.fade-list-leave-active {
	position: absolute !important;
}

.fade-list-rise-leave-active {
	position: absolute !important;
}
</style>