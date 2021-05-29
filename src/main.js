import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { plugin as Slicksort } from 'vue-slicksort'

const app = createApp(App)
app.use(router)
app.use(Slicksort)
app.mount('#app')