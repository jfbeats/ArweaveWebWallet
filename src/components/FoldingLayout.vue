<template>
	<div class="folding-layout" :style="{ '--top': scrollPosition }">
		<div class="left" :class="{ hasRight: hasRight() }">
			<slot name="left" />
		</div>
		<div class="right">
			<slot name="right" />
		</div>
	</div>
</template>

<script>
import InterfaceStore from '@/store/InterfaceStore'
import { ref, computed, onUnmounted, onMounted } from 'vue'
export default {
	setup () {
		const verticalContent = computed(() => InterfaceStore.breakpoints.verticalContent)
		const scrollPosition = ref('0')
		const scrollHandler = () => {
			scrollPosition.value = window.scrollY + 'px'
		}
		const positionHandler = (val) => {
			if (val && !verticalContent.value) {
				scrollHandler()
				window.addEventListener('scroll', scrollHandler)
			} else {
				window.removeEventListener('scroll', scrollHandler)
				scrollPosition.value = 0;
			}
		}
		onMounted(() => positionHandler(true))
		onUnmounted(() => positionHandler(false))
		return { scrollPosition, verticalContent }
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

.left.hasRight {
	position: fixed;
	width: 40vw;
	height: 100vh;
	overflow: auto;
	z-index: 1;
}

.verticalContent .left {
	position: relative;
	width: 100%;
	height: auto;
}

.right {
	padding-left: 40vw;
	width: 100%;
}

.verticalContent .right {
	padding-left: 0;
}

.slide-up-enter-active .left,
.slide-down-enter-active .left,
.slide-left-enter-active .left,
.slide-right-enter-active .left,
.slide-up-leave-active .left,
.slide-down-leave-active .left,
.slide-left-leave-active .left,
.slide-right-leave-active .left {
	top: var(--top);
}

.slide-up-leave-from .left,
.slide-left-leave-from .left,
.slide-down-leave-from .left,
.slide-right-leave-from .left {
	top: 0;
}
</style>