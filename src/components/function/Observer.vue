<template>
	<div ref="observed">
		<slot />
	</div>
</template>

<script>
import { onBeforeUnmount, onMounted, ref } from 'vue'

export default {
	props: {
		observe: [ Array, String ],
		threshold: { default: 0 },
		once: { type: Boolean, default: false },
	},
	setup (props, { emit }) {
		const observed = ref(null)

		if (props.observe === 'intersection' || props.observe.includes('intersection')) {
			const intersectionObserver = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting) { emit('intersection', entries[0], unobserve) }
				if (props.once) { unobserve() }
			}, { threshold: [props.threshold] })
			const unobserve = () => intersectionObserver.unobserve(observed.value)
			onMounted(() => intersectionObserver.observe(observed.value))
			onBeforeUnmount(unobserve)
		}

		if (props.observe === 'resize' || props.observe.includes('resize')) {
			const resizeObserver = new ResizeObserver((entries) => {
				emit('resize', entries[0]?.contentRect, unobserve)
				if (props.once) { unobserve() }
			})
			const unobserve = () => resizeObserver.unobserve(observed.value)
			onMounted(() => {
				// emit('resize', observed.value.getBoundingClientRect(), unobserve)
				resizeObserver.observe(observed.value)
			})
			onBeforeUnmount(unobserve)
		}

		return { observed }
	}
}
</script>

<style scoped>
</style>