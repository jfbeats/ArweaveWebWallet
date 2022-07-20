import '@/assets/animations.css'
import '@/assets/style.css'
import '@/store/Analytics'
import '@/pwa'
import '@/functions/File'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
// @ts-ignore
import { plugin as Slicksort } from 'vue-slicksort'
import 'mosha-vue-toastify/dist/style.css'


const app = createApp(App)
app.use(router, Slicksort)
app.mount('#app')