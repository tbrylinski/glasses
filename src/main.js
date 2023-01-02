import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useGlobalStore } from './stores'
import { router } from './router'
// import router from './router'
import './style.css'
import App from './App.vue'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)

const globalStore = useGlobalStore()

app.mount('#app')
