<template>
	<div class="input-ar" :class="{ focus }">
		<div class="input">
			<div class="icon-container">
				<div class="icon-background">
					<img class="icon no-select" src="@/assets/logos/arweave.svg" draggable="false">
				</div>
			</div>
			<input v-model="model" inputmode="numeric" class="text" placeholder="AR" @focus="focus = 1" @blur="focus = 0">
		</div>
		<div v-if="currentPrice" class="spacer"></div>
		<div v-if="currentPrice" class="input">
			<input v-model="model2" inputmode="numeric" class="text right" :placeholder="currency" @focus="focus = 2" @blur="focus = 0">
			<div class="icon-container">
				<div class="icon-background">
					<img class="icon no-select" src="@/assets/currency/usd.svg" draggable="false">
				</div>
			</div>
		</div>
	</div>
</template>



<script>
import ArweaveStore from '@/store/ArweaveStore'
import { computed, ref } from 'vue'

export default {
	props: ['modelValue'],
	setup (props, { emit }) {
		const model = computed({
			get () { return props.modelValue },
			set (value) {
				if (focus.value === 1) {
					input2.value = value ? value * currentPrice.value : ''
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
					emit('update:modelValue', value ? value / currentPrice.value : '')
				}
			}
		})
		const currentPrice = computed(() => ArweaveStore.redstone.currentPrice)
		const currency = computed(() => ArweaveStore.redstone.currency)
		const focus = ref(0)
		return { model, model2, currentPrice, currency, focus }
	}
}
</script>



<style scoped>
.input-ar {
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
}

.icon-background {
	width: 100%;
	height: 100%;
	/* background: var(--background2); */
	border-radius: inherit;
	display: flex;
	align-items: center;
	justify-content: center;
}

.icon {
	width: 50%;
	height: 50%;
	object-fit: contain;
	opacity: var(--element-secondary-opacity);
	transition: 0.3s ease;
}

.focus .icon {
	opacity: 1;
}

.text {
	font-size: 1em;
	padding: 0 var(--spacing);
	outline: none;
	border: none;
	flex: 1 1 auto;
	height: 4em;
	background-color: transparent;
	color: var(--element-secondary);
	width: 100%;
}

.text.right {
	text-align: right;
}
</style>