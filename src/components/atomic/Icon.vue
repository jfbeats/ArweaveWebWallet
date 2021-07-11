<template>
	<div v-if="icon" class="icon">
		<div class="icon-background">
			<span v-if="isSymbol" class="symbol no-select">{{ icon }}</span>
			<img v-else class="img no-select" :src="icon" draggable="false">
		</div>
	</div>
</template>



<script>
import { computed } from 'vue'
export default {
	props: ['icon'],
	setup (props) {
		const isSymbol = computed(() => typeof props.icon === "string" && props.icon.length <= 2)
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
</style>