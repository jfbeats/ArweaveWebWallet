// @ts-ignore
import { v4, validate, version } from 'uuid'
import { colors } from '@/store/Theme'

export function uuidV4 () { return v4() as string }
export function isUuidV4 (uuid: string) { return validate(uuid) && version(uuid) === 4 }

export function debounce <T extends (...args: any[]) => any> (fun: T, options?: { timeout?: number, animationFrame?: true }) {
	let timer: any
	let promises = [] as Function[]
	return ((...args: any[]) => {
		return new Promise<ReturnType<T>>(res => {
			promises.push(res)
			const resolve = () => {
				// @ts-ignore
				const result = fun.apply(this, args)
				promises.forEach(res => res(result))
			}
			if (options?.animationFrame) {
				if (timer) { return }
				timer = requestAnimationFrame(() => { resolve(); timer = undefined })
			} else {
				clearTimeout(timer)
				timer = setTimeout(() => resolve(), options?.timeout ?? 500)
			}
		})
	}) as (...args: Parameters<T>) => Promise<ReturnType<T>>
}

export function humanFileSize (size: string | number) {
	if (size == null) { return '' }
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

function hexToRgb (hex: string) {
	let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
	return result ? [ parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16) ].join(',') : null
}

function rgbToHex (rgb: string) {
	const [r, g, b] = rgb.split(',').map(v => +v)
	return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
}

export function normalizeColorTo (type: 'hex' | 'rgb', color?: string) {
	if (color?.startsWith('var')) { color = colors.value[color.replace('var(--', '').replace(')', '') as keyof typeof colors['value']] }
	if (!color) { return colors.value['red'] }
	if (type === 'rgb' && color.startsWith('#')) { return hexToRgb(color) }
	if (type === 'hex' && color.includes(',')) { return rgbToHex(color) }
	return color
}

export function generateUrl (url: string) {
	if (!url.includes('://')) { url = 'https://' + url }
	return new URL(url).href
}

export function round (number?: number | string) {
	if (number == undefined) { return '' }
	const parsed = typeof number === 'string' ? parseFloat(number) : number
	if (parsed == null || isNaN(parsed)) { return '' }
	const FractionDigits = new Intl.NumberFormat([...navigator.languages], { maximumFractionDigits: 3 }).format(parsed)
	const SignificantDigits = new Intl.NumberFormat([...navigator.languages], { maximumSignificantDigits: 1 }).format(parsed)
	return FractionDigits.length >= SignificantDigits.length ? FractionDigits : SignificantDigits
}

export function compact <T> (arr: (T | undefined | null | void)[]): T[] { return arr.filter(e => e != null) as T[] }