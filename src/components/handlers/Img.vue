<template>
	<Observer observe="resize" @resize="resize" class="img"  :class="{ x, y }">
		<div class="frame-scroller">
			<img ref="imgRef" :src="src" @load="load" />
		</div>
	</Observer>
</template>



<script>
import Observer from '@/components/function/Observer.vue'
import { ref, computed } from 'vue'

export default {
	components: { Observer },
	props: ['src'],
	setup (props, { emit }) {
		const imgRef = ref(null)
		const elAspect = ref(null)
		const imgAspect = ref(null)

		const resize = (size) => {
			console.log(size)
			elAspect.value = size.width / size.height
		}

		const load = () => {
			imgAspect.value = imgRef.value.naturalWidth / imgRef.value.naturalHeight
			emit('load')
		}

		const x = computed(() => elAspect.value && imgAspect.value 
			&& elAspect.value < imgAspect.value)
		const y = computed(() => elAspect.value && imgAspect.value 
			&& elAspect.value >= imgAspect.value)
		
		// Todo snap to center

		return { x, y, resize, load, imgRef }
	},
}
</script>



<style scoped>
.img {
	width: 100%;
	min-width: 0;
	flex: 1 1 0;
	height: var(--current-vh);
}

.verticalContent .img {
	height: auto;
	width: 100%;
}

.verticalContent img {
	height: auto;
	width: 100%;
}

img {
	flex: 1 1 0;
	display: block;
	object-fit: cover;
}

.frame-scroller {
	display: flex;
	width: 100%;
	height: 100%;
}

.img.x .frame-scroller {
	overflow-x: auto;
	flex-direction: row;
}

.img.x img {
	height: 100%;
}

.img.y .frame-scroller {
	overflow-y: auto;
	flex-direction: column;
}

.img.y img {
	width: 100%;
}
</style>