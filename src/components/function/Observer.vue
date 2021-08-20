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
			if (entries[0].isIntersecting) { emit('intersection', entries[0]) }
			if (props.once) { intersectionObserver.unobserve(observed.value) }
		}, { threshold: [props.threshold] })
		onMounted(() => intersectionObserver.observe(observed.value))
		onBeforeUnmount(() => intersectionObserver.unobserve(observed.value))
		return { observed }
	}
}
</script>

<style scoped>
</style>