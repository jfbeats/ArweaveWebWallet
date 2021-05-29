<template>
	<div class="wallet-options">
		<div class="left">
			<AddressIcon class="profile" :address="wallet.key" />
		</div>
		<div class="content">
			<Address class="address" :address="wallet.key" />
			<div class="bottom">
				-
				<!-- Save to cloud -->
				<!-- Export wallet -->
				<!-- Delete -->

			</div>
		</div>

	</div>
</template>

<script>
import AddressIcon from '@/components/atomic/AddressIcon'
import Address from '@/components/atomic/Address'

export default {
	components: { AddressIcon, Address },
	props: ['wallet']
}
</script>

<style scoped>
.wallet-options {
	display: flex;
	padding: 16px 16px 16px 0;
	background: var(--background2);
}

.left {
	flex: 0 0 auto;
	display: flex;
	/* align-items: center; */
	/* gap: var(--spacing); */
}

.content {
	flex: 1 1 auto;
	min-width: 0;
	display: flex;
	flex-direction: column;
}

.bottom {
	padding: 24px;
	background: var(--background2);
	border-radius: var(--border-radius);
}

.profile {
	flex: 0 0 auto;
	width: 92px;
	height: 92px;
	/* background: var(--background); */
	/* border-radius: 50%; */
	padding: 24px;
}

.address {
	line-height: 4;

}
</style>