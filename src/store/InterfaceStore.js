import { reactive } from 'vue'

const InterfaceStore = reactive({
	windowWidth: window.innerWidth,
	windowVisible: !document.hidden,
	breakpoints: {},
})

const updateWindowState = () => {
	InterfaceStore.windowWidth = window.innerWidth
	InterfaceStore.breakpoints = { verticalLayout: InterfaceStore.windowWidth < 600 }
}

updateWindowState()
window.addEventListener('resize', updateWindowState)
document.addEventListener('visibilitychange', () => InterfaceStore.windowVisible = !document.hidden)

export default InterfaceStore