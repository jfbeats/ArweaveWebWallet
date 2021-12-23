<template>
	<div ref="root" class="carousel flex-row no-scrollbar" :style="style">
		<transition-group name="fade-list">
			<div v-if="options?.overscroll" class="margin fade-list-item" key="margin1"></div>
			<slot />
			<div v-if="options?.overscroll" class="margin fade-list-item" key="margin2"></div>
		</transition-group>
	</div>
</template>



<script setup lang="ts">
import { onMounted, ref, computed, watchEffect } from 'vue'

const props = defineProps<{
	modelValue: number
	options: {
		position: ScrollLogicalPosition
		overscroll: boolean
		immediate?: boolean
	}
}>()
const emit = defineEmits(['update:modelValue'])

const model = computed<number>({
	get () { return props.modelValue },
	set (value) { emit('update:modelValue', value) }
})
const root = ref(null as null | HTMLElement)
const elements = computed(() => {
	if (!root.value?.children) { return null }
	return Array(...root.value.children).slice(1, root.value.children.length - 1)
})
const style = computed(() => ({
	'--position': props.options?.position || 'start',
}))
const effect = (instant?: boolean) => {
	const index = Math.max(model.value || 0, 0)
	if (!index) { return }
	elements.value?.[index]?.scrollIntoView({
		behavior: instant ? 'instant' as any : 'smooth',
		block: 'start',
		inline: props.options?.position || 'start',
	})
}
watchEffect(() => effect())
onMounted(() => setTimeout(() => effect(props.options.immediate)))
</script>



<style scoped>
.carousel {
	--position: start;
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
}

.carousel > :deep(*:not(.margin)) {
	scroll-snap-align: var(--position);
}

.margin {
	width: calc(var(--current-vw) * 1);
	display: inline-block;
}
</style>