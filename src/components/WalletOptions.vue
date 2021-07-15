<template>
	<div class="wallet-options">
		<div class="left">
			<AddressIcon class="profile" :address="wallet.key" />
			<div class="profile-info">
				Username
				<Address class="address" :address="wallet.key" />
			</div>
		</div>
		<div class="content">
			<div class="bottom">
				<div @click="deleteWallet(wallet)"> delete</div>
			</div>
		</div>

	</div>
</template>

<script>
import AddressIcon from '@/components/atomic/AddressIcon'
import Address from '@/components/atomic/Address'
import { deleteWallet } from '@/store/ArweaveStore'

export default {
	components: { AddressIcon, Address },
	props: ['wallet'],
	setup () {
		return { deleteWallet }
	}
}
</script>

<style scoped>
.wallet-options {
	display: flex;
	flex-direction: column;
	/* padding: 16px 16px 16px 0; */
	/* background: var(--background2); */
	overflow: hidden;
}

.left {
	/* align-self: center; */
	flex: 0 0 auto;
	display: flex;
	/* flex-direction: column; */
	/* background: var(--background3); */
	align-items: center;
	/* gap: var(--spacing); */
}

.content {
	flex: 1 1 auto;
	min-width: 0;
	display: flex;
	flex-direction: column;
	padding: 24px;
}

.bottom {
	/* background: var(--background2); */
	border-radius: var(--border-radius);
}

.profile {
	flex: 0 0 auto;
	width: 92px;
	height: 92px;
	background: var(--background);
	border-radius: var(--border-radius);
	/* border-radius: 50%; */
	padding: 24px;
}

.profile-info {
	min-width: 0;
	padding: 0 var(--spacing);
}

.address {
	/* line-height: 4; */
	font-size: 0.75em;
	color: var(--element-secondary);
}
</style>