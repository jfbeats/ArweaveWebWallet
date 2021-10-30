<template>
	<div class="wallet-tabs">
		<button v-if="model" type="button" @click="$emit('selectWallet')" class="tab" :class="{ active: InterfaceStore.toolbar.links }">
			<AddressIcon :address="model" />
		</button>
		<button v-if="exit" class="exit" type="button" @click="$emit('exit')">
			<div class="exit-background" />
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
				<path d="M0 0h24v24H0V0z" fill="none" />
				<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
			</svg>
		</button>
	</div>
</template>

<script>
import AddressIcon from '@/components/atomic/AddressIcon.vue'
import ArweaveStore from '@/store/ArweaveStore'
import InterfaceStore from '@/store/InterfaceStore'
import { computed } from 'vue'

export default {
	components: { AddressIcon },
	props: {
		modelValue: { default: ArweaveStore.wallets[0]?.key || '' }, // todo default wallet here too
		exit: { default: false }
	},
	setup (props, { emit }) {
		const model = computed({
			get () { return props.modelValue },
			set (value) { emit('update:modelValue', value) }
		})
		return { model, InterfaceStore }
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

.tab.active {
	opacity: 1;
}

.address-icon {
	width: 40px;
	height: 40px;
	padding: 8px;
	background: var(--background);
	border-radius: var(--border-radius);
}

.exit {
	width: 40px;
	height: 40px;
	color: var(--red);
	position: relative;
	flex: 0 0 auto;
}

.exit-background {
	position: absolute;
	width: 100%;
	height: 100%;
	border-radius: var(--border-radius);
	background: var(--red);
	opacity: 0.1;
}

.exit svg {
	width: 100%;
	height: 100%;
	padding: 20%;
}
</style>