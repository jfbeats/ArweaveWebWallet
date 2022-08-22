<template>
	<a v-if="hrefExternal" :href="hrefExternal" @click.capture="runFunctions" target="_blank"><slot /></a>
	<a v-else-if="to && !disabled" :href="hrefRouter" @click.capture="runFunctions" :class="{ 'router-link-active': isActive, 'router-link-exact-active': isExactActive }"><slot /></a>
	<button v-else-if="runFunctions" @click.capture="runFunctions" type="button"><slot /></button>
	<span v-else><slot /></span>
</template>



<script setup lang="ts">
import { createAction } from '@/functions/UtilsVue'

const props = defineProps<{
	onClick?: (e?: MouseEvent) => any
	href?: ''
	
	// Todo type action
	name?: string
	icon?: Icon
	color?: string
	run?: Function
	to?: import('vue-router').RouteLocationRaw
	disabled?: any
}>()

const { hrefExternal, hrefRouter, isActive, isExactActive, runFunctions} = createAction(props, true)
</script>



<style>
a {
	text-decoration: none;
}
</style>