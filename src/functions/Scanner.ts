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

