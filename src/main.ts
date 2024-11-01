import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin } from '@tanstack/vue-query'

import { createHead } from '@vueuse/head'

import App from './App.vue'
import router from './router'

import './assets/main.css'

const app = createApp(App)
const head = createHead()

app.use(createPinia())
app.use(router)
app.use(head)
app.use(VueQueryPlugin)

app.mount('#app')
