import { computedAsync } from '@/functions/AsyncData'
import QrScanner from 'qr-scanner'
import { ref } from 'vue'
import { Emitter } from '@/functions/UtilsClass'

export const emitter = new Emitter<{ event: undefined | string }>()

export const hasCamera = computedAsync(async () => {
	try { return !!(await QrScanner.listCameras(false)).length }
	catch (e) { return false }
})

export const scanning = ref(false)
const maxScansPerSecond = 2
const fullScansPerSecond = 4
const fullScanRate = 1 / fullScansPerSecond * 1000
let state: ReturnType<typeof init> | undefined
let timer: any
function init () { return {
	alsoTryWithoutScanRegion: true,
	qrEngine: QrScanner.createQrEngine(),
	canvas: document.createElement('canvas'),
} }
function getState () {
	clearTimeout(timer)
	timer = setTimeout(() => {
		state?.qrEngine.then(qrEngine => {
			if (!(qrEngine instanceof Worker)) { return }
			qrEngine.postMessage({ type: 'close' })
		})
		state = undefined
	}, fullScanRate * 100)
	return state ??= init()
}

export function getScanner (video: HTMLVideoElement) {
	video.addEventListener('play', () => {
		;(video.srcObject as MediaStream)!.getVideoTracks()[0].applyConstraints({
			width: { ideal: 5000 },
			height: { ideal: 5000 },
		})
	})
	const calculateScanRegion = (video: HTMLVideoElement) => {
		const smallestDimension = Math.min(video.videoWidth, video.videoHeight);
		const scanRegionSize = Math.round(2 / 3 * smallestDimension);
		return {
			x: Math.round((video.videoWidth - scanRegionSize) / 2),
			y: Math.round((video.videoHeight - scanRegionSize) / 2),
			width: scanRegionSize,
			height: scanRegionSize,
			downScaledWidth: scanRegionSize,
			downScaledHeight: scanRegionSize,
		}
	}
	const qrScanner = new QrScanner(video, result => result.data && emitter.emit('event', result.data), {
		maxScansPerSecond,
		calculateScanRegion,
	})
	qrScanner.setInversionMode('both')
	const fullScan = async () => {
		const process = (res: Awaited<ReturnType<typeof scanImages>>) => {
			if (!res[0]?.data) { return }
			emitter.emit('event', res[0].data)
		}
		await scanImages([video]).then(process).catch(() => {})
	}
	let isInit = false
	let fullScanLoop = (async () => {
		if (!fullScanLoop) { return }
		while (fullScanLoop && !video.videoWidth) { await new Promise(res => setTimeout(res, fullScanRate)) }
		if (!isInit) { isInit = true; await new Promise(res => setTimeout(res, 2000)) }
		const promise = new Promise(res => setTimeout(res, fullScanRate))
		await fullScan().catch(() => {})
		await promise.catch(() => {})
		fullScanLoop?.()
	}) as any
	fullScanLoop?.()
	const destructor = () => {
		fullScanLoop = undefined
		qrScanner.destroy()
	}
	return { qrScanner, destructor }
}

export async function scan () {
	return new Promise<string>((res, rej) => {
		if (scanning.value) { throw 'Scanner already in use' }
		scanning.value = true
		emitter.once('event', event => {
			event != undefined ? res(event) : rej('Scan failed')
			scanning.value = false
		})
	})
}

export async function scanImages (images: Parameters<typeof QrScanner['scanImage']>[0][]) {
	const res = Promise.all(images.map(image => QrScanner.scanImage(image, { ...getState() })))
	return res
}