<template>
	<Observer ref="popup" class="popup" @resize="size = $event">
		<div class="card" :class="{ fill, padding }">
			<slot />
		</div>
	</Observer>
</template>



<script setup lang="ts">
import Observer from '@/components/function/Observer.vue'
import { computed, ref } from 'vue'

const props = defineProps<{
	padding: boolean
}>()

const popup = ref(undefined as undefined | HTMLElement)
const size = ref(undefined as undefined | ResizeObserverEntry)
const fill = computed(() => {
	if (!size.value) { return false }
	const { width, height } = size.value.contentRect
	return height < 700 && width < 500
})
</script>



<style scoped>
.popup {
	display: flex;
	align-items: center;
	justify-content: center;
}

.card {
	display: flex;
	align-items: stretch;
	justify-content: center;
	overflow: hidden;
	background: var(--background);
	max-height: 100%;
	max-width: calc(500px - 2 * var(--spacing));
	margin: var(--spacing);
}

.card:not(.padding) {
	padding: 0;
}

.card.fill {
	height: 100%;
	width: 100%;
	max-width: 100%;
	border-radius: 0;
	margin: 0;
}

.background {
	position: absolute;
	border-radius: inherit;
	opacity: 0.5;
	inset: 0;
	display: flex;
	justify-content: center;
	align-items: center;
}

.background-content {
	position: absolute;
	height: var(--popup-width);
	padding-bottom: 24px;
}

.content {
	flex: 1 1 0;
	position: relative;
	justify-content: space-between;
}
</style>