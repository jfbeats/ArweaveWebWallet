<template>
	<transition name="fade-fast" mode="out-in">
		<div class="wallet-info" :key="wallet.key">
			<div class="name">
				<Icon class="logo" :icon="walletInfo.icon" />
				<div>{{ arweaveId?.name ? arweaveId?.name + ' | ' : '' }}{{ walletInfo.name }}</div>
			</div>
			<Address class="secondary-text" :address="wallet.key" />
		</div>
	</transition>
</template>



<script setup lang="ts">
import Address from '@/components/atomic/Address.vue'
import Icon from '@/components/atomic/Icon.vue'
import ProfileStore, { getArweaveId } from '@/store/ProfileStore'
import { computed, watch } from 'vue'
import { coldState } from '@/store/Cold'
import { LOGO } from '@/store/Theme'
import { ICON } from '@/store/Theme'

const props = defineProps<{ wallet: Wallet }>()
const arweaveId = computed(() => (ProfileStore.arweaveId as any)[props.wallet.key!])
const walletInfo = computed(() => coldState.value && props.wallet.hasPrivateKey
	? props.wallet.state.hot ? { icon: ICON.unlock, name: 'Hot Wallet' } : { icon: ICON.snow, name: 'Cold Wallet' }
	: props.wallet.metadata || { icon: LOGO.arweave, name: 'Arweave wallet' })
watch(() => props.wallet.key, () => getArweaveId(props.wallet.key))
</script>



<style scoped>
.wallet-info {
	max-width: 100%;
}

.name {
	display: flex;
	align-items: center;
}

.logo {
	margin-inline-end: 1em;
}

.address {
	width: 100%;
}
</style>
