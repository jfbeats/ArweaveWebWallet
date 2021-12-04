<template>
	<transition name="fade-fast" mode="out-in">
		<div class="wallet-info" :key="wallet.key">
			<div class="name">
				<Icon class="logo" :icon="walletInfo.icon" />
				<div>{{ arweaveId?.Name || walletInfo.name }}</div>
			</div>
			<div>
				<Address class="secondary-text" :address="wallet.key" />
			</div>
		</div>
	</transition>
</template>

<script>
import Address from '@/components/atomic/Address.vue'
import Icon from '@/components/atomic/Icon.vue'
import ProfileStore, { getArweaveId } from '@/store/ProfileStore'
import { computed, watch } from 'vue'

import LogoArweave from '@/assets/logos/arweave.svg?component'

export default {
	components: { Address, Icon },
	props: ['wallet'],
	setup (props) {
		const arweaveId = computed(() => ProfileStore.arweaveId[props.wallet.key])
		const walletInfo = computed(() => props.wallet.metadata || { icon: LogoArweave, name: 'Arweave wallet' })
		watch(() => props.wallet.key, () => {
			getArweaveId(props.wallet.key)
		})

		return { arweaveId, walletInfo }
	},
}
</script>

<style scoped>
.name {
	display: flex;
	align-items: center;
}

.logo {
	margin-inline-end: 1em;
}
</style>
