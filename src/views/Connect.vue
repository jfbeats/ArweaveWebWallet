<template>
	<div class="connect flex-column">
		<!-- <div class="wallet" v-if="currentWallet">
			<AddressIcon :address="currentWallet.key" />
			<Address class="secondary-text" :address="currentWallet.key" />
			<Button @click="connect(currentWallet.key)">Connect</Button>
		</div>-->
		<Carousel v-model="currentConnectorIndex" class="connectors">
			<div v-for="connector in connectors" :key="connector.session" class="connection-card-container  fade-list-item">
				<ConnectionCard :state="connector" class="box" />
			</div>
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
import { state, states } from '@/functions/Channels'
import { connectors } from '@/functions/Connect'
import { computed, onBeforeUnmount, ref } from 'vue'

export default {
	components: { Carousel, ConnectionCard, AddressIcon, Address, Button },
	setup () {
		const currentConnectorIndex = ref(connectors.value.findIndex(value =>
			value.origin === state.origin && value.session === state.session))

		// const test = ref(false)
		// const testing = () => {
		// 	test.value = !test.value
		// 	setTimeout(testing, 4000)
		// }
		// testing()
		// const connectorsComp = computed(() => test.value ? [connectors.value[0], connectors.value[2]] : connectors.value)
		// InterfaceStore.toolbar.links = false
		// onBeforeUnmount(() => InterfaceStore.toolbar.links = true)
		const currentWallet = computed(() => ArweaveStore.currentWallet)

		return { currentConnectorIndex, currentWallet, connectors, state, states }
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
	min-height: var(--current-vh);
}

.connection-card-container {
	height: var(--current-vh);
	width: var(--current-vw);
	max-width: var(--column-width-small);
	padding: 0;
	scroll-snap-align: start;
	display: inline-block;
}

.connection-card {
	padding: var(--spacing);
	padding-bottom: 0;
	height: 100%;
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

.fade-list-leave-active {
	position: absolute !important;
	/* scroll-snap-align: none; */
}

.fade-list-enter-active {
	/* scroll-snap-align: none; */
}

.fade-list-move {
	/* scroll-snap-align: none; */
}
</style>