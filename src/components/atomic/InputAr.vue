<template>
	<div class="input-ar" :class="{ focus }">
		<div class="input">
			<div class="icon-container">
				<div class="icon-background">
					<img class="icon no-select" src="@/assets/logos/arweave.svg" draggable="false">
				</div>
			</div>
			<input inputmode="numeric" class="text" placeholder="AR" @focus="focus = true" @blur="focus = false">
		</div>
		<div v-if="currentPrice" class="spacer"></div>
		<div v-if="currentPrice" class="input">
			<input inputmode="numeric" class="text right" :placeholder="currency" @focus="focus = true" @blur="focus = false">
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
	setup () {
		const currentPrice = computed(() => ArweaveStore.redstone.currentPrice )
		const currency = computed(() => ArweaveStore.redstone.currency )
		const focus = ref(false)
		return { currentPrice, currency, focus }
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

}

.input {
	flex: 1 1 0;
	height: 4em;
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
	height: 3em;
	background-color: transparent;
	color: var(--element-secondary);
	width: 100%;
}

.text.right {
	text-align: right;
}
</style>