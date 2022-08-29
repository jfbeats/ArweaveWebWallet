<template>
	<div class="wallet-selector">
		<TransitionsManager>
			<Link v-if="model" :run="selectWallet" class="tab" :class="{ active }">
				<AddressIcon :address="address" />
			</Link>
		</TransitionsManager>
		<button v-if="onExit" class="exit" type="button" @click="$emit('exit')">
			<div class="exit-background" />
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
				<path d="M0 0h24v24H0V0z" fill="none" />
				<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
			</svg>
		</button>
	</div>
</template>



<script setup lang="ts">
import AddressIcon from '@/components/atomic/AddressIcon.vue'
import TransitionsManager from '@/components/visual/TransitionsManager.vue'
import Link from '@/components/function/Link.vue'
import { getWalletById } from '@/functions/Wallets'
import { computed } from 'vue'

const props = defineProps({ modelValue: String, onExit: Function, onSelectWallet: Function, active: Boolean })
const emit = defineEmits(['update:modelValue', 'selectWallet', 'exit'])

const model = computed<string | undefined>({
	get () { return props.modelValue },
	set (value) { emit('update:modelValue', value) }
})

const address = computed(() => getWalletById(model.value)?.key)
const selectWallet = computed(() => {
	if (!props.onSelectWallet) { return }
	return () => emit('selectWallet')
})
</script>



<style scoped>
.wallet-selector {
	--spacing: var(--toolbar-spacing);
	display: flex;
}

.wallet-selector > * + * {
	margin-inline-start: var(--spacing);
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