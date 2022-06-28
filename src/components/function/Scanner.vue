<template>
	<div class="scanner">
		<video ref="video" class="video"></video>
		<div class="actions-row-container">
			<ActionsRow :actions="actions" />
		</div>
	</div>
</template>



<script lang="ts">
import { computedAsync } from '@/functions/AsyncData'
import QrScanner from 'qr-scanner'

const hasCamera = computedAsync(async () => {
	try { return !!(await QrScanner.listCameras(false)).length }
	catch (e) { return false }
})

export default { hasCamera }
</script>



<script setup lang="ts">
import ActionsRow from '@/components/atomic/ActionsRow.vue'
import { useChannel } from '@/functions/Channels'
import { postMessageExtension } from '@/functions/Connect'
import { notify } from '@/store/NotificationStore'
import { awaitEffect } from '@/functions/AsyncData'
import { onUnmounted, onMounted, ref, inject } from 'vue'

import IconSwap from '@/assets/icons/swap.svg?component'
import IconX from '@/assets/icons/x.svg?component'

const emit = defineEmits<{
	(e: 'result', value?: string): void
}>()
const parentTransitionState = inject('transitionState', null as any)

const video = ref(null as null | HTMLVideoElement)
const scannerCamera = useChannel('scannerCamera').state
let cameras: QrScanner.Camera[]
let qrScanner: QrScanner
const actions: Action[] = [
	{ icon: IconSwap, run: () => switchCamera() },
	{ icon: IconX, run: () => emit('result', undefined) }
]

const switchCamera = async () => {
	cameras = await QrScanner.listCameras(true)
	const nextId = (cameras.findIndex(c => c.id === scannerCamera.value) + 1) % cameras.length
	scannerCamera.value = cameras[nextId].id
	qrScanner.setCamera(scannerCamera.value)
	console.log(cameras, nextId)
}

onMounted(async () => {
	const unmount = new Promise<void>(res => onUnmounted(res))
	if (!video.value) { return console.error('failed to start scanner') }
	cameras = await QrScanner.listCameras(true)
	qrScanner = new QrScanner(video.value, result => emit('result', result))
	if (scannerCamera.value != null) { qrScanner.setCamera(scannerCamera.value) }
	qrScanner.start().catch(() => {
		postMessageExtension('permissions')
		emit('result', undefined)
		notify.error('Unable to access camera')
	})
	await unmount
	await awaitEffect(() => !parentTransitionState?.leave)
	qrScanner.destroy()
})
</script>



<style scoped>
.scanner {
	overflow: hidden;
	display: flex;
	background: #000;
}

.video {
	width: 100%;
	height: 100%;
	object-fit: cover;
}

.actions-row-container {
	position: absolute;
	z-index: 10;
	bottom: 0;
	left: 0;
	right: 0;
	display: flex;
	justify-content: center;
}

.actions-row {
	font-size: 2em;
	padding: var(--spacing);
	padding-top: 0;
	background: #00000066;
	backdrop-filter: blur(10px);
	border-top-left-radius: var(--border-radius);
	border-top-right-radius: var(--border-radius);
	border: 1px solid #ffffff22;
}
</style>