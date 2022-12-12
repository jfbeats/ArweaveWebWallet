<template>
	<Observer class="selector" @mutation="mutation" @resize="mutation" :class="{ horizontal: !props.vertical }">
		<slot />
	</Observer>
</template>



<script setup lang="ts">
import Observer from '@/components/function/Observer.vue'
import { Wallets } from '@/functions/Wallets'
import { computed, ref, watch } from 'vue'
import { debounce } from '@/functions/Utils'
import { awaitEffect } from '@/functions/AsyncData'

const props = defineProps<{
	selector: string
	active: string
	distance?: string
	vertical?: true
	inv?: true
	padding?: true
	color?: string
}>()

const ms = 200
const offset = ref(0)
const length = ref(0)
const weight = ref(2)
const staticActive = ref(true)
const hasActive = ref(false)
const dynamicTransition = ref(!staticActive.value)
const distanceCSS = computed(() => !props.inv ? (props.distance ?? '0') : 'unset')
const distanceInvCSS = computed(() => props.inv ? (props.distance ?? '0') : 'unset')
const scaleCSS = ref(1)
const offsetCSS = computed(() => offset.value + 'px')
const lengthCSS = computed(() => length.value + 'px')
const weigthCSS = computed(() => weight.value + 'px')
const dynamicOpacityCSS = computed(() => staticActive.value ? '0' : (hasActive.value ? '1' : '0'))
const dynamicTransitionCSS = computed(() => dynamicTransition.value ? '0.36s cubic-bezier(.25,.12,0,.99)' : `opacity ${ms}ms ease`)
const backgroundCSS = computed(() => props.color || 'var(--element-secondary)')
const lastIndex = ref(-1)
const upcomingIndex = ref(-1)
const querySelector = (all?: boolean) => {
	const root = document
	const selectElements = props.selector.split(',').map(s => '.selector ' + s.trim())
	const selectActive = props.active.split(',').map(a => selectElements.map(s => s + a.trim())).flat()
	const elements = all ? Array.from(root.querySelectorAll(selectElements.join(', '))) : [] as HTMLElement[]
	const el = root.querySelector(selectActive.join(', ')) as HTMLElement | undefined
	return { el, elements }
}
const isWallet = (n: number) => Wallets.value.length > n
const mutated = (e?: any) => {
	const { el, elements } = querySelector(true)
	const i = elements.findIndex(e => e === el)
	if (!el || i < 0) { hasActive.value = false; staticActive.value = true; return }
	hasActive.value = true
	if (i === upcomingIndex.value) { return }
	upcomingIndex.value = i
	setTimeout(() => lastIndex.value = i)
	if (lastIndex.value < 0 || isWallet(lastIndex.value) !== isWallet(upcomingIndex.value)) { staticActive.value = true }
}
const setPos = () => {
	if (staticActive.value) { return }
	const { el } = querySelector()
	if (!el) { return }
	const padding = parseFloat(getComputedStyle(el)[props.vertical ? 'paddingBlock' : 'paddingInline'])
	offset.value = (props.vertical ? el.offsetTop : el.offsetLeft) + padding
	length.value = (props.vertical ? el.offsetHeight : el.offsetWidth) - padding * 2
}
const mutation = debounce((e?: MutationRecord | ResizeObserverEntry) => {
	mutated()
	setPos()
}, { animationFrame: true })
watch(staticActive, () => {
	dynamicTransition.value = !!staticActive.value
	setPos()
	setTimeout(() => dynamicTransition.value = true, ms)
	if (staticActive.value) { setTimeout(() => awaitEffect(() => hasActive.value).then(() => staticActive.value = false), ms) }
}, { immediate: true })
watch(() => props.vertical, () => staticActive.value = true)
</script>



<style scoped>
.selector {
	position: relative;
}

.selector::before {
	--weight: 2px;
	content: '';
	background: v-bind(backgroundCSS);
	position: absolute;
	top: v-bind(offsetCSS);
	left: v-bind(distanceCSS);
	width: v-bind(weigthCSS);
	height: v-bind(lengthCSS);
	opacity: v-bind(dynamicOpacityCSS);
	border-radius: 1px;
	transform: scale(1, v-bind(scaleCSS));
	transition: v-bind(dynamicTransitionCSS);
	z-index: 1;
}

.selector.horizontal::before {
	transform: scale(v-bind(scaleCSS), 1);
	top: v-bind(distanceCSS);
	bottom: v-bind(distanceInvCSS);
	left: v-bind(offsetCSS);
	width: v-bind(lengthCSS);
	height: v-bind(weigthCSS);
}

[dir="rtl"] .selector::before {
	left: unset;
	right: v-bind(distanceCSS);
}

[dir="rtl"] .selector.horizontal::before {
	left: unset;
	right: v-bind(offsetCSS);
}
</style>
