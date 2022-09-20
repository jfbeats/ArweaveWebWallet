<template>
	<div ref="canvas" class="qr" />
</template>



<script setup lang="ts">
import QRCodeStyling from 'qr-code-styling'
import { onMounted, ref, watchEffect } from 'vue'

const props = defineProps<{ qr?: string }>()

const canvas = ref(undefined as undefined | HTMLElement)
const qrCode = new QRCodeStyling()
onMounted(() => canvas.value && qrCode.append(canvas.value))
watchEffect(() => {
	if (!canvas.value) { return }
	qrCode.update({
		type: 'svg',
		width: 150,
		height: 150,
		margin: 8,
		data: props.qr,
		qrOptions: {
			mode: 'Byte',
			errorCorrectionLevel: 'Q'
		},
		dotsOptions: {
			type: 'rounded',
			color: '#000000'
		},
		backgroundOptions: {
			color: '#eeeeee'
		},
		cornersSquareOptions: {
			type: 'extra-rounded',
			color: '#000000'
		},
		cornersDotOptions: {
			color: '#000000'
		},
	})
})
</script>



<style scoped>
.qr {
	display: flex;
}
</style>