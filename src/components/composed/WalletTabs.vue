<template>
	<div class="wallet-tabs">
		<Carousel v-model="carouselIndex" :options="{ position: 'start', overscroll: false }">
			<button v-for="Wallet in Wallets" :key="Wallet.id" type="button" @click="model = Wallet.id" class="tab" :class="{ active: Wallet.id == model }">
				<AddressIcon :address="Wallet.key" />
			</button>
		</Carousel>
	</div>
</template>



<script setup lang="ts">
import Carousel from '@/components/layout/Carousel.vue'
import AddressIcon from '@/components/atomic/AddressIcon.vue'
import { computed } from 'vue'
import { Wallets } from '@/functions/Wallets'

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const model = computed({
	get () { return props.modelValue },
	set (value) { emit('update:modelValue', value) }
})

const carouselIndex = 0
</script>



<style scoped>
.wallet-tabs {
	display: flex;
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