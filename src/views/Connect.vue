<template>
	<div class="connect flex-column">
		<!-- <div class="wallet" v-if="currentWallet">
			<AddressIcon :address="currentWallet.key" />
			<Address class="secondary-text" :address="currentWallet.key" />
			<Button @click="connect(currentWallet.key)">Connect</Button>
		</div>-->
		<Carousel v-model="currentConnectorIndex" class="connectors">
			<ConnectionCard v-for="(connector, name) in iframes" :key="name" :state="connector" class="box fade-list-item" />
		</Carousel>
		<div class="bottom-info secondary-text" style="opacity: 0.0; pointer-events: none;">
			<div>All Channels {{ Object.keys(states).length }}</div>
			<div v-for="(extState, name) in states" :key="name">{{ extState }}</div>
		</div>
	</div>
</template>

<script>
import Carousel from '@/components/layout/Carousel.vue'
import ConnectionCard from '@/components/composed/ConnectionCard.vue'
import AddressIcon from '@/components/atomic/AddressIcon.vue'
import Address from '@/components/atomic/Address.vue'
import Button from '@/components/atomic/Button.vue'
import ArweaveStore from '@/store/ArweaveStore'
import InterfaceStore from '@/store/InterfaceStore'
import { state, states, iframes } from '@/functions/Channels'
import { computed, onBeforeUnmount, ref } from 'vue'

export default {
	components: { Carousel, ConnectionCard, AddressIcon, Address, Button },
	setup () {
		const currentConnectorIndex = ref(Object.entries(iframes.value).findIndex(([key, value]) => 
			value.origin === state.origin && value.session === state.session))
		// InterfaceStore.toolbar.links = false
		// onBeforeUnmount(() => InterfaceStore.toolbar.links = true)
		const currentWallet = computed(() => ArweaveStore.currentWallet)

		return { currentConnectorIndex, currentWallet, iframes, state, states }
	}
}
</script>

<style scoped>
.connect {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.connectors {
	width: 100%;
	height: var(--current-vh);
}

.connection-card {
	flex: 1 0 auto;
	width: var(--current-vw);
	max-width: var(--column-width-small);
	border-radius: 0;
	padding-bottom: 0;
	scroll-snap-align: start;
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