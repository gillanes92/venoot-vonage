import { createApp } from 'vue'
import './tailwind.css'
import App from './App.vue'
import { auth, router } from './plugins/vue-auth'
import { createPinia } from 'pinia'
import { createVfm } from 'vue-final-modal'
import 'vue-final-modal/style.css'
import 'vue-color-kit/dist/vue-color-kit.css'
import 'vue-toast-notification/dist/theme-sugar.css'

const pinia = createPinia()
const vfm = createVfm()


window.io = require('socket.io-client')

const app = createApp(App)
app.use(auth)
app.use(router)
app.use(pinia)
app.use(vfm)
app.mount('#app')
