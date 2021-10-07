<template>
	<div class="connection-card card flex-column">
		<div class="flex-row" style="flex-wrap:wrap;">
			<div class="flex-row">
				<IconBackground :icon="require('@/assets/icons/connection.svg')" :img="state.appInfo?.logo" />
				<div>
					<div>{{ state.appInfo?.name || 'Connector' }}</div>
					<div class="secondary-text">{{ state.origin }}</div>
				</div>
			</div>
			<WalletTabs :addresses="addresses" v-model="currentAddress" />
		</div>
		<div class="flex-column">
			<Tabs :tabs="tabs" v-model="currentTab" :disabled="!currentAddress" />
			<div class="container flex-column">
				<transition :name="transitionName" mode="out-in">
					<div :key="currentAddress + currentTab" class="content">
						<div v-if="!currentAddress" class="info flex-column">
							Select a wallet
						</div>
						<div v-else-if="currentTab === 'Requests'" class="flex-column">
							<transition-group name="fade-list">
								<div v-if="currentAddress === state.wallet" class="fade-list-item">Connected</div>
								<Notification v-else :data="connectData" class="fade-list-item">
									{{ connectData.content }}
								</Notification>
							</transition-group>
						</div>
						<div v-else-if="currentTab === 'Permissions'" class="flex-column">
							Wip
						</div>
					</div>
				</transition>
			</div>
		</div>
	</div>
</template>

<script>
import WalletTabs from '@/components/WalletTabs.vue'
import Tabs from '@/components/atomic/Tabs.vue'
import IconBackground from '@/components/atomic/IconBackground.vue'
import Notification from '@/components/Notification.vue'
import ArweaveStore from '@/store/ArweaveStore'
import { computed, ref, watch } from 'vue'

export default {
	components: { WalletTabs, Tabs, IconBackground, Notification },
	props: ['state'],
	setup (props) {
		const addresses = computed(() => ArweaveStore.wallets.map(wallet => wallet.key))
		const currentAddress = ref(null)
		const tabs = [
			{ name: 'Requests', color: 'var(--orange)' },
			{ name: 'Permissions', color: 'var(--green)' },
		]
		const currentTab = ref(null)

		const connectData = computed(() => {
			const action = props.state.wallet ? 'Switch' : 'Connect'
			const content = !props.state.wallet ? 
				`Connect to ${ props.state.appInfo?.name || props.state.origin } from the account ${ currentAddress.value }`
				: `Switch to ${ currentAddress.value }`
			return {
				title: action,
				timestamp: Date.now(), // todo
				actions: [
					{ name: action, img: require('@/assets/icons/y.svg'), run: () => props.state.wallet = currentAddress.value },
					{ name: 'Exit', img: require('@/assets/icons/x.svg'), run: () => props.state.wallet = false },
				],
				expanded: true,
				content,
			}
		})

		const transitionName = ref(null)
		const selectTransitionName = (val, oldVal) => val > oldVal ? transitionName.value = 'slide-left' : transitionName.value = 'slide-right'
		watch(() => tabs.findIndex(tab => tab.name === currentTab.value), selectTransitionName)
		watch(() => ArweaveStore.wallets.findIndex(wallet => wallet.key === currentAddress.value), selectTransitionName)

		watch(() => currentAddress.value, (val, oldVal) => { if (val && !oldVal) { currentTab.value = tabs[0].name } })

		return { addresses, currentAddress, tabs, currentTab, connectData, transitionName }
	}
}
</script>

<style scoped>
.flex-row {
	align-items: center;
}

.wallet-tabs {
	flex: 1 1 100px;
	justify-content: flex-end;
}

.container {
	height: 400px;
	max-height: 60vh;
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
</style>