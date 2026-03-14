import { createRouter, createWebHistory } from 'vue-router'
import AuthView from '../views/AuthView.vue'
import DashboardView from '../views/DashboardView.vue'
import { useAuth } from '../composables/useAuth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/auth',
      name: 'auth',
      component: AuthView,
      meta: { guestOnly: true }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true }
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/dashboard'
    }
  ]
})

router.beforeEach((to, from, next) => {
  const { isAuthenticated } = useAuth();
  
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    // Redirigir a login si intenta ir al dashboard sin autenticación
    next({ name: 'auth' })
  } else if (to.meta.guestOnly && isAuthenticated.value) {
    // Redirigir al dashboard si intenta ir al login estando autenticado
    next({ name: 'dashboard' })
  } else {
    // Permitir navegación
    next()
  }
})

export default router
