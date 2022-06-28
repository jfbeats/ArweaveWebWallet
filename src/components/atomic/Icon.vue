<template>
	<span class="icon">
		<transition name="fade-fast" mode="out-in">
			<component v-if="component" :is="component" :key="key" fill="currentColor" />
			<svg v-else-if="iconData == 'loader'" class="loader" height="100" width="100" viewBox="0 0 100 100" :class="{ spin: progress == null }">
				<circle stroke="#ffffff22" :stroke-width="thickness" fill="transparent" :r="normalizedRadius" :cx="50" :cy="50" />
				<circle stroke="currentColor" :stroke-dasharray="circumference + ' ' + circumference" :style="{ strokeDashoffset }" :stroke-width="thickness" stroke-linecap="round" fill="transparent" :r="normalizedRadius" :cx="50" :cy="50" @animationiteration="finishAnimation = false" :class="{ spin: progress == null || finishAnimation }" />
			</svg>
			<span v-else-if="isSymbol" :key="'s' + iconData" class="symbol no-select">{{ iconData }}</span>
			<img v-else v-show="loaded" @load="loaded = true" class="img no-select" :key="iconData" :src="iconData" draggable="false" />
		</transition>
	</span>
</template>



<script setup lang="ts">
import { computed, isRef, ref, watch } from 'vue'

const props = defineProps<{
	icon: string | Object
	progress?: number
}>()

const iconData = computed(() => isRef(props.icon) ? props.icon.value : props.icon)
const component = computed(() => typeof iconData.value === 'object' ? iconData.value : null)
const isSymbol = computed(() => typeof iconData.value === 'string' && iconData.value.length <= 2)
const loaded = ref(false)
watch(() => iconData.value, () => loaded.value = false)
const thickness = 5
const normalizedRadius = 50 - thickness / 2
const circumference = normalizedRadius * 2 * Math.PI
const strokeDashoffset = computed(() => circumference - (props.progress ?? 25) / 100 * circumference)
const finishAnimation = ref(false)
watch(() => props.progress, (value, oldValue) => { if (value != null && oldValue == null) { finishAnimation.value = true } })
const key = ref(0)
watch(() => props.icon, () => key.value++, { deep: true })
</script>



<style scoped>
.icon {
	flex: 0 0 auto;
	height: 1em;
	width: 1em;
	border-radius: inherit;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	transition: 0.3s ease;
}

.img {
	width: inherit;
	height: inherit;
	object-fit: contain;
}

.symbol {
	font-size: 1em;
}

.loader {
	transform: rotate(-45deg);
	transition: transform 0.5s ease;
}

.loader.spin {
	transform: rotate(-135deg);
}

circle.spin {
	animation: loader-animation 2s infinite linear;
	/* animation-timing-function: cubic-bezier(0.6, 0.4, 0.4, 0.6); */
}

@keyframes loader-animation {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}

svg {
	width: 100%;
	height: 100%;
}

circle {
	transition: stroke-dashoffset 0.5s ease;
	transform-origin: 50% 50%;
}
</style>