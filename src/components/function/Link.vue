<template>
	<a v-if="to && isExternal" :href="to" @click="runFunctions" target="_blank"><slot /></a>
	<a v-else-if="to" :href="!$attrs.disabled ? href : null" @click="runFunctions" :class="{ 'router-link-active': isActive, 'router-link-exact-active': isExactActive }"><slot /></a>
	<button v-else-if="run && !$attrs.disabled" @click="runFunctions" type="button"><slot /></button>
	<span v-else><slot /></span>
</template>



<script setup lang="ts">
import { RouterLink, useLink } from 'vue-router'
import { computed } from 'vue'

// console.log(RouterLink.props)
const props = defineProps<{
	// href?: never
	
	// Todo type action
	name?: string
	icon?: import('vue').FunctionalComponent<import('vue').SVGAttributes, {}>
	color?: string
	run?: Function
	to?: import('vue-router').RouteLocationRaw
}>()
const routerParams = computed(() => ({ ...props, to: props.to ?? '' }))
const { navigate, href, route, isActive, isExactActive } = useLink(routerParams.value)

const isExternal = computed(() => { try { new URL(props.to as any); return true } catch (e) {} })
const runFunctions = (e: MouseEvent) => { props.run?.(); navigate(e) }
</script>



<style>
a {
	text-decoration: none;
}
</style>