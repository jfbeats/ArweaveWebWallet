<template>
	<div class="input-ar" :class="{ focus }">
		<div class="input">
			<div class="icon-container">
				<img class="icon no-select" src="@/assets/logos/arweave.svg" draggable="false">
			</div>
			<input v-model="model" inputmode="numeric" class="text" placeholder="AR" @focus="focus = 1" @blur="focus = 0">
		</div>
		<div v-if="currentPrice" class="spacer"></div>
		<div v-if="currentPrice" class="input">
			<input v-model="model2" inputmode="numeric" class="text right" :placeholder="currency" @focus="focus = 2" @blur="focus = 0">
			<div class="icon-container">
				<span class="symbol no-select">{{ currencySymbol }}</span>
			</div>
		</div>
	</div>
</template>



<script>
import ArweaveStore from '@/store/ArweaveStore'
import { computed, ref, watch } from 'vue'

export default {
	props: ['modelValue'],
	setup (props, { emit }) {
		const model = computed({
			get () { return props.modelValue },
			set (value) {
				if (focus.value === 1 || focus.value === 0) {
					input2.value = value && !isNaN(value) ? +(value * currentPrice.value).toFixed(2) : ''
					emit('update:modelValue', value)
				}
			}
		})
		const input2 = ref('')
		const model2 = computed({
			get () { return input2.value },
			set (value) {
				if (focus.value === 2) {
					input2.value = value
					emit('update:modelValue', value && !isNaN(value) ? value / currentPrice.value : '')
				}
			}
		})
		const currentPrice = computed(() => ArweaveStore.redstone.currentPrice)
		const currency = computed(() => ArweaveStore.redstone.currency)
		const currencySymbol = computed(() => new Intl.NumberFormat(navigator.languages, { style: 'currency', currency: currency.value }).format(0).replace(/[\w\d\.\,\s]/g, '') || '$')
		const focus = ref(0)
		watch(() => model.value, (newVal, oldVal) => {
			if (focus.value === 1 && !newVal.match(/^(?:\d*\.?\d*)?$/)) { model.value = oldVal }
		})
		watch(() => model2.value, (newVal, oldVal) => {
			if (focus.value === 2 && !newVal.match(/^(?:\d*\.?\d*)?$/)) { model2.value = oldVal }
		})
		return { model, model2, currentPrice, currency, currencySymbol, focus }
	}
}
</script>



<style scoped>
.input-ar {
	height: 3.5em;
	display: flex;
	align-items: center;
	border-radius: var(--border-radius);
	border: 1px solid #ffffff24;
	background: #ffffff06;
	transition: 0.3s ease;
}

.input-ar.focus {
	border: 1px solid #ffffff88;
	background: #ffffff08;
	box-shadow: 0 0 10px 0 #ffffff11;
}

.input {
	height: inherit;
	flex: 1 1 0;
	display: flex;
	align-items: center;
	justify-content: center;
	/* background: var(--background3); */
	border-radius: inherit;
}

.spacer {
	width: 1px;
	height: 2em;
	background: #ffffff18;
	transition: 0.3s ease;
}

.focus .spacer {
	background: #ffffff60;
}

.icon-container {
	flex: 0 0 auto;
	height: 3em;
	width: 3em;
	border-radius: inherit;
	padding: 3px;
	display: flex;
	align-items: center;
	justify-content: center;
}

.icon {
	height: 1.4em;
	width: 1.4em;
	object-fit: contain;
	opacity: var(--element-secondary-opacity);
	transition: 0.3s ease;
}

.symbol {
	font-size: 1.4em;
	opacity: var(--element-secondary-opacity);
	transition: 0.3s ease;
}

.focus .icon,
.focus .symbol {
	opacity: 1;
}

.text {
	height: inherit;
	font-size: 1em;
	padding: 0 var(--spacing);
	outline: none;
	border: none;
	flex: 1 1 auto;
	background-color: transparent;
	color: var(--element-secondary);
	width: 100%;
}

.text.right {
	text-align: right;
}
</style>