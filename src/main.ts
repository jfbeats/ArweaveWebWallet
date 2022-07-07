import '@/assets/animations.css'
import '@/assets/style.css'
import '@/store/Analytics'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
// @ts-ignore
import { plugin as Slicksort } from 'vue-slicksort'
import 'mosha-vue-toastify/dist/style.css'

import { PWA } from '@/pwa'
PWA.registration.then((r: any) => setInterval(() => r.update(), 60 * 60 * 1000))

const app = createApp(App)
app.use(router, Slicksort)
app.mount('#app')