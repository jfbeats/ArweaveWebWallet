import { reactive, ref, watch } from 'vue'
import mitt from 'mitt'

import logoArweaveBlack from '@/assets/logos/arweaveBlack.svg?url'
import logoArweaveWhite from '@/assets/logos/arweaveWhite.svg?url'

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



const updateWindowSize = () => {
	InterfaceStore.windowWidth = window.innerWidth
	InterfaceStore.breakpoints.verticalLayout = InterfaceStore.windowWidth < 599
	InterfaceStore.breakpoints.verticalContent = InterfaceStore.windowWidth < 1099
}
updateWindowSize()
window.addEventListener('resize', updateWindowSize)

document.addEventListener('visibilitychange', () => InterfaceStore.windowVisible = !document.hidden)



const dragCount = ref(0)
export const isDragging = ref(false)
export const isDraggingFromOutside = ref(false)
export const draggingContent = ref(undefined as undefined | DragEvent)

window.addEventListener('dragenter', (e) => { e.preventDefault(); dragStart(e); dragCount.value++ }, true)
window.addEventListener('dragleave', (e) => { e.preventDefault(); dragCount.value-- }, true)
window.addEventListener('dragend', (e) => { e.preventDefault(); dragCount.value = 0 }, true)
window.addEventListener('dragover', (e) => { e.preventDefault() }, true)
window.addEventListener('drop', (e) => { e.preventDefault(); dragCount.value = 0 }, true)

watch(dragCount, v => {
	InterfaceStore.dragOverlay = !!v // todo replace InterfaceStore.dragOverlay
	isDragging.value = !!v
	if (!v) { setTimeout(() => {
		isDraggingFromOutside.value = false
		draggingContent.value = undefined
	})}
})

function dragStart (e: DragEvent) {
	if (dragCount.value) { return }
	if (!document.hasFocus()) { isDraggingFromOutside.value = true }
	draggingContent.value = e
}



if (navigator.appVersion.indexOf("Win") != -1 || navigator.appVersion.indexOf('Macintosh') != -1) {
	document.documentElement.classList.add('styleScroll')
}

const faviconEl = document.createElement('link')
faviconEl.setAttribute('rel', 'favicon icon')
const setFavicon = (e: { matches: boolean }) => {
	faviconEl.remove()
	if (e.matches) { faviconEl.setAttribute('href', logoArweaveBlack) }
	else { faviconEl.setAttribute('href', logoArweaveWhite) }
	document.head.appendChild(faviconEl)
}
if (window.matchMedia) {
	const matchTheme = window.matchMedia('(prefers-color-scheme: light)')
	matchTheme.addEventListener('change', setFavicon)
	setFavicon(matchTheme)
} else { setFavicon({ matches: false }) }



export default InterfaceStore