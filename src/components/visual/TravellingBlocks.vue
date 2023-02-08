<template>
	<Observer class="travelling-blocks" @resize="resize">
		<div class="bubbles">
			<div class="base" />
			<div class="bubble" v-for="(n, i) in styles.entries()" :key="i + 'i' + iterations[i]" :style="n" @animationiteration="e => update(e, i)" />
		</div>
		<svg style="position:fixed;">
			<defs>
				<filter id="blob">
					<feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="7" />
					<feColorMatrix in="blur" result="blob" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -11" />
					<feMorphology in="blob" result="mask" operator="erode" radius="2" />
					<feComposite in="blob" in2="mask" operator="out" />
				</filter>
			</defs>
		</svg>
	</Observer>
</template>



<script setup lang="ts">
import Observer from '@/components/function/Observer.vue'
import { computed, ref, watch } from 'vue'

const containerSize = ref(undefined as undefined | ResizeObserverEntry)
const nbBlocks = computed(() => Math.floor((containerSize.value?.contentRect.width || 0) / 60))
const iterations = ref([] as any[])
const styles = ref([] as string[])
const resize = (size: ResizeObserverEntry) => containerSize.value = size
const getStyle = () => {
	const range = containerSize.value?.contentRect.height || 0
	return `
		--size:${(1.7 + Math.random() * 0.5) * 100}%;
		--distance:${range * 0.5 + range * 0.5 * Math.random()}px;
		--position:${Math.random() * 100}%;
		--time:${4 + Math.random() * 18}s;
	`
}
watch(nbBlocks, n => {
	iterations.value = Array(n).fill(0)
	styles.value = Array(n).fill(undefined).map(() => getStyle())
}, { immediate: true })
const update = (e: AnimationEvent, i: number) => {
	iterations.value[i]++
	styles.value[i] = getStyle()
}
</script>



<style scoped>
.travelling-blocks {
	position: relative;
	pointer-events: none;
	touch-action: none;
	opacity: 0.8;
}

.bubbles {
	height: 100%;
	width: 100%;
	position: absolute;
	bottom: 0;
	overflow: clip;
	filter: url("#blob");
}

.base {
	width: 100%;
	height: 2rem;
	position: absolute;
	bottom: 0;
	background: #ffffff;
}

.bubble {
	width: 3.5rem;
	height: 3.5rem;
	position: absolute;
	bottom: 0;
	background: #ffffff;
	border-radius: 16%;
	left: var(--position);
	animation: bubble-move var(--time) ease-in infinite,
		bubble-opacity var(--time) ease-in infinite;
}

@keyframes bubble-opacity {
	0% {
		opacity: 0;
	}
	10%, 90% {
		opacity: 1;
	}
	100% {
		opacity: 0;
	}
}

@keyframes bubble-move {
	0% {
		transform: translate(-50%, 100%) scale(var(--size));
	}
	100% {
		transform: translate(-50%, calc(100% - var(--distance))) scale(100%);
	}
}
</style>