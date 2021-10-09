import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { registerSW } from 'virtual:pwa-register'
import { plugin as Slicksort } from 'vue-slicksort'
import '@/assets/animations.css'
import '@/assets/style.css'

registerSW({
	onRegistered (registration) {
		registration && setInterval(() => registration.update(), 60 * 60 * 1000)
	}
})

const app = createApp(App)
app.use(router, Slicksort)
app.mount('#app')