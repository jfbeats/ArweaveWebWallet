<template>
	<router-link :to="to" custom v-slot="{ href, navigate }">
		<component :is="tag" :href="to && !$attrs.disabled ? href : null" @click="(...attrs) => to && navigate(...attrs)" v-bind="{ ...getScopeAttrs(), ...$attrs }" :class="class" :style="style" :type="tag === 'button' ? 'button' : $attrs.type">
			<slot />
		</component>
	</router-link>
</template>



<script>
import { computed } from 'vue'

export default {
	inheritAttrs: false,
	props: ['to', 'class', 'style'],
	setup (props, { attrs }) {
		const tag = computed(() => {
			if (!props.to && attrs.onClick) { return 'button' }
			if (attrs.disabled) { return 'span' }
			return 'a'
		})

		return { tag }
	},
	methods: {
		getScopeAttrs () {
			const scopeAttr = this.$parent.$options.__scopeId
			return scopeAttr ? { [scopeAttr]: '' } : {}
		}
	}
}
</script>