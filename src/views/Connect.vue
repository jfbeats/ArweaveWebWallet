<template>
	<div class="connect flex-column">
		<!-- <div class="wallet" v-if="currentWallet">
			<AddressIcon :address="currentWallet.key" />
			<Address class="secondary-text" :address="currentWallet.key" />
			<Button @click="connect(currentWallet.key)">Connect</Button>
		</div> -->
		<transition-group name="fade-list">
			<ConnectionCard v-for="(connector, name) in connectors" :key="name" :state="connector" class="fade-list-item" />
		</transition-group>
		<div class="bottom-info secondary-text">
			<div>All Channels {{ Object.keys(states).length }}</div>
			<div v-for="(state, name) in states" :key="name">
				{{ state }}
			</div>
		</div>
	</div>
</template>

<script>
import ConnectionCard from '@/components/ConnectionCard.vue'
import AddressIcon from '@/components/atomic/AddressIcon.vue'
import Address from '@/components/atomic/Address.vue'
import Button from '@/components/atomic/Button.vue'
import ArweaveStore from '@/store/ArweaveStore'
import InterfaceStore from '@/store/InterfaceStore'
import { states, connectors } from '@/functions/Connect'
import { computed, onBeforeUnmount } from 'vue'

export default {
	components: { ConnectionCard, AddressIcon, Address, Button },
	setup () {
		// InterfaceStore.toolbar.links = false
		// onBeforeUnmount(() => InterfaceStore.toolbar.links = true)
		const currentWallet = computed(() => ArweaveStore.currentWallet)


		return { currentWallet, connectors, states }
	}
}
</script>

<style scoped>
.connect {
	padding: var(--spacing);
	display: flex;
	flex-direction: column;
	align-items: center;
	min-height: 100%;
}

.connection-card {
	width: 100%;
	max-width: var(--column-width);
}

.wallet {
	flex: 1 1 auto;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-evenly;
}

.address-icon {
	width: 128px;
	height: 128px;
	border-radius: var(--border-radius);
}

.bottom-info {
	flex: 1 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
}
</style>