<template>
	<Link class="action" v-bind="props">
		<Icon v-if="icon" :icon="icon" />
		<span class="text">
			<slot></slot>
		</span>
	</Link>
</template>



<script setup lang="ts">
import Icon from '@/components/atomic/Icon.vue'
import Link from '@/components/function/Link.vue'

const props = defineProps<{
	onClick?: any

	// Todo type action
	name?: string
	icon?: Icon
	color?: string
	run?: Function
	to?: import('vue-router').RouteLocationRaw
	disabled?: any
}>()
</script>



<style scoped>
.action {
	font-size: 1.2em;
	display: flex;
	align-items: center;
	cursor: pointer;
	color: inherit;
	text-decoration: none;
	box-shadow: 0 0 0 -8px #ffffff00;
	transition: 0.2s ease;
}

.action:hover {
	background: #00000022;
}

.icon {
	/* height: 1em; */
	font-size: 1.2em;
}

.text {
	padding: 0 var(--spacing);
}
</style>