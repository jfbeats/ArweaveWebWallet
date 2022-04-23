<template>
	<div ref="tooltipEl">
		<slot />
		<div v-show="false">
			<div ref="contentEl" :style="{ padding }">
				<span v-if="content">{{ content }}</span>
				<slot name="content"/>
			</div>
		</div>
	</div>
</template>



<script setup lang="ts">
import tippy, { animateFill, Props } from 'tippy.js'
import 'tippy.js/dist/tippy.css'
import 'tippy.js/dist/backdrop.css'
import 'tippy.js/animations/shift-away.css'
import { computed, onBeforeUnmount, onMounted, ref, useSlots, watchEffect } from 'vue'

const props = defineProps<{
	content?: any
	interactive?: boolean
	placement?: Props['placement']
}>()
const slots = useSlots()

const settings: Partial<Props> = {
	animateFill: true,
	plugins: [animateFill],
	maxWidth: 'none',
	theme: 'glass',
}

const tooltipEl = ref(null as null | HTMLElement)
const contentEl = ref(null as null | HTMLElement)
let tooltip: ReturnType<typeof tippy>[0]

const setProps = () => tooltip.setProps({
	trigger: props.content || slots.content ? 'mouseenter focus' : 'manual',
	popperOptions: { modifiers: [{ name: 'flip', options: { padding: 48 } }] },
	...(props || []),
	content: contentEl.value!,
})

onMounted(async () => {
	const beforeUnmount = new Promise<void>(res => onBeforeUnmount(res))
	tooltip = tippy(tooltipEl.value!, settings)
	watchEffect(setProps)
	await beforeUnmount
	tooltip.destroy()
})

const padding = computed(() => props.content ? 'var(--spacing)' : '0')
</script>



<style>
.tippy-box[data-theme~='glass'] {
	backdrop-filter: blur(16px);
}

.tippy-box[data-theme~='glass'] > .tippy-backdrop {
	background-color: #08080866;
}

.tippy-box[data-theme~='glass'] > .tippy-content {
	padding: 0;
}
</style>