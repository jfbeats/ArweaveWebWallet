import { reactive } from 'vue'
import mitt from 'mitt'

const InterfaceStore = reactive({
	windowWidth: window.innerWidth,
	windowVisible: !document.hidden,
	breakpoints: {
		verticalLayout: false,
		verticalContent: false,
	},
	dragOverlay: false,
	wallet: {
		send : {
			address: '',
			amount: '',
			data: '',
			tags: [],
		},
	},
})

export const emitter = mitt()

emitter.once = (eventName, fn) => {
	const handler = () => {
		emitter.off(eventName, handler)
		fn()
	}
	emitter.on(eventName, handler)
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
document.addEventListener('dragenter', (e) => {
	e.preventDefault()
	if (e.dataTransfer.types[0] !== 'Files') { return }
	if (dragCount === 1) { InterfaceStore.dragOverlay = true }
	dragCount++
})
document.addEventListener('dragleave', (e) => {
	e.preventDefault()
	if (e.dataTransfer.types[0] !== 'Files') { return }
	dragCount--
	if (dragCount === 0) { InterfaceStore.dragOverlay = false }
})
document.addEventListener('dragend', (e) => {
	e.preventDefault()
	dragCount = 0
	InterfaceStore.dragOverlay = false
})
document.addEventListener('dragover', (e) => {
	e.preventDefault()
})
document.addEventListener('drop', (e) => {
	e.preventDefault()
	dragCount = 0
	InterfaceStore.dragOverlay = false
})

if (navigator.appVersion.indexOf("Win") != -1) {
	document.documentElement.classList.add('styleScroll')
}

export default InterfaceStore