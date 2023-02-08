<template>
	<div ref="observed">
		<slot />
	</div>
</template>



<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps<{
	threshold?: number
	once?: boolean
	onIntersection?: any
	onResize?: any
	onMutation?: any
}>()
const emit = defineEmits<{
	(e: 'intersection', value: IntersectionObserverEntry): void
	(e: 'resize', value: ResizeObserverEntry): void
	(e: 'mutation', value: MutationRecord): void
}>()
const observed = ref(null)
defineExpose({ el: observed })

if (props.onIntersection) {
	const intersectionObserver = new IntersectionObserver((entries) => {
		const intersections = entries.filter(e => e.isIntersecting)
		if (!intersections) { return }
		intersections.forEach(e => emit('intersection', e))
		if (props.once) { unobserve() }
	}, { threshold: [props.threshold || 0] })
	const unobserve = () => observed.value && intersectionObserver.unobserve(observed.value)
	onMounted(() => intersectionObserver.observe(observed.value!))
	onBeforeUnmount(unobserve)
}

if (props.onResize) {
	const resizeObserver = new ResizeObserver((entries) => {
		entries.forEach(e => emit('resize', e))
		if (props.once) { unobserve() }
	})
	const unobserve = () => observed.value && resizeObserver.unobserve(observed.value)
	onMounted(() => resizeObserver.observe(observed.value!))
	onBeforeUnmount(unobserve)
}

if (props.onMutation) {
	const mutationObserver = new MutationObserver((entries) => {
		entries.forEach(e => emit('mutation', e))
		if (props.once) { unobserve() }
	})
	const unobserve = () => observed.value && mutationObserver.disconnect()
	onMounted(() => mutationObserver.observe(observed.value!, { childList: true, attributes: true, subtree: true }))
	onBeforeUnmount(unobserve)
}
</script>