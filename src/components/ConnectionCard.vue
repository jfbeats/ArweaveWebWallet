<template>
	<div class="connection-card card flex-column">
		<div class="flex-row">
			<div class="page-logo-container">
				<Icon v-if="state.appInfo?.logo" class="page-logo" :icon="state.appInfo?.logo" />
				<Icon v-else class="page-logo placeholder" :icon="require('@/assets/icons/connection.svg')" />
			</div>
			<div>
				<div>{{ state.appInfo?.name || 'Connector' }}</div>
				<div class="secondary-text">{{ state.origin }}</div>
			</div>
		</div>
		<WalletTabs :addresses="addresses" v-model="currentAddress" />
		<transition :name="transitionName" mode="out-in">
			<div v-if="currentAddress" :key="currentAddress" class="flex-column">
				<Tabs :tabs="tabs" v-model="currentTab" />
				<transition :name="transitionName" mode="out-in">
					<div :key="currentTab">
						<div v-if="currentTab === 'Requests'">
							Requests
						</div>
						<div v-else-if="currentTab === 'Permissions'">
							Permissions
						</div>
					</div>
				</transition>
			</div>
			<div v-else>
				Select a wallet
			</div>
		</transition>
		<!-- TODO request -> "switch/connect" wallet modal -->
	</div>
</template>

<script>
import WalletTabs from '@/components/WalletTabs.vue'
import Tabs from '@/components/atomic/Tabs.vue'
import Icon from '@/components/atomic/Icon.vue'
import ArweaveStore from '@/store/ArweaveStore'
import { computed, ref, watch } from 'vue'

export default {
	components: { WalletTabs, Tabs, Icon },
	props: ['state'],
	setup () {
		const addresses = computed(() => ArweaveStore.wallets.map(wallet => wallet.key))
		const currentAddress = ref(null)
		const tabs = [
			{ name: 'Requests', color: 'var(--orange)' },
			{ name: 'Permissions', color: 'var(--green)' },
		]
		const currentTab = ref(tabs[0].name)

		const transitionName = ref(null)
		const selectTransitionName = (val, oldVal) => val > oldVal ? transitionName.value = 'slide-left' : transitionName.value = 'slide-right'
		watch(() => tabs.findIndex(tab => tab.name === currentTab.value), selectTransitionName)
		watch(() => ArweaveStore.wallets.findIndex(wallet => wallet.key === currentAddress.value), selectTransitionName)

		return { addresses, currentAddress, tabs, currentTab, transitionName }
	}
}
</script>

<style scoped>
.page-logo-container {
	background: var(--background);
	border-radius: var(--border-radius);
	width: 64px;
	height: 64px;
}

.page-logo {
	width: 100%;
	height: 100%;
}

.page-logo.placeholder {
	padding: 10px;
	opacity: 0.5;
}

.flex-row {
	align-items: center;
}
</style>