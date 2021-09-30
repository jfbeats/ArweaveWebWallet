<template>
	<div class="connect">
		<div class="wallet" v-if="currentWallet">
			<AddressIcon :address="currentWallet.key" />
			<Address class="small" :address="currentWallet.key" />
			<Button @click="connect(currentWallet.key)">Connect</Button>
		</div>
		Channels {{ Object.keys(states).length }}
		<div v-for="(state, name) in states" :key="name">
			{{ state }}
		</div>
	</div>
</template>

<script>
import AddressIcon from '@/components/atomic/AddressIcon.vue'
import Address from '@/components/atomic/Address.vue'
import Button from '@/components/atomic/Button.vue'
import ArweaveStore from '@/store/ArweaveStore'
import InterfaceStore from '@/store/InterfaceStore'
import { states } from '@/functions/Connect'
import { computed, onBeforeUnmount } from 'vue'

export default {
	components: { AddressIcon, Address, Button },
	setup () {
		InterfaceStore.toolbar.links = false
		onBeforeUnmount(() => InterfaceStore.toolbar.links = true )
		const currentWallet = computed(() => ArweaveStore.currentWallet)

		return { currentWallet, states }
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

.small {
	font-size: 0.75em;
	color: var(--element-secondary);
}
</style>