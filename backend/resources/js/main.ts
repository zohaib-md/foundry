import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import './style.css'
import App from './App.vue'
import CanvasComponent from './components/builder/CanvasComponent.vue'

const app = createApp(App)

app.component('CanvasComponent', CanvasComponent)

app.use(createPinia())
app.use(router)
app.mount('#app')
