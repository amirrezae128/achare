import 'bootstrap/dist/css/bootstrap.rtl.min.css'
import 'leaflet/dist/leaflet.css';
import './assets/main.css'

import ToastPlugin from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-bootstrap.css';



import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(ToastPlugin)
app.use(router)

app.mount('#app')
