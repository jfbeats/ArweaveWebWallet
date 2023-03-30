// @ts-ignore
import { v4, validate, version } from 'uuid'
// Used by build.ts, no imports

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
				const timing = (options && 'timeout' in options) ? undefined
					: options?.timeout ?? 500
				timer = setTimeout(() => resolve(), timing)
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

export function fileNameToKey (name: string) {
	const split = (name: string, s: string): string => {
		const res = name.split(s[0]).map((name, i) => i > 0 ? name[0].toUpperCase() + name.slice(1) : name).join('')
		if (s.slice(1)) { return split(res, s.slice(1)) }
		return res
	}
	if (name.split('.').length > 1) { name = name.split('.').slice(0, name.split('.').length - 1).join('.') }
	return split(name, '_.-')
}

export function fileStructureFromGlobImport (root: string, globObj: Record<string, any>) {
	const fileStructure = {} as any
	for (const key in globObj) {
		if (Object.prototype.hasOwnProperty.call(globObj, key)) {
			const p = key.slice(root.length).split('/')
			const pathParts = p.map((val, i) => i === p.length - 1 ? fileNameToKey(val) : val)
			let currentObj = fileStructure
			for (let i = 0; i < pathParts.length; i++) {
				const pathPart = pathParts[i]
				if (i === pathParts.length - 1) { currentObj[pathPart] = globObj[key] } else {
					if (!currentObj[pathPart]) { currentObj[pathPart] = {} }
					currentObj = currentObj[pathPart]
				}
			}
		}
	}
	return fileStructure
}