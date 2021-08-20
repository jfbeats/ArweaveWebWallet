<template>
	<div ref="observed">
		<slot />
	</div>
</template>

<script>
import { onBeforeUnmount, onMounted, ref } from 'vue'

export default {
	props: {
		threshold: { default: 0 },
		once: { type: Boolean, default: false },
	},
	setup (props, { emit }) {
		const observed = ref(null)
		const intersectionObserver = new IntersectionObserver((entries) => {
			if (entries[0].isIntersecting) { emit('intersection', entries[0], unobserve) }
			if (props.once) { unobserve() }
		}, { threshold: [props.threshold] })
		const unobserve = () => intersectionObserver.unobserve(observed.value)
		onMounted(() => intersectionObserver.observe(observed.value))
		onBeforeUnmount(unobserve)
		return { observed }
	}
}
</script>

<style scoped>
</style>