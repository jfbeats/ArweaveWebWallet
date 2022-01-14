<template>
	<div ref="root" class="carousel flex-row no-scrollbar" :style="style">
		<transition-group name="fade-list">
			<div v-if="options?.overscroll" class="margin fade-list-item" key="margin1" />
			<slot />
			<div v-if="options?.overscroll" class="margin fade-list-item" key="margin2" />
		</transition-group>
	</div>
</template>



<script setup lang="ts">
import { awaitEffect } from '@/functions/AsyncData'
import { onMounted, ref, computed, watch, nextTick, inject } from 'vue'

const props = defineProps<{
	modelValue?: number
	options: {
		position: ScrollLogicalPosition
		overscroll: boolean
		immediate?: boolean
		ignoreTransition?: boolean
	}
}>()
const emit = defineEmits(['update:modelValue'])
const parentTransitionState = inject('transitionState', null as any)

const model = computed<number | undefined>({
	get () { return props.modelValue },
	set (value) { emit('update:modelValue', value) }
})
const root = ref(null as null | HTMLElement)
const elements = computed(() => {
	if (!root.value?.children) { return [] }
	return Array(...root.value.children).filter(e => !e.classList.contains('margin'))
})
const style = computed(() => ({
	'--position': props.options?.position || 'start',
}))
const effect = async (instant?: boolean) => {
	if (model.value == null) { return }
	if (!props.options.ignoreTransition) { await awaitEffect(() => !parentTransitionState.running) }
	const index = Math.max(model.value || 0, 0)
	elements.value[index]?.scrollIntoView({
		behavior: instant ? 'instant' as any : 'smooth',
		block: 'start',
		inline: props.options?.position || 'start',
	})
}
onMounted(async () => {
	await nextTick()
	await awaitEffect(() => elements.value.length)
	setTimeout(() => effect(props.options.immediate))
	watch(model, () => effect())
})
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