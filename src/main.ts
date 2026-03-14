import { createApp } from 'vue'
import './index.css'
import App from './App.vue'
import router from './router'
import { useAuth } from './composables/useAuth'

const app = createApp(App)

// Inicializa axios headers si hay token en localStorage
const { initializeAuth } = useAuth()
initializeAuth()

app.use(router)
app.mount('#app')
