<template>
	<router-link :to="to" custom v-slot="{ href, navigate }">
		<component :is="tag" :href="to && !$attrs.disabled ? href : null" @click="(...params) => to && navigate(...params)" v-bind="{ ...getScopeAttrs(), ...$attrs }" :class="class" :style="style" :type="tag === 'button' ? 'button' : $attrs.type">
			<slot />
		</component>
	</router-link>
</template>



<script setup lang="ts">
import { computed, HTMLAttributes, StyleValue, useAttrs } from 'vue'
import { RouteLocationRaw } from 'vue-router'

const props = defineProps<{
	to: RouteLocationRaw
	class: HTMLAttributes['class']
	style: StyleValue
}>()
const attrs = useAttrs()

const tag = computed(() => {
	if (!props.to && attrs.onClick) { return 'button' }
	if (attrs.disabled) { return 'span' }
	return 'a'
})
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