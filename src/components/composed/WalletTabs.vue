<template>
	<div class="wallet-tabs">
		<button v-for="address in addresses" :key="address" type="button" @click="model = address" class="tab" :class="{ active: address == model }">
			<AddressIcon :address="address" />
		</button>
	</div>
</template>

<script>
import AddressIcon from '@/components/atomic/AddressIcon.vue'
import { computed } from 'vue'
export default {
	components: { AddressIcon },
	props: ['addresses', 'modelValue'],
	setup (props, { emit }) {
		const model = computed({
			get () { return props.modelValue },
			set (value) { emit('update:modelValue', value) }
		})
		return { model }
	}
}
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