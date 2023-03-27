import '@/store/Theme'
import '@/assets/style.css'
import '@/assets/animations.css'
import '@/pwa'
import '@/functions/File'
import '@/store/Cold'
import '@/store/Telemetry'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { plugin as Slicksort } from 'vue-slicksort'
import 'mosha-vue-toastify/dist/style.css'
import { notify } from '@/store/NotificationStore'
import { isLocalhost } from '@/store/Telemetry'


const app = createApp(App)
app.use(router)
app.use(Slicksort)

if (isLocalhost || ['dev.arweave.app', 'jfbeats.github.io'].includes(location.host)) {
	notify.warn('Development mode')
	const error = (e: string) => !['', 'AxiosError: Network Error', 'TypeError: Network request failed'].includes(e) && notify.error(e)
	console = new Proxy(console, { get: (target: any, p: string | symbol, receiver: any) => p === 'error' ? (...args: any[]) => { error('' + args[0]); target[p](...args) } : target[p] })
	window.onerror = (event) => { error('' + event) }
	window.onunhandledrejection = (event) => { error('' + event.reason) }
}

app.mount('#app')