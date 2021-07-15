<template>
	<transition name="fade">
		<div v-if="icon" class="icon" :key="icon">
			<div class="icon-background">
				<div v-if="icon == 'loader'" class="loader" />
				<span v-else-if="isSymbol" class="symbol no-select">{{ icon }}</span>
				<img v-else class="img no-select" :src="icon" draggable="false">
			</div>
		</div>
	</transition>
</template>



<script>
import { computed } from 'vue'
export default {
	props: ['icon'],
	setup (props) {
		const isSymbol = computed(() => typeof props.icon === 'string' && props.icon.length <= 2)
		return { isSymbol }
	}
}
</script>



<style scoped>
.icon {
	flex: 0 0 auto;
	height: 3em;
	width: 3em;
	border-radius: inherit;
	padding: 3px;
	/* display: flex;
	align-items: center;
	justify-content: center; */
	transition: 0.3s ease;
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

.img {
	width: 1.4em;
	height: 1.4em;
	object-fit: contain;
}

.symbol {
	font-size: 1.4em;
}

.loader,
.loader:after {
	border-radius: 50%;
	width: 70%;
	height: 70%;
}

.loader {
	border: 4px solid #ffffff33;
	border-top: 4px solid currentColor;
	animation: loader-animation 2s infinite linear;
}

@keyframes loader-animation {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}
</style>