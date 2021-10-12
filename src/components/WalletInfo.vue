<template>
	<transition name="fade-fast" mode="out-in">
		<div class="wallet-info" :key="wallet.key">
			<div class="name">
				<Icon class="logo" :icon="walletInfo.img" />
				<div>{{ arweaveId?.Name || walletInfo.name }}</div>
			</div>
			<div><Address class="secondary-text" :address="wallet.key" /></div>
		</div>
	</transition>
</template>

<script>
import Address from '@/components/atomic/Address.vue'
import Icon from '@/components/atomic/Icon.vue'
import ProfileStore, { getArweaveId } from '@/store/ProfileStore'
import { computed, watch } from '@vue/runtime-core'

import logoLedger from '@/assets/logos/ledger.svg'
import logoArweave from '@/assets/logos/arweave.svg'

export default {
	components: { Address, Icon },
	props: ['wallet'],
	setup (props) {
		const arweaveId = computed(() => ProfileStore.arweaveId[props.wallet.key])
		const walletInfo = computed(() => {
			if (props.wallet.metaData?.provider === 'Ledger') { return { img: logoLedger, name: 'Ledger' } }
			return { img: logoArweave, name: 'Arweave wallet' }
		})
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
