<template>
	<div class="folding-layout" :class="{ verticalContent }">
		<div v-show="showLeft" class="left" :class="{ hasRight: hasRight() }" :style="{ top: scrollPosition }">
			<slot name="left" />
		</div>
		<div class="right">
			<slot name="right" />
		</div>
	</div>
</template>

<script>
import InterfaceStore, { emitter } from '@/store/InterfaceStore'
import { ref, computed } from 'vue'
export default {
	setup () {
		const scrollPosition = ref('0')
		const showLeft = ref(true)
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
		const verticalContent = computed(() => InterfaceStore.breakpoints.verticalContent)
		emitter.once('beforeEnter', () => {
			positionHandler(true)
			emitter.once('afterEnter', () => {
				positionHandler(false)
				emitter.once('beforeLeave', () => {
					positionHandler(true)
					emitter.once('afterLeave', () => {
						positionHandler(false)
					})
				})
			})
		})
		return { scrollPosition, verticalContent, showLeft }
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
</style>