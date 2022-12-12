<template>
	<div class="scanner">
		<Icon :icon="IconQR" class="background" />
		<video ref="video" class="video" :class="{ isPlaying }"></video>
		<div class="actions-row-container">
			<ActionsRow :actions="actions" :class="{ isPlaying }" />
		</div>
	</div>
</template>



<script setup lang="ts">
import ActionsRow from '@/components/atomic/ActionsRow.vue'
import { useChannel } from '@/functions/Channels'
import { postMessageExtension } from '@/functions/Connect'
import { notify } from '@/store/NotificationStore'
import { awaitEffect } from '@/functions/AsyncData'
import { emitter } from '@/functions/Scanner'
import QrScanner from 'qr-scanner'
import { onUnmounted, onMounted, ref, inject } from 'vue'

import IconQR from '@/assets/icons/qr.svg?component'
import IconSwap from '@/assets/icons/swap.svg?component'
import IconX from '@/assets/icons/x.svg?component'
import Icon from '@/components/atomic/Icon.vue'

const parentTransitionState = inject('transitionState', null as any)

const video = ref(null as null | HTMLVideoElement)
const isPlaying = ref(false)
const scannerCamera = useChannel('scannerCamera').state
let cameras: QrScanner.Camera[]
let qrScanner: QrScanner
const actions: Action[] = [
	{ icon: IconSwap, run: () => switchCamera() },
	{ icon: IconX, run: () => emitter.emit('event', undefined) }
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
	video.value.addEventListener('play', () => isPlaying.value = true)
	video.value.addEventListener('pause', () => isPlaying.value = false)
	cameras = await QrScanner.listCameras(true)
	qrScanner = new QrScanner(video.value, result => emitter.emit('event', result))
	if (scannerCamera.value != null) { qrScanner.setCamera(scannerCamera.value) }
	qrScanner.start().catch(() => {
		postMessageExtension('permissions')
		emitter.emit('event', undefined)
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
	background: var(--background);
}

.background {
	position: absolute;
	height: 80%;
	width: 100%;
	/*z-index: 10;*/
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	display: flex;
	justify-content: center;
	align-items: center;
	opacity: 0.1;
}

.video {
	width: 100%;
	height: 100%;
	object-fit: cover;
	opacity: 0;
	transition: opacity 0.4s ease;
}

.video.isPlaying {
	opacity: 1;
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
	background: #11111166;
	border-top-left-radius: var(--border-radius);
	border-top-right-radius: var(--border-radius);
	border: 1px solid #ffffff22;
	border-bottom: none;
}

.actions-row.isPlaying {
	backdrop-filter: blur(10px);
}
</style>