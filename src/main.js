import '@/assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VueCookies from 'vue-cookies'

import App from '@/App.vue'
import router from '@/router'

import AuthService from '@/service/auth'
import RoomService from '@/service/room'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueCookies)

const authService = new AuthService(VueCookies)
const roomService = new RoomService(authService)

app.provide('service.auth', authService)
app.provide('service.room', roomService)

app.mount('#app')
