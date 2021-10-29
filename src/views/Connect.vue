<template>
	<div class="connect flex-column">
		<!-- <div class="wallet" v-if="currentWallet">
			<AddressIcon :address="currentWallet.key" />
			<Address class="secondary-text" :address="currentWallet.key" />
			<Button @click="connect(currentWallet.key)">Connect</Button>
		</div>-->
		<div class="connectors flex-row no-scrollbar">
			<transition-group name="fade-list">
				<div class="margin" key="margin1"></div>
				<ConnectionCard v-for="(connector, name) in iframes" :key="name" :state="connector" class="box fade-list-item" />
				<div class="margin" key="margin2"></div>
			</transition-group>
		</div>
		<div class="bottom-info secondary-text" style="opacity: 0.0; pointer-events: none;">
			<div>All Channels {{ Object.keys(states).length }}</div>
			<div v-for="(extState, name) in states" :key="name">{{ extState }}</div>
		</div>
	</div>
</template>

<script>
import ConnectionCard from '@/components/composed/ConnectionCard.vue'
import AddressIcon from '@/components/atomic/AddressIcon.vue'
import Address from '@/components/atomic/Address.vue'
import Button from '@/components/atomic/Button.vue'
import ArweaveStore from '@/store/ArweaveStore'
import InterfaceStore from '@/store/InterfaceStore'
import { state, states, iframes } from '@/functions/Channels'
import { computed, onBeforeUnmount } from 'vue'

export default {
	components: { ConnectionCard, AddressIcon, Address, Button },
	setup () {
		// InterfaceStore.toolbar.links = false
		// onBeforeUnmount(() => InterfaceStore.toolbar.links = true)
		const currentWallet = computed(() => ArweaveStore.currentWallet)

		return { currentWallet, iframes, state, states }
	}
}
</script>

<style scoped>
.connect {
	/* padding: var(--spacing); */
	display: flex;
	flex-direction: column;
	align-items: center;
	/* min-height: var(--current-vh); */
}

.connectors {
	/* overflow: scroll; */
	width: 100%;
	height: var(--current-vh);
	overflow: auto;
	scroll-snap-type: x mandatory;
}

.connection-card {
	flex: 1 0 auto;
	width: var(--current-vw);
	max-width: var(--column-width-small);
	border-radius: 0;
	padding-bottom: 0;
	scroll-snap-align: center;
}

.margin {
	flex: 1 0 auto;
	width: calc(var(--current-vw) * 0.8);
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
	position: absolute;
	bottom: 0;
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
}
</style>