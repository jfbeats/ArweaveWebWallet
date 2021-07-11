<template>
	<transition name="fade">
		<div v-if="dragOverlay" class="dragOverlay" />
	</transition>
</template>

<script>
import InterfaceStore from '@/store/InterfaceStore'
import { computed } from 'vue'

export default {
	setup () {
		const dragOverlay = computed(() => InterfaceStore.dragOverlay)
		return { dragOverlay }
	}
}
</script>

<style scoped>
.dragOverlay {
	pointer-events: none;
	position: absolute;
	background-image: radial-gradient(circle at center, #333, #111);
	background-position: center;
	background-repeat: no-repeat;
	background-origin: center;
	background-size: cover;
	width: 100%;
	height: 100%;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	z-index: 99999;
	border-radius: inherit;
	filter: opacity(0.6);
}

.dragOverlay::after {
	content: "";
	text-align: center;
	background-image: url("~@/assets/icons/drop.svg");
	background-position: center;
	background-repeat: no-repeat;
	background-origin: center;
	background-size: 48px 48px;
	position: absolute;
	width: 100%;
	height: 100%;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 99999;
}
</style>