<template>
	<transition name="fade-fast" mode="out-in">
		<div :key="wallet.key">
			<div class="wallet-info">
				<Icon class="logo" :icon="walletInfo.img" />
				{{ arweaveId?.Name || walletInfo.name }}
			</div>
			<Address :address="wallet.key" />
		</div>
	</transition>
</template>

<script>
import Address from '@/components/atomic/Address.vue'
import Icon from '@/components/atomic/Icon.vue'
import ProfileStore, { getArweaveId } from '@/store/ProfileStore'
import { computed, watch } from '@vue/runtime-core'

export default {
	components: { Address, Icon },
	props: ['wallet'],
	setup (props) {
		const arweaveId = computed(() => ProfileStore.arweaveId[props.wallet.key])
		const walletInfo = computed(() => {
			if (props.wallet.metaData?.provider === 'Ledger') { return { img: require('@/assets/logos/ledger.svg'), name: 'Ledger' } }
			return { img: require('@/assets/logos/arweave.svg'), name: 'Arweave wallet' }
		})
		watch(() => props.wallet.key, () => {
			getArweaveId(props.wallet.key)
		})

		return { arweaveId, walletInfo }
	},
}
</script>

<style scoped>
.wallet-info {
	margin: 0 0 var(--spacing) 0;
	display: flex;
	align-items: center;
	height: 1em;
}

.logo {
	margin-inline-end: 1em;
}

.address {
	font-size: 0.75em;
	color: var(--element-secondary);
}
</style>
