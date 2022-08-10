<template>
	<Link class="button no-select" :class="{ disabled: $attrs.disabled }" v-bind="props" :run="runFunction" :style="glowStyle">
		<Icon v-if="icon" :icon="icon" />
		<slot></slot>
	</Link>
</template>



<script setup lang="ts">
import Icon from '@/components/atomic/Icon.vue'
import Link from '@/components/function/Link.vue'
import { computed } from 'vue'
import { normalizeColorTo } from '@/functions/Utils'

const props = defineProps<{
	onClick?: (e?: MouseEvent) => any
	glow?: boolean // todo
	
	// Todo type action
	name?: string
	icon?: import('vue').FunctionalComponent<import('vue').SVGAttributes, {}>
	color?: string
	run?: Function
	to?: import('vue-router').RouteLocationRaw
}>()

const runFunction = computed(() => {
	if (!props.onClick && !props.run) { return }
	return () => { props.onClick?.(); props.run?.() }
})

const borderSize = computed(() => props.glow ? '0' : '0.5px')
const glowStyle = computed(() => props.glow && props.color && ({
	'--border': `rgba(${normalizeColorTo('rgb', props.color)},0.2)`,
	'--glow-color': `rgba(${normalizeColorTo('rgb', props.color)},0.2)`,
	'background-image': `radial-gradient(circle at center, rgba(${normalizeColorTo('rgb', props.color)},0.4),
	rgba(${normalizeColorTo('rgb', props.color)},0.3))`
}))
</script>



<style scoped>
.button {
	height: 3.5em;
	padding: 0 var(--spacing);
	border-radius: var(--border-radius);
	background: #ffffff06;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 0 calc(var(--spacing) / 2) 0 var(--glow-color);
	transition: 0.3s ease;
	border: v-bind(borderSize) solid var(--border);
}

.button:hover {
	box-shadow: 0 0 var(--spacing) 0 var(--glow-color);
	filter: brightness(1.3);
}

.button:active {
	filter: brightness(0.7);
	box-shadow: 0 0 var(--spacing) 0 transparent;
	transition: 0s;
}

.button:disabled, .button.disabled {
	filter: grayscale(0.5) brightness(0.5);
}

.icon {
	margin-inline-end: 0.5em;
}
</style>