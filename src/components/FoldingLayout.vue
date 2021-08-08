<template>
	<div class="folding-layout">
		<div v-if="verticalContent" class="left" :class="{ hasRight: hasRight() }">
			<slot name="left" />
		</div>
		<teleport to="#viewport" v-else>
			<div class="left" :class="{ hasRight: hasRight() }">
				<transition :name="$route.meta.transition?.nameLayout" appear>
					<slot name="left" />
				</transition>
			</div>
		</teleport>
		<div class="right">
			<slot name="right" />
		</div>
	</div>
</template>

<script>
import InterfaceStore from '@/store/InterfaceStore'
import { computed } from 'vue'
export default {
	setup () {
		const verticalContent = computed(() => InterfaceStore.breakpoints.verticalContent)
		return { verticalContent }
	},
	methods: {
		hasLeft () { return !!this.$slots.left },
		hasRight () { return !!this.$slots.right },
	},
}
</script>

<style scoped>
.folding-layout {
	width: 100%;
	position: relative;
}

.left {
	scrollbar-width: none;
	overflow: auto;
	height: 100vh;
}

.left::-webkit-scrollbar {
	display: none;
}

.left.hasRight {
	max-width: 40vw;
	z-index: 1;
}

.verticalContent .left {
	position: relative;
	width: 100%;
	height: auto;
}

.right {
	padding-inline-start: 40vw;
	width: 100%;
}

.verticalContent .right {
	padding-inline-start: 0;
}
</style>