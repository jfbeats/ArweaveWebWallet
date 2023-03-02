<template>
	<div class="flow">
		<Carousel :options="{ align: 'center', overscroll: true, scrollSnapStop: true }" @index="i => onIndex = i" @elements="el => elements = el" :index="index">
			<slot />
		</Carousel>
		<Pagination :index="onIndex" @index="i => index = i" :elements="elementsLength" :width="contentWidth" @keydown.left="() => nav(-1)" @keydown.right="() => nav(1)" />
	</div>
</template>



<script setup lang="ts">
import Pagination from '@/components/function/Pagination.vue'
import Carousel from '@/components/layout/Carousel.vue'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from '@/router'

const props = defineProps<{ index?: number }>()
const router = useRouter()
const route = useRoute()

const index = ref(0)
const onIndex = ref(0)
const elements = ref([])
const elementsLength = ref(0)
watch(() => props.index, i => i != null && (index.value = i), { immediate: true })
watch(onIndex, () => {
	index.value = onIndex.value
	router.replace({ query: { page: '' + (onIndex.value + 1) } })
})
watch(elements, e => elementsLength.value = e.length, { immediate: true })
const nav = (i: 1 | -1) => (index.value = onIndex.value + i)
const contentWidth = computed(() => {
	const el = (elements.value[onIndex.value] as Element)?.querySelector('.flow-item-content')
	if (!el) { return }
	const width = getComputedStyle(el).width
	return width
})
onMounted(() => {
	const page = Array.isArray(route.query.page) ? route.query.page[0] : route.query.page
	if (page) { onIndex.value = parseInt(page) - 1 }
})

defineExpose({ nav })
</script>



<style scoped>
.flow {

}

.carousel {
	width: 100%;
	flex: 1 1 auto;
}

.carousel > :deep(*:not(.margin)) {
	width: 100%;
	height: 100%;
	display: inline-flex;
	/*justify-content: center;*/
	/*align-items: start;*/
	overflow: auto;
	/* todo may make sense on carousel flex-row instead */
	margin: 0;
}

.carousel-item-content {
	padding: var(--spacing);
	margin: auto;
	min-height: 100%;
	max-width: 100%;
	overflow: hidden;
	justify-content: center;
}
</style>