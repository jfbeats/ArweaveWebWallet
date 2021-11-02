<template>
	<div ref="root" class="carousel flex-row no-scrollbar">
		<transition-group name="fade-list">
			<div class="margin fade-list-item" key="margin1"></div>
			<slot />
			<div class="margin fade-list-item" key="margin2"></div>
		</transition-group>
	</div>
</template>



<script>
import { onMounted, ref, computed, watchEffect } from 'vue'

export default {
	props: ['modelValue'],
	setup (props, { emit }) {
		const model = computed({
			get () { return props.modelValue },
			set (value) { emit('update:modelValue', value) }
		})
		const root = ref(null)
		const elements = computed(() => {
			if (!root.value?.children) { return null }
			return Array(...root.value.children).slice(1, root.value.children.length - 1)
		})
		const effect = () => {
			elements.value?.[model.value]?.scrollIntoView({behavior: "smooth", block: "start", inline: "start"})
		}
		watchEffect(effect)
		onMounted(() => setTimeout(effect))

		return { model, root }
	}
}
</script>



<style scoped>
.carousel {
	overflow: auto;
	white-space: nowrap;
	scroll-snap-type: x mandatory;
	display: block;
	overscroll-behavior-x: contain;
	position: relative;
}

.margin {
	width: calc(var(--current-vw) * 1);
	display: inline-block;
}
</style>