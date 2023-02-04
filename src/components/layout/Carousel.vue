<template>
	<div ref="root" class="carousel inline-margin-gap no-scrollbar" :class="{ scrollSnapStop: options.scrollSnapStop}" :style="style">
		<transition-group name="fade-list">
			<div v-if="options?.overscroll" class="margin fade-list-item" key="margin1">
				<Observer class="limit start" @intersection="val => emit('start', val)" />
			</div>
			<slot />
			<div v-if="options?.overscroll" class="margin fade-list-item" key="margin2">
				<Observer class="limit end" @intersection="val => emit('end', val)" />
			</div>
		</transition-group>
	</div>
</template>



<script setup lang="ts">
import Observer from '@/components/function/Observer.vue'
import { awaitEffect } from '@/functions/AsyncData'
import { onMounted, onBeforeUnmount, ref, computed, watch, nextTick, inject } from 'vue'

const props = defineProps<{
	index?: number
	options: {
		align?: ScrollLogicalPosition
		overscroll: boolean
		immediate?: boolean
		awaitTransition?: boolean
		scrollSnapStop?: boolean
	}
	onIndex?: any
}>()
const emit = defineEmits<{
	(e: 'start', val: IntersectionObserverEntry): void
	(e: 'end', val: IntersectionObserverEntry): void
	(e: 'index', val: number): void
	(e: 'elements', val: HTMLElement[]): void
}>()
const parentTransitionState = inject('transitionState', null as any)
const root = ref(null as null | HTMLElement)

const calcOffset = (el: HTMLElement) => {
	if (!el || !root.value) { return }
	if (props.options.align === 'center') { return el.offsetLeft + el.offsetWidth / 2 - root.value.offsetWidth! / 2 }
	if (props.options.align === 'end') { return el.offsetLeft + el.offsetWidth - root.value.offsetWidth! }
	return el.offsetLeft
}
const elements = computed(() => {
	refresh.value
	if (!root.value?.children) { return [] }
	return Array(...root.value.children).filter(e => !e.classList.contains('margin')) as HTMLElement[]
})
const style = computed(() => ({
	'--position': props.options?.align || 'start',
}))
const effect = async (index?: number, instant?: boolean) => {
	if (index == undefined) { return }
	if (!instant && props.options.awaitTransition) { await awaitEffect(() => !parentTransitionState.running) }
	index = Math.max(index || 0, 0)
	root.value?.scroll({
		left: calcOffset(elements.value[index]),
		behavior: instant ? 'instant' as any : 'smooth',
	})
}
let observer: MutationObserver
const refresh = ref(0)
let intersectionObserver: IntersectionObserver
const visibleElements = ref([] as Element[])
const visibleIndexes = computed(() => visibleElements.value.map(el => elements.value.indexOf(el as HTMLElement)).filter(i => i >= 0).sort((a, b) => a - b))
const visibleIndex = computed(() => {
	if (!visibleIndexes.value.length) { return }
	if (props.options.align === 'center') {
		if (!root.value) { return }
		const parentPos = root.value.getBoundingClientRect()
		const parentCenter = parentPos.left + parentPos.width / 2
		const distances = visibleIndexes.value.map(i => {
			const childPos = elements.value[i].getBoundingClientRect()
			const childCenter = childPos.left + childPos.width / 2
			return childCenter - parentCenter
		}).map(val => Math.abs(val))
		const index = distances.indexOf(Math.min(...distances))
		return visibleIndexes.value[index]
	}
	if (props.options.align === 'start') { return visibleIndexes.value[0] }
	if (props.options.align === 'end') { return visibleIndexes.value[visibleIndexes.value.length - 1] }
})
watch(visibleIndex, val => val != null && emit('index', val), { immediate: true })
watch(elements, val => emit('elements', val), { immediate: true })
onMounted(async () => {
	observer = new MutationObserver(async () => { refresh.value++ })
	observer.observe(root.value!, { subtree: false, childList: true })
	intersectionObserver = new IntersectionObserver(entries => {
		entries.forEach(el => {
			if (el.intersectionRatio > 0.5) {
				if (!visibleElements.value.includes(el.target)) { visibleElements.value.push(el.target) }
			} else {
				visibleElements.value = visibleElements.value.filter(visEl => visEl !== el.target)
			}
		})
		visibleElements.value = visibleElements.value.filter(el => elements.value.includes(el as HTMLElement))
	}, { root: root.value, threshold: [0.4, 0.6] })
	watch(elements, () => props.onIndex && elements.value.forEach(el => intersectionObserver.observe(el)), { immediate: true })
	await nextTick()
	await awaitEffect(() => elements.value.length)
	setTimeout(() => {
		const hasInitSlide = !props.options.immediate && props.index && props.index > 0 || false
		if (!hasInitSlide) { effect(props.index, true) }
		else { effect(0, true) }
		watch(() => props.index, () => props.index !== visibleIndex.value && effect(props.index), { immediate: hasInitSlide })
	})
})
onBeforeUnmount(() => {
	observer?.disconnect()
	intersectionObserver?.disconnect()
})
</script>



<style scoped>
.carousel {
	--position: start;
	width: 100%;
	scroll-snap-type: x mandatory;
	overflow: auto;
	white-space: nowrap;
	display: block; /* for transitions */
	line-height: 0;
	overscroll-behavior-x: contain;
	position: relative;
}

.carousel > :deep(*) {
	line-height: var(--line-height);
	vertical-align: bottom;
	white-space: initial;
}

.carousel > :deep(*:not(.margin)) {
	scroll-snap-align: var(--position);
}

.carousel.scrollSnapStop > :deep(*) {
	scroll-snap-stop: always;
}

.carousel > :deep(.fade-list-leave-active) {
	position: absolute !important;
}

.carousel > :deep(.fade-list-rise-leave-active) {
	position: absolute !important;
}

.margin {
	width: 100%;
	display: inline-block;
	position: relative;
}

.limit {
	position: absolute;
	bottom: 0;
	width: 100%;
	height: 1px;
}

.limit.start {
	left: 200px;
}

.limit.end {
	right: 200px;
}
</style>