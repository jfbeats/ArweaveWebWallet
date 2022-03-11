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
}>()
const emit = defineEmits<{
	(e: 'intersection', value: IntersectionObserverEntry): void
	(e: 'resize', value: ResizeObserverEntry): void
}>()

const observed = ref(null)

if (props.onIntersection) {
	const intersectionObserver = new IntersectionObserver((entries) => {
		if (!entries[0].isIntersecting) { return }
		emit('intersection', entries[0])
		if (props.once) { unobserve() }
	}, { threshold: [props.threshold || 0] })
	const unobserve = () => observed.value && intersectionObserver.unobserve(observed.value)
	onMounted(() => intersectionObserver.observe(observed.value!))
	onBeforeUnmount(unobserve)
}

if (props.onResize) {
	const resizeObserver = new ResizeObserver((entries) => {
		emit('resize', entries[0])
		if (props.once) { unobserve() }
	})
	const unobserve = () => observed.value && resizeObserver.unobserve(observed.value)
	onMounted(() => resizeObserver.observe(observed.value!))
	onBeforeUnmount(unobserve)
}
</script>