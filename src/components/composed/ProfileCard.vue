<template>
	<div class="profile-card flex-row row" style="align-items: center;">
		<div class="address-icon-margin">
			<AddressIcon :address="wallet.key" />
		</div>
		<WalletInfo :wallet="wallet" />
	</div>
</template>



<script setup lang="ts">
import WalletInfo from '@/components/composed/WalletInfo.vue'
import AddressIcon from '@/components/atomic/AddressIcon.vue'

const props = defineProps<{ wallet: Account }>()
</script>



<style scoped>
.address-icon-margin {
	/*padding: var(--spacing);*/
}

.address-icon {
	width: 80px;
	height: 80px;
	border-radius: var(--border-radius);
}
</style>