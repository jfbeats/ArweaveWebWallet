import { useRegisterSW } from 'virtual:pwa-register/vue'



const ServiceWrapper = {
	registration: new Promise(resolve => useRegisterSW({ onRegistered (r) { resolve(r) } }))
}
export default ServiceWrapper



export function showNotification (title, options) {
	if (!navigator.serviceWorker || !window.PushManager) { return }
	return true
}
