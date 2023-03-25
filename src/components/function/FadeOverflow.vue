<template>
	<Observer ref="ObserverRef" class="container" @resize="scrollDebounced">
		<Observer class="content" @mutation="scrollDebounced" @resize="scrollDebounced">
			<slot />
		</Observer>
		<transition-group name="fade-fast">
			<div class="overflow" v-for="shadow in boxShadow" :key="shadow" :style="{ boxShadow: shadow }" />
		</transition-group>
	</Observer>
</template>



<script setup lang="ts">
import { debounce } from '@/functions/Utils'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import Observer from '@/components/function/Observer.vue'
import { normalizeColorTo } from '@/store/Theme'

const props = defineProps<{ color?: string }>()

const ObserverRef = ref(undefined as undefined | InstanceType<typeof Observer>)
const container = computed(() => ObserverRef.value?.el)
const content = computed(() => container.value?.firstElementChild)
const defaultColor = ref('')
const sides = ref('')
const color = computed(() => props.color && normalizeColorTo('rgb', props.color) || defaultColor.value)

const boxShadow = computed(() => {
	if (!color.value || !sides.value) { return [] }
	const offset = 18
	const spread = 8
	const result = sides.value.split(' ').map(side => {
		if (side === 'top') { return `inset 0 ${offset}px ${spread}px -${spread}px ${color.value}` }
		if (side === 'bottom') { return `inset 0 -${offset}px ${spread}px -${spread}px ${color.value}` }
		if (side === 'left') { return `inset -${offset}px 0 ${spread}px -${spread}px ${color.value}` }
		if (side === 'right') { return `inset ${offset}px 0 ${spread}px -${spread}px ${color.value}` }
	})
	return result
})

onMounted(() => { content.value?.addEventListener('scroll', scrollDebounced); scrollDebounced(); defaultColor.value = getDefaultColor() })
onBeforeUnmount(() => content.value?.removeEventListener('scroll', scrollDebounced))

const scrollDebounced = debounce(scroll, { animationFrame: true })
function scroll () {
	if (!content.value) { return }
	const currentSides = []
	if (content.value.scrollHeight > content.value.clientHeight) {
		if (content.value.scrollTop > 0) { currentSides.push('top') }
		if (content.value.scrollTop < content.value.scrollHeight - content.value.clientHeight - 1) { currentSides.push('bottom') }
	}
	if (content.value.scrollWidth > content.value.clientWidth) {
		if (content.value.scrollLeft > 0) { currentSides.push('left') }
		if (content.value.scrollLeft < content.value.scrollWidth - content.value.clientWidth - 1) { currentSides.push('right') }
	}
	const current = currentSides.join(' ')
	if (sides.value !== current) { sides.value = current }
}

function getDefaultColor () {
	const noBackground = ['rgba(0, 0, 0, 0)', '#00000000', 'transparent', undefined, null]
	const crawl = (el: HTMLElement): string | null => {
		const background = getComputedStyle(el).backgroundColor
		if (noBackground.includes(background)) { return el.parentElement && crawl(el.parentElement) }
		return background
	}
	return container.value?.parentElement && crawl(container.value?.parentElement) || ''
}
</script>



<style>
.container {
	position: relative;
}

.content {
	/*position: absolute;*/
	inset: 0;
	width: 100%;
	height: 100%;
	/*padding: inherit;*/
	overflow: auto;
}

.overflow {
	position: absolute;
	inset: 0;
	width: 100%;
	height: 100%;
	z-index: 1;
	pointer-events: none;
	touch-action: none;
}
</style>