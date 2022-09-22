<template>
	<Observer @resize="resize" class="img" :class="{ x, y }">
		<div class="frame-scroller">
			<img ref="imgRef" :src="src" @load="load" @error="emit('error')" />
		</div>
	</Observer>
</template>



<script setup lang="ts">
import Observer from '@/components/function/Observer.vue'
import { ref, computed } from 'vue'

const props = defineProps(['src'])
const emit = defineEmits(['load', 'error'])

const imgRef = ref(null as null | HTMLImageElement)
const elAspect = ref(null as null | number)
const imgAspect = ref(null as null | number)

const resize = (size: ResizeObserverEntry) => elAspect.value = size.contentRect.width / size.contentRect.height

const load = () => {
	imgAspect.value = imgRef.value && imgRef.value.naturalWidth / imgRef.value.naturalHeight
	emit('load')
}

const x = computed(() => elAspect.value && imgAspect.value && elAspect.value < imgAspect.value)
const y = computed(() => elAspect.value && imgAspect.value && elAspect.value >= imgAspect.value)

// Todo snap to center
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