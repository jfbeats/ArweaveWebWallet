<template>
	<Link class="button no-select" :class="{ disabled, square }" v-bind="props" :style="glowStyle">
		<Icon v-if="icon" :icon="icon" :class="{ margin }" />
		<slot></slot>
	</Link>
</template>



<script setup lang="ts">
import Icon from '@/components/atomic/Icon.vue'
import Link from '@/components/function/Link.vue'
import { computed, useSlots } from 'vue'
import { normalizeColorTo } from '@/functions/Utils'

const props = defineProps<{
	glow?: boolean
	square?: boolean
	
	// Todo type action
	name?: string
	icon?: Icon
	color?: string
	run?: Function
	to?: import('vue-router').RouteLocationRaw
	disabled?: any
}>()
const slots = useSlots()

const borderSize = computed(() => props.glow ? '0' : '0.5px')
const glowStyle = computed(() => props.glow && props.color && ({
	'--border': `rgba(${normalizeColorTo('rgb', props.color)},0.2)`,
	'--glow-color': `rgba(${normalizeColorTo('rgb', props.color)},0.2)`,
	'background-image': `radial-gradient(circle at center, rgba(${normalizeColorTo('rgb', props.color)},0.4),
	rgba(${normalizeColorTo('rgb', props.color)},0.3))`
}))
const margin = computed(() => slots.default)
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
	border: v-bind(borderSize) solid var(--border);
	box-shadow: 0 0 calc(var(--spacing) / 2) 0 var(--glow-color);
	transition: filter 0.3s ease, box-shadow 0.3s ease;
}

.button:hover {
	filter: brightness(1.3);
	box-shadow: 0 0 var(--spacing) 0 var(--glow-color);
}

.button:active {
	filter: brightness(0.7);
	box-shadow: 0 0 var(--spacing) 0 transparent;
	transition: 0s;
}

.button:disabled, .button.disabled {
	filter: grayscale(0.5) brightness(0.5);
}

.button.square {
	flex: 0 0 auto;
	height: 4.5rem;
	font-size: 1.5rem;
	width: 4.5rem;
}

.icon.margin {
	margin-inline-end: 0.5em;
}

a {
	color: inherit;
}
</style>