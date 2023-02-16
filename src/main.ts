import '@/store/Theme'
import '@/assets/style.css'
import '@/assets/animations.css'
import '@/pwa'
import '@/functions/File'
import '@/store/Cold'
import '@/store/Analytics'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
// @ts-ignore
import { plugin as Slicksort } from 'vue-slicksort'
import 'mosha-vue-toastify/dist/style.css'
import { notify } from '@/store/NotificationStore'


const app = createApp(App)
app.use(router, Slicksort)

if (location.host === 'dev.arweave.app') {
	console = new Proxy(console, { get: (target: any, p: string | symbol, receiver: any) => p === 'error' ? (...args: any[]) => { notify.error(args[0]); target[p](...args) } : target[p] })
	window.onerror = (event) => { notify.error(event.toString()) }
	window.onunhandledrejection = (event) => { notify.error(event.reason) }
}

app.mount('#app')