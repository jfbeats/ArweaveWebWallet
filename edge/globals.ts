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

const globalWindow = { location, document, screen, navigator, history }

if (window) {
	Object.entries(globalWindow).map(([k, v]) => (window as any)[k] ??= v)
}

export default globalWindow