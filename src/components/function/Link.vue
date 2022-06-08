<template>
	<a v-if="to && isExternal" :href="to" target="_blank" v-bind="{ ...getScopeAttrs(), ...$attrs }" :class="props.class" :style="style"><slot /></a>
	<router-link v-else-if="to" :to="to" custom v-slot="{ href, navigate }">
		<a :href="to && !$attrs.disabled ? href : null" @click="(...params) => to && navigate(...params)" v-bind="{ ...getScopeAttrs(), ...$attrs }" :class="props.class" :style="style">
			<slot />
		</a>
	</router-link>
	<button v-else-if="$attrs.onClick && !$attrs.disabled" type="button" v-bind="{ ...getScopeAttrs(), ...$attrs }" :class="props.class" :style="style"><slot /></button>
	<span v-else v-bind="{ ...getScopeAttrs(), ...$attrs }" :class="props.class" :style="style"><slot /></span>
</template>



<script setup lang="ts">
import { computed, HTMLAttributes, StyleValue } from 'vue'
import { RouteLocationRaw } from 'vue-router'

const props = defineProps<{
	to?: RouteLocationRaw
	class?: HTMLAttributes['class']
	style?: StyleValue
}>()

const isExternal = computed(() => { try { new URL(props.to as any); return true } catch (e) {} })
</script>



<script lang="ts">
export default {
	inheritAttrs: false,
	methods: {
		getScopeAttrs () {
			const scopeAttr = (this as any).$parent.$options.__scopeId
			return scopeAttr ? { [scopeAttr]: '' } : {}
		}
	}
}
</script>



<style>
a {
	text-decoration: none;
}
</style>