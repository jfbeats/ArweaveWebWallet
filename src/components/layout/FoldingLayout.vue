<template>
	<div class="folding-layout">
		<div class="left no-scrollbar" :class="{ hasRight: hasRight() }">
			<TransitionsManager :vector="leftVector" :axis="leftAxis || (verticalLayout ? 'x' : 'y')" :appear="true">
				<slot name="left" />
			</TransitionsManager>
		</div>
		<div class="right">
			<TransitionsManager :vector="rightVector" :axis="rightAxis || (verticalLayout ? 'x' : 'y')">
				<slot name="right" />
			</TransitionsManager>
		</div>
	</div>
</template>



<script setup lang="ts">
import InterfaceStore from '@/store/InterfaceStore'
import TransitionsManager from '@/components/visual/TransitionsManager.vue'
import { useSlots, toRef } from 'vue'

const props = defineProps<{
	leftVector?: number
	rightVector?: number
	leftAxis?: 'x' | 'y'
	rightAxis?: 'x' | 'y'
}>()
const slots = useSlots()

const verticalLayout = toRef(InterfaceStore.breakpoints, 'verticalLayout')
const hasLeft = () => !!slots.left
const hasRight = () => !!slots.right
</script>



<style scoped>
.folding-layout {
	width: 100%;
	position: relative;
	display: flex;
}

.verticalContent .folding-layout {
	flex-direction: column;
}

.left {
	overflow: auto;
	height: var(--current-vh);
	min-width: 40vw;
	position: sticky;
	top: 0;
}

.left.hasRight {
	min-width: 0;
	width: 40vw;
	z-index: 1;
}

.verticalContent .left {
	position: relative;
	width: 100%;
	height: auto;
}

.right {
	width: 100%;
	min-width: 0;
	flex: 1 1 0;
}

.verticalContent .right {
	padding-inline-start: 0;
}
</style>