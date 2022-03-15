// @ts-ignore
import { v4 } from 'uuid'

export function uuidV4 () { return v4() as string }

export function debounce (fun: Function, timeout = 500) {
	let timer: ReturnType<typeof setTimeout>
	return (...args: any[]) => {
		clearTimeout(timer)
		timer = setTimeout(() => { // @ts-ignore
			fun.apply(this, args) }, timeout)
	}
}

export function humanFileSize (size: string | number) {
	if (size == 0) { return '0 B' }
	const i = Math.floor(Math.log(+size) / Math.log(1024))
	return +(+size / Math.pow(1024, i)).toFixed(2) + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i]
}

export async function addressToHash (address?: string) {
	if (!address) { return }
	const hashBuffer = await window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(address))
	const hashArray = Array.from(new Uint8Array(hashBuffer))
	const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
	return hashHex
}

export function addressHashToColor (addressHash?: string) {
	if (!addressHash) { return [0, 0, 0] }
	const colors = hsl2rgb(parseInt(addressHash.substr(-7), 16) / 0xfffffff, 0.25, 0.6)
	return colors.map(Math.round)
}

function hsl2rgb (h: number, s: number, b: number) {
	h *= 6
	const s2 = [b += s *= b < .5 ? b : 1 - b, b - h % 1 * s * 2, b -= s *= 2, b, b + h % 1 * s, b + s]
	return [s2[~~h % 6] * 255, s2[(h | 16) % 6] * 255, s2[(h | 8) % 6] * 255]
}

export function download (filename: string, text: string, contentType = 'application/json') {
	const element = document.createElement('a')
	element.setAttribute('href', `data:${contentType};charset=utf-8,${encodeURIComponent(text)}`)
	element.setAttribute('download', filename)
	element.style.display = 'none'
	document.body.appendChild(element)
	element.click()
	document.body.removeChild(element)
}

export function generateUrl (url: string) {
	if (!url.includes('://')) { url = 'https://' + url }
	return new URL(url).href
}