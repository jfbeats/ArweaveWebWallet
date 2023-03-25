<template>
	<div class="qr" style="overflow: hidden; position: relative;">
		<div ref="canvas" class="qr-container" />
		<div v-if="hasLogo" class="logo" style="filter:url(#blob2);">
			<Icon :icon="LOGO.arweaveOutline" />
		</div>
	</div>
</template>



<script setup lang="ts">
import QRCodeStyling from 'qr-code-styling'
import { computed, onBeforeUnmount, onMounted, ref, watchEffect } from 'vue'
import { LOGO } from '@/store/Theme'
import Icon from '@/components/atomic/Icon.vue'

const props = defineProps<{ qr?: string }>()

const light = '#eeeeee'
const dark = '#000000'
const canvas = ref(undefined as undefined | HTMLElement)
const correctionLevel = ref(undefined as undefined | string)
const modules = ref(0)
const offsetScale = ref(1)
const offsetScaleCSS = computed(() => `scale(${offsetScale.value})`)
const maxSizes = ref([] as number[])
const maxSize = computed(() => `100%`)
const genSize = 20000
const moduleSize = 4
const logoSize = computed(() => modules.value * 0.541 * moduleSize)
const logoSizeCSS = computed(() => logoSize.value + 'px')
const hasLogo = computed(() => false) // logoSize.value > 80
// const logoOutlineCSS = Array(10).fill(`drop-shadow(0 0 0.5px ${light})`).join(' ')
const minSize = computed(() => modules.value * moduleSize + 'px')
const padding = computed(() => moduleSize * 4 + 'px')
const qrCode = new QRCodeStyling()
onMounted(async () => {
	const beforeUnmount = new Promise<void>(res => onBeforeUnmount(res))
	if (!canvas.value) { return }
	qrCode.append(canvas.value)
	const parents = [canvas.value.parentElement?.parentElement?.parentElement]
	for (let i = 0; parents[i] !== document.body; i++) { parents.push(parents[i]?.parentElement) }
	const observer = new ResizeObserver(entries => entries.forEach(e => {
		const i = parents.indexOf(e.target as HTMLElement)
		if (i < 0 || e.contentRect.width < 100 || e.contentRect.height < 100) { return }
		// maxSizes.value[i] = Math.min(e.contentRect.width, e.contentRect.height)
	}))
	setTimeout(() => parents.forEach(parent => parent && observer.observe(parent)))
	await beforeUnmount
	observer.disconnect()
})
watchEffect(() => {
	if (!canvas.value) { return }
	correctionLevel.value = (['M', 'L'] as const).find(errorCorrectionLevel => { try {
		qrCode.update({
			type: 'svg',
			width: genSize,
			height: genSize,
			data: props.qr,
			qrOptions: {
				mode: 'Byte',
				errorCorrectionLevel
			},
			dotsOptions: {
				type: (props.qr?.length ?? 0) > 200 ? 'square' : 'rounded',
				color: dark
			},
			backgroundOptions: {
				color: light
			},
			cornersSquareOptions: {
				type: (props.qr?.length ?? 0) > 200 ? 'square' : 'extra-rounded',
				color: dark
			},
			cornersDotOptions: {
				color: dark
			},
		})
		return true
	} catch (e) { if (errorCorrectionLevel === 'L') { throw e } } })
	qrCode._svg?.setAttribute('viewBox', `0 0 ${genSize} ${genSize}`)
	modules.value = qrCode._qr?.getModuleCount() ?? 0
	offsetScale.value = genSize / (genSize - getOffset() * 2)
})
function getOffset () {
	const elements = Array.from(canvas.value?.querySelectorAll(`rect[clip-path="url('#clip-path-corners-square-color-0-0')"]`) ?? [])
	return Math.min(...elements.map(el => +(el.getAttribute('x') ?? 0)))
}
</script>



<style scoped>
.qr {
	display: flex;
	background: v-bind(light);
	color: v-bind(dark);
	width: max-content;
	max-width: v-bind(maxSize);
	max-height: v-bind(maxSize);
}

.qr-container {
	box-sizing: content-box;
	width: v-bind(minSize);
	padding: v-bind(padding);
	transform: v-bind(offsetScaleCSS);
}

.qr :deep(svg) {
	display: flex;
	width: 100%;
	height: 100%;
}

.qr :deep(#clip-path-dot-color > *) {

}

.logo {
	position: absolute;
	color: black;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
}

.logo > * {
	width: v-bind(logoSizeCSS);
	height: v-bind(logoSizeCSS);
}

.logo > * > :deep(*) {
	stroke: v-bind(dark);
	stroke-width: 20px;
	overflow: visible;
}
</style>