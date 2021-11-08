import { reactive, watch } from 'vue'
import mitt from 'mitt'

import logoArweaveBlack from '@/assets/logos/arweaveBlack.svg?url'
import logoArweave from '@/assets/logos/arweave.svg?url'

const InterfaceStore = reactive({
	windowWidth: window.innerWidth,
	windowVisible: !document.hidden,
	toolbar: {
		enabled: true,
		links: true,
	},
	breakpoints: {
		verticalLayout: false,
		verticalContent: false,
	},
	sticky: false,
	dragOverlay: false,
	wallet: {
		send: {
			target: '',
			quantity: '',
			data: '',
			tags: [],
		},
	},
})

export const emitter = mitt()
emitter.once = (eventName, handler) => {
	return new Promise(resolve => {
		const wrapper = (e) => {
			emitter.off(eventName, wrapper)
			resolve(e)
			if (handler) { handler(e) }
		}
		emitter.on(eventName, wrapper)
	})
}

export async function sleepUntilVisible () {
	return new Promise(resolve => {
		watch(() => InterfaceStore.windowVisible, (value) => { if (value) { resolve(true) } }, { immediate: true })
	})
}

const updateWindowSize = () => {
	InterfaceStore.windowWidth = window.innerWidth
	InterfaceStore.breakpoints.verticalLayout = InterfaceStore.windowWidth < 600
	InterfaceStore.breakpoints.verticalContent = InterfaceStore.windowWidth < 1100
}
updateWindowSize()
window.addEventListener('resize', updateWindowSize)

document.addEventListener('visibilitychange', () => InterfaceStore.windowVisible = !document.hidden)

let dragCount = 0
document.addEventListener('dragenter', (e) => { e.preventDefault(); if (e.dataTransfer.types[0] == 'Files') { InterfaceStore.dragOverlay = !!++dragCount } }, true)
document.addEventListener('dragleave', (e) => { e.preventDefault(); if (e.dataTransfer.types[0] == 'Files') { InterfaceStore.dragOverlay = !!--dragCount } }, true)
document.addEventListener('dragend', (e) => { e.preventDefault(); dragCount = 0; InterfaceStore.dragOverlay = false; }, true)
document.addEventListener('dragover', (e) => { e.preventDefault() }, true)
document.addEventListener('drop', (e) => { e.preventDefault(); dragCount = 0; InterfaceStore.dragOverlay = false; }, true)

if (navigator.appVersion.indexOf("Win") != -1) {
	document.documentElement.classList.add('styleScroll')
}

const faviconEl = document.createElement('link')
faviconEl.setAttribute('rel', 'favicon icon')
const setFavicon = (e) => {
	faviconEl.remove()
	if (e.matches) { faviconEl.setAttribute('href', logoArweaveBlack) }
	else { faviconEl.setAttribute('href', logoArweave) }
	document.head.appendChild(faviconEl)
}
if (window.matchMedia) {
	const matchTheme = window.matchMedia('(prefers-color-scheme: light)')
	matchTheme.addEventListener('change', setFavicon)
	setFavicon(matchTheme)
} else { setFavicon({ matches: false }) }



export default InterfaceStore