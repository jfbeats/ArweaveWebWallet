import logoArweaveBlack from '@/assets/logos/arweaveBlack.svg?url'
import logoArweaveWhite from '@/assets/logos/arweaveWhite.svg?url'
import { Emitter } from '@/functions/UtilsClass'
import { state, states } from '@/functions/Channels'
import { track } from '@/store/Telemetry'
import { useRegisterSW } from 'virtual:pwa-register/vue'
import { reactive, ref, watch } from 'vue'

const { needRefresh, updateServiceWorker } = useRegisterSW({})



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
	online: navigator.onLine,
	overlay: false,
	autoUpdateActive: true,
	needRefresh,
	reload,
	triggerUpdate,
})
export default InterfaceStore



const newLocation = sessionStorage.getItem('redirect')
if (newLocation) { sessionStorage.removeItem('redirect'); location.replace(newLocation) }
setTimeout(() => InterfaceStore.autoUpdateActive = false, 10000)
watch(needRefresh, needed => {
	const hasOtherInstance = () => states.value.filter(s => s !== state.value).find(s => !s.origin || s.origin !== state.value.origin && s.session !== state.value.session)
	if (needed && InterfaceStore.autoUpdateActive && state.value.type !== 'iframe' && !hasOtherInstance()) { triggerUpdate() }
}, { immediate: true })



async function reload (update?: boolean) {
	InterfaceStore.overlay = true
	const possibleRedirect = state.value.type !== 'iframe' && InterfaceStore.autoUpdateActive && state.value.redirect
	if (possibleRedirect && state.value.url) { sessionStorage.setItem('redirect', state.value.url) }
	if (state.value.origin) {
		const urlInfo = { origin: state.value.origin, session: state.value.session! }
		const url = new URL(location.href)
		url.hash = new URLSearchParams(urlInfo).toString()
		location.replace(url)
	}
	if (update) { updateServiceWorker(true); state.value.updating = 'completed' }
	else { location.reload() }
}

watch(() => state.value.updating, val => val === 'scheduled' && InterfaceStore.reload(true), { immediate: true })

async function triggerUpdate () {
	if (InterfaceStore.overlay) { return }
	InterfaceStore.overlay = true
	track.event('App Update')
	states.value.forEach(s => s.updating = 'scheduled')
}



export const emitter = new Emitter<{ scrollHistory: undefined, selectWallet: string | undefined }>()



const updateWindowSize = () => {
	InterfaceStore.windowWidth = window.innerWidth
	InterfaceStore.breakpoints.verticalLayout = InterfaceStore.windowWidth < 599
	InterfaceStore.breakpoints.verticalContent = InterfaceStore.windowWidth < 1099
}
updateWindowSize()
window.addEventListener('resize', updateWindowSize)

window.addEventListener('online', () => InterfaceStore.online = true)
window.addEventListener('offline', () => InterfaceStore.online = false)

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



const scrollbarSize = (() => {
	const el = document.createElement('div')
	el.style.width = '100px'
	el.style.height = '100px'
	el.style.overflow = 'scroll'
	el.style.visibility = 'hidden'
	el.innerHTML = '<div style="width: 200px; height: 200px;"></div>'
	document.body.appendChild(el)
	const v = el.offsetWidth - el.clientWidth
	const h = el.offsetHeight - el.clientHeight
	document.body.removeChild(el)
	return { v, h, value: v || h || undefined }
})()
if (scrollbarSize.value) { document.documentElement.classList.add('styleScroll') }



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



export function onUnload (callback: (e: Event) => void): () => void {
	window.addEventListener('beforeunload', callback)
	window.addEventListener('unload', callback)
	return () => {
		window.removeEventListener('beforeunload', callback)
		window.removeEventListener('unload', callback)
	}
}