<template>
	<a v-if="hrefExternal" ref="input" :href="hrefExternal" @click.stop="runFunctions" target="_blank"><slot /></a>
	<a v-else-if="to && !attrs.disabled" ref="input" :href="hrefRouter" @click.stop="runFunctions" :class="{ 'router-link-active': isActive, 'router-link-exact-active': isExactActive }"><slot /></a>
	<button v-else-if="runFunctions || attrs.disabled" ref="input" @click.stop="runFunctions" type="button"><slot /></button>
	<span v-else><slot /></span>
</template>



<script setup lang="ts">
import { createAction } from '@/functions/UtilsVue'
import { onMounted, ref, useAttrs } from 'vue'

const props = defineProps<{
	onClick?: (e?: MouseEvent) => any
	href?: ''
	
	// Todo type action
	name?: string
	icon?: Icon
	color?: string
	run?: Function | false | null
	to?: import('vue-router').RouteLocationRaw
}>()
const attrs = useAttrs()
const input = ref(undefined as undefined | HTMLInputElement)

const { hrefExternal, hrefRouter, isActive, isExactActive, runFunctions} = createAction(props, true)

onMounted(() => {
	// always autofocus
	if ('autofocus' in attrs && attrs.autofocus !== undefined) { setTimeout(() => input.value?.focus()) }
})
</script>



<style>
a {
	text-decoration: none;
}
</style>