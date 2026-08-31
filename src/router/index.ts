import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import PublicLandingView from '../views/PublicLandingView.vue'
import AuthView from '../views/AuthView.vue'
import DashboardView from '../views/DashboardView.vue'
import AdminView from '../views/AdminView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      // Portada publica: catalogo, guias y preguntas frecuentes. Es lo primero
      // que ve un visitante; consultar exige cuenta y se le explica alli.
      path: '/',
      name: 'home',
      component: PublicLandingView
    },
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
      path: '/admin',
      name: 'admin',
      component: AdminView,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
})

router.beforeEach((to, from, next) => {
  const { isAuthenticated, isAdmin } = useAuth();
  
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    next({ name: 'auth' })
  } else if (to.meta.requiresAdmin && !isAdmin.value) {
    next({ name: 'dashboard' })
  } else if (to.meta.guestOnly && isAuthenticated.value) {
    next({ name: 'dashboard' })
  } else {
    next()
  }
})

export default router
