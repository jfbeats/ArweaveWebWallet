<template>
	<teleport to="#viewport">
		<TransitionsManager appear>
			<div class="scanner">
				<video ref="video" class="video"></video>
				<ActionsRow :actions="actions" />
			</div>
		</TransitionsManager>
	</teleport>
</template>



<script setup lang="ts">
import ActionsRow from '@/components/atomic/ActionsRow.vue'
import QrScanner from 'qr-scanner'
import { onBeforeUnmount, onMounted, ref } from 'vue'

import IconSwap from '@/assets/icons/swap.svg?component'
import IconX from '@/assets/icons/x.svg?component'
import TransitionsManager from '@/components/visual/TransitionsManager.vue'
import { useChannel } from '@/functions/Channels'

const emit = defineEmits<{
	(e: 'result', value?: string): void
}>()

const video = ref(null as null | HTMLVideoElement)
const scannerCamera = useChannel('scannerCamera').state
let cameras: QrScanner.Camera[]
let qrScanner: QrScanner
const actions: Action[] = [
	{ icon: IconSwap, run: () => switchCamera() },
	{ icon: IconX, run: () => emit('result', undefined) }
]

const startScanner = async () => {
	if (!video.value) { return console.error('failed to start scanner') }
	cameras = await QrScanner.listCameras()
	qrScanner = new QrScanner(video.value, result => emit('result', result))
	if (scannerCamera.value != null) { qrScanner.setCamera(scannerCamera.value) }
	qrScanner.start()
}
const stopScanner = () => { qrScanner?.destroy() }

const switchCamera = async () => {
	const nextId = (cameras.findIndex(c => c.id === scannerCamera.value) + 1) % cameras.length
	scannerCamera.value = cameras[nextId].id
	qrScanner.setCamera(scannerCamera.value)
	console.log(cameras, nextId)
}

onMounted(startScanner)
onBeforeUnmount(stopScanner)
</script>



<style scoped>
.scanner {
	position: fixed;
	inset: 0;
	overflow: hidden;
	border-radius: var(--border-radius);
	display: flex;
	background: #000;
}

.video {
	width: 100%;
}

.actions-row {
	position: absolute;
	z-index: 10;
	bottom: 0;
	right: 0;
	font-size: 2em;
	padding: var(--spacing);
	background: #00000066;
	border-top-left-radius: var(--border-radius);
}
</style>