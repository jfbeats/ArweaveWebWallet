<template>
	<div class="connection-card flex-column">
		<div :class="[verticalLayout ? 'flex-column' : 'flex-row']">
			<button type="button" class="flex-row" @click="navigateBack" :disabled="!navigateBackAvailable(state.origin)">
				<IconBackground :img="state.appInfo?.logo" :icon="iconConnection" />
				<div>
					<div>{{ state.appInfo?.name || 'Connector' }}</div>
					<div class="secondary-text">{{ state.origin }}</div>
				</div>
				<Icon v-if="navigateBackAvailable(state.origin)" :icon="iconLauch" />
			</button>
			<WalletSelector v-model="currentAddress" :exit="true" @exit="disconnect" />
		</div>
		<div class="flex-column" style="flex: 1 1 0;">
			<Tabs :tabs="tabs" v-model="currentTab" :disabled="!currentAddress" />
			<div class="container flex-column">
				<transition :name="transitionName" mode="out-in">
					<div :key="(currentAddress || '') + currentTab" class="content">
						<div v-if="!currentAddress" class="info flex-column">Select a wallet</div>
						<div v-else-if="currentTab === 'Requests'" class="flex-column">
							<transition-group name="fade-list">
								<div v-if="currentAddress === state.wallet" class="fade-list-item">Connected</div>
								<Notification v-else :data="connectData" class="fade-list-item">{{ connectData.content }}</Notification>
							</transition-group>
						</div>
						<div v-else-if="currentTab === 'Permissions'" class="flex-column">Wip</div>
					</div>
				</transition>
			</div>
		</div>
	</div>
</template>



<script>
import WalletSelector from '@/components/composed/WalletSelector.vue'
import Tabs from '@/components/atomic/Tabs.vue'
import IconBackground from '@/components/atomic/IconBackground.vue'
import Icon from '@/components/atomic/Icon.vue'
import Notification from '@/components/composed/Notification.vue'
import ArweaveStore from '@/store/ArweaveStore'
import InterfaceStore from '@/store/InterfaceStore'
import { navigateBack, navigateBackAvailable } from '@/functions/Connect'
import { computed, ref, toRef, watch } from 'vue'

import iconConnection from '@/assets/icons/connection.svg'
import iconY from '@/assets/icons/y.svg'
import iconX from '@/assets/icons/x.svg'
import iconLauch from '@/assets/icons/launch.svg'

export default {
	components: { WalletSelector, Tabs, IconBackground, Icon, Notification },
	props: ['state'],
	setup (props) {
		const currentAddress = ref(props.state.wallet || undefined)
		const tabs = [
			{ name: 'Requests', color: 'var(--orange)' },
			{ name: 'Permissions', color: 'var(--green)' },
		]
		const currentTab = ref(currentAddress.value ? tabs[0].name : null)
		watch(() => props.state.wallet, (wallet) => {
			currentAddress.value = wallet
			currentTab.value = tabs[0].name
		})

		const disconnect = () => props.state.wallet = false

		const connectData = computed(() => {
			const connected = props.state.wallet
			const content = !props.state.wallet ?
				`Connect to ${props.state.appInfo?.name || props.state.origin} from the account ${currentAddress.value}`
				: `Switch to ${currentAddress.value}`
			return {
				title: connected ? 'Switch' : 'Connect',
				timestamp: Date.now(), // todo
				actions: [
					{ name: !connected ? 'Connect' : 'Switch', img: iconY, run: () => props.state.wallet = currentAddress.value },
					{ name: !connected ? 'Disconnect' : 'Cancel', img: iconX, run: !connected ? disconnect : () => currentAddress.value = props.state.wallet },
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

		watch(() => currentAddress.value, (val, oldVal) => { if (val && !oldVal) { currentTab.value = tabs[0].name } })

		return { currentAddress, tabs, currentTab, connectData, verticalLayout, transitionName, disconnect, navigateBack, navigateBackAvailable, iconConnection, iconLauch }
	}
}
</script>



<style scoped>
.flex-row {
	align-items: center;
}

.wallet-tabs {
	flex: 1 1 0;
	justify-content: flex-end;
}

.container {
	flex: 1 1 0;
	min-height: 200px;
	/* max-height: 60vh; */
	background: var(--background);
	border-radius: var(--border-radius);
	align-items: center;
	justify-content: flex-start;
	overflow: hidden auto;
}

.content {
	width: 100%;
	height: 100%;
	position: relative;
	/* padding: var(--spacing);
	border-bottom: 0.5px solid #ffffff20; */
}

.info {
	height: 100%;
	align-items: center;
	justify-content: center;
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