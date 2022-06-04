<template>
	<div ref="root" class="carousel flex-row no-scrollbar" :style="style">
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
	modelValue?: number
	options: {
		align?: ScrollLogicalPosition
		overscroll: boolean
		immediate?: boolean
		awaitTransition?: boolean
	}
}>()
const emit = defineEmits(['update:modelValue', 'start', 'end'])
const parentTransitionState = inject('transitionState', null as any)

const model = computed<number | undefined>({
	get () { return props.modelValue },
	set (value) { emit('update:modelValue', value) }
})
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
	if (!instant && props.options.awaitTransition) { await awaitEffect(() => !parentTransitionState.running) }
	index = Math.max(index || 0, 0)
	root.value?.scroll({
		left: calcOffset(elements.value[index]),
		behavior: instant ? 'instant' as any : 'smooth',
	})
}
let observer: MutationObserver
const refresh = ref(0)
onMounted(async () => {
	observer = new MutationObserver(async () => { refresh.value++ })
	observer.observe(root.value!, { subtree: false, childList: true })
	await nextTick()
	await awaitEffect(() => elements.value.length)
	setTimeout(() => {
		const hasInitSlide = !props.options.immediate && model.value && model.value > 0 || false
		if (!hasInitSlide) { effect(model.value, true) }
		else { effect(0, true) }
		watch(model, v => effect(v), { immediate: hasInitSlide })
	})
})
onBeforeUnmount(() => observer && observer.disconnect())
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
}

.carousel > :deep(*:not(.margin)) {
	scroll-snap-align: var(--position);
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