<template>
	<div ref="observed">
		<slot />
	</div>
</template>



<script setup lang="ts">
import { useDataWrapper } from '@/functions/AsyncData'
import InterfaceStore from '@/store/InterfaceStore'
import { WatchStopHandle, computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps<{
	threshold?: number
	once?: boolean
	onIntersection?: (entry: Partial<IntersectionObserverEntry>) => any
	onIntersecting?: (entry: IntersectionObserverEntry) => any
	onResize?: (entry: ResizeObserverEntry) => any
	onMutation?: (entry: MutationRecord) => any
}>()
const emit = defineEmits<{
	(e: 'intersection', value: Partial<IntersectionObserverEntry>): void
	(e: 'intersecting', value: IntersectionObserverEntry): void
	(e: 'resize', value: ResizeObserverEntry): void
	(e: 'mutation', value: MutationRecord): void
}>()
const observed = ref(null)
defineExpose({ el: observed })

const intersection = (filter?: boolean) => {
	const intersectionObserverState = ref(undefined as undefined | Partial<IntersectionObserverEntry>)
	let watchStop = undefined as undefined | WatchStopHandle
	if (!filter){ watchStop = watch(() => InterfaceStore.windowVisible, visible => {
		if (!intersectionObserverState.value) { return }
		const wasIntersecting = intersectionObserverState.value.isIntersecting
		if (visible === wasIntersecting) { return }
		intersectionObserverState.value = { isIntersecting: visible }
		emit('intersection', intersectionObserverState.value)
	}) }
	const intersectionObserver = new IntersectionObserver((entries) => {
		const intersections = filter ? entries.filter(e => e.isIntersecting) : entries
		intersections.forEach(e => {
			intersectionObserverState.value = e
			filter ? emit('intersecting', e) : emit('intersection', e)
		})
		if (props.once && entries.filter(e => e.isIntersecting).length) { unobserve() }
	}, { threshold: [props.threshold || 0] })
	const unobserve = () => watchStop?.() || observed.value && intersectionObserver.unobserve(observed.value)
	onMounted(() => intersectionObserver.observe(observed.value!))
	onBeforeUnmount(unobserve)
	return unobserve
}

const resize = () => {
	const resizeObserver = new ResizeObserver((entries) => {
		entries.forEach(e => emit('resize', e))
		if (props.once) { unobserve() }
	})
	const unobserve = () => observed.value && resizeObserver.unobserve(observed.value)
	onMounted(() => resizeObserver.observe(observed.value!))
	onBeforeUnmount(unobserve)
	return unobserve
}

const mutation = () => {
	const mutationObserver = new MutationObserver((entries) => {
		entries.forEach(e => emit('mutation', e))
		if (props.once) { unobserve() }
	})
	const unobserve = () => observed.value && mutationObserver.disconnect()
	onMounted(() => mutationObserver.observe(observed.value!, { childList: true, attributes: true, subtree: true }))
	onBeforeUnmount(unobserve)
	return unobserve
}

const listeners = {
	onIntersection: () => intersection(false),
	onIntersecting: () => intersection(true),
	onResize: () => resize(),
	onMutation: () => mutation(),
} satisfies { [keys in keyof Partial<typeof props>]: Function }
const activeListeners = computed(() => (Object.keys(listeners) as [keyof typeof listeners]).filter(key => props[key]))
const wrapped = useDataWrapper(activeListeners, i => i, key => listeners[key](), i => i())
watch(wrapped, () => {})
</script>