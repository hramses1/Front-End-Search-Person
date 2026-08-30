import { createApp } from 'vue'
import './index.css'
import App from './App.vue'
import router from './router'
import { useAuth } from './composables/useAuth'

const app = createApp(App)

// Restaura la sesión y los listeners de inactividad si hay token en sessionStorage
const { initializeAuth } = useAuth()
initializeAuth()

app.use(router)
app.mount('#app')
