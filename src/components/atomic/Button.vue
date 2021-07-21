<template>
	<button class="button no-select">
		<Icon v-if="icon" :icon="icon" />
		<slot></slot>
	</button>
</template>



<script>
import Icon from '@/components/atomic/Icon.vue'

export default {
	components: { Icon },
	props: ['icon']
}
</script>



<style scoped>
.button {
	height: 3.5em;
	padding: 0 var(--spacing);
	border-radius: var(--border-radius);
	background: #ffffff06;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 0 calc(var(--spacing) / 2) 0 var(--glow-color);
	transition: 0.3s ease;
}

.button:hover {
	box-shadow: 0 0 var(--spacing) 0 var(--glow-color);
	filter: brightness(1.3);
}

.button:active {
	filter: brightness(0.7);
	box-shadow: 0 0 var(--spacing) 0 transparent;
	transition: 0s;
}

.button:disabled {
	filter: grayscale(0.5) brightness(0.5);
}

.icon {
	margin-inline-end: 0.5em;
}
</style>