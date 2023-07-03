const createElement = () => ({
	appendChild: () => {},
	removeChild: () => {},
	style: { setProperty: () => {} },
	setAttribute: () => {},
	addEventListener: () => {},
	removeEventListener: () => {},
	remove: () => {},
	querySelector: () => {},
})

export const location = new URL(import.meta.env.VITE_DOMAIN)

export const document = {
	...createElement(),
	location,
	documentElement: createElement(),
	head: createElement(),
	body: createElement(),
	createElement,
	hidden: false,
} as any

export const screen = { width: 0, height: 0 }

export const navigator = { language: undefined }

export const history = { replaceState: () => {}, pushState: () => {} }

const getStorage = () => ({
	getItem (name: string) { this[name] },
	setItem (name: string, value: string) { this[name] = value },
	removeItem (name: string) { delete this[name] },
} satisfies { [name: string]: any })

export const localStorage = getStorage()
export const sessionStorage = getStorage()

const globalWindow = { location, document, screen, navigator, history, localStorage, sessionStorage }

if (window) { Object.entries(globalWindow).map(([k, v]) => (window as any)[k] ??= v) }

export default globalWindow