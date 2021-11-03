import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { plugin as Slicksort } from 'vue-slicksort'
import '@/assets/animations.css'
import '@/assets/style.css'

import SW from '@/functions/sw'
SW.registration.then(r => setInterval(() => r.update(), 60 * 60 * 1000))

import Address from '@/components/atomic/Address.vue'
import AddressIcon from '@/components/atomic/AddressIcon.vue'
import Ar from '@/components/atomic/Ar.vue'
import Button from '@/components/atomic/Button.vue'
import Date from '@/components/atomic/Date.vue'
import Icon from '@/components/atomic/Icon.vue'
import LocaleCurrency from '@/components/atomic/LocaleCurrency.vue'

import Link from '@/components/function/Link.vue'

const app = createApp(App)
app.use(router, Slicksort)
app.component('Address', Address)
app.component('AddressIcon', AddressIcon)
app.component('Ar', Ar)
app.component('Button', Button)
app.component('Date', Date)
app.component('Icon', Icon)
app.component('LocaleCurrency', LocaleCurrency)
app.component('Link', Link)
app.mount('#app')