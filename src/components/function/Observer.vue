<template>
	<div ref="observed">
		<slot />
	</div>
</template>



<script setup lang="ts">
import { useDataWrapper } from '@/functions/AsyncData'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps<{
	threshold?: number
	once?: boolean
	onIntersection?: (entry: IntersectionObserverEntry) => any
	onIntersecting?: (entry: IntersectionObserverEntry) => any
	onResize?: (entry: ResizeObserverEntry) => any
	onMutation?: (entry: MutationRecord) => any
}>()
const emit = defineEmits<{
	(e: 'intersection', value: IntersectionObserverEntry): void
	(e: 'intersecting', value: IntersectionObserverEntry): void
	(e: 'resize', value: ResizeObserverEntry): void
	(e: 'mutation', value: MutationRecord): void
}>()
const observed = ref(null)
defineExpose({ el: observed })

const intersection = (filter?: boolean) => {
	const intersectionObserver = new IntersectionObserver((entries) => {
		const intersections = filter ? entries.filter(e => e.isIntersecting) : entries
		intersections.forEach(e => filter ? emit('intersecting', e) : emit('intersection', e))
		if (props.once) { unobserve() }
	}, { threshold: [props.threshold || 0] })
	const unobserve = () => observed.value && intersectionObserver.unobserve(observed.value)
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