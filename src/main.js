import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './registerServiceWorker'
import { plugin as Slicksort } from 'vue-slicksort'
import '@/assets/animations.css'
import '@/assets/style.css'

const app = createApp(App)
app.use(router, Slicksort)
app.mount('#app')