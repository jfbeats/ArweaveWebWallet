<template>
	<div class="wallet-tabs">
		<button v-for="Wallet in Wallets" :key="Wallet.id" type="button" @click="model = Wallet.id" class="tab" :class="{ active: Wallet.id == model }">
			<AddressIcon :address="Wallet.key" />
		</button>
	</div>
</template>



<script setup lang="ts">
import AddressIcon from '@/components/atomic/AddressIcon.vue'
import { computed } from 'vue'
import { Wallets } from '@/functions/Wallets'

const props = defineProps(['addresses', 'modelValue'])
const emit = defineEmits(['update:modelValue'])

const model = computed({
	get () { return props.modelValue },
	set (value) { emit('update:modelValue', value) }
})
</script>



<style scoped>
.wallet-tabs {
	display: flex;
}
.wallet-tabs > * + * {
	margin-inline-start: 16px;
}
.tab {
	opacity: 0.5;
	transition: 0.2s ease;
}
.tab.active,
.tab:hover {
	opacity: 1;
}
.address-icon {
	width: 40px;
	height: 40px;
	padding: 8px;
	background: var(--background);
	border-radius: var(--border-radius);
}
</style>