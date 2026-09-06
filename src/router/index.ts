import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import PublicLandingView from '../views/PublicLandingView.vue'
import { CONSULTAS } from '../datos/consultas'
import { GUIAS } from '../datos/guias'

/**
 * La portada se carga de forma sincrona porque es la puerta de entrada y su
 * LCP es el que mide Google. El resto va en trozos aparte: quien solo visita
 * la portada no descarga el panel ni la administracion.
 */
const LegalView = () => import('../views/LegalView.vue')
const ConsultaView = () => import('../views/ConsultaView.vue')
const GuiaView = () => import('../views/GuiaView.vue')
const AuthView = () => import('../views/AuthView.vue')
const DashboardView = () => import('../views/DashboardView.vue')
const AdminView = () => import('../views/AdminView.vue')

const MARCA = 'Portal de Consulta Ciudadana'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, _from, guardado) {
    if (guardado) return guardado
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  },
  routes: [
    {
      // Portada publica: catalogo, guias y preguntas frecuentes. Es lo primero
      // que ve un visitante; consultar exige cuenta y se le explica alli.
      path: '/',
      name: 'home',
      component: PublicLandingView,
      meta: {
        titulo: 'Consulta cédula, RUC y placas del Ecuador',
        descripcion: 'Consulta cédula, RUC, licencias, multas y vehículos del Ecuador en un solo lugar. Datos del Registro Civil, SRI, ANT y Función Judicial. Cuenta gratuita.'
      }
    },
    /*
     * Una ruta publica por consulta, generada desde el catalogo.
     *
     * Antes las ocho consultas vivian en modales de la portada: una sola URL
     * intentando posicionar para ocho busquedas distintas, que es como no
     * competir por ninguna. Ahora cada una tiene su pagina, su titulo y sus
     * preguntas.
     */
    ...CONSULTAS.map(c => ({
      path: `/${c.slug}`,
      name: `consulta-${c.slug}`,
      component: ConsultaView,
      props: { slug: c.slug },
      meta: {
        titulo: c.tituloSeo,
        descripcion: c.descripcion,
        slug: c.slug
      }
    })),
    /*
     * Guias. El indice y cada guia comparten componente: la diferencia es si
     * hay slug. Vivian dentro de un acordeon de la portada, sin URL, asi que
     * ninguna podia posicionar por su cuenta.
     */
    {
      path: '/guias',
      name: 'guias',
      component: GuiaView,
      meta: {
        titulo: 'Guías sobre los datos públicos del Ecuador',
        descripcion: 'Explicaciones cortas para entender qué significa cada dato antes de consultarlo: cédula, RUC, multas de tránsito, licencia y vehículos.'
      }
    },
    ...GUIAS.map(g => ({
      path: `/guias/${g.slug}`,
      name: `guia-${g.slug}`,
      component: GuiaView,
      // slug por meta: la ruta es estatica, asi que params llega vacio.
      meta: { titulo: g.tituloSeo, descripcion: g.descripcion, slug: g.slug }
    })),
    {
      // Documentos legales: mismo componente, distinto contenido segun el
      // nombre de ruta. Publicos, sin sesion.
      path: '/terminos',
      name: 'terminos',
      component: LegalView,
      meta: {
        titulo: 'Términos de servicio',
        descripcion: 'Condiciones de uso del Portal de Consulta Ciudadana: cuenta, cuota diaria de consultas, uso aceptable, exactitud de los datos y disponibilidad del servicio.'
      }
    },
    {
      path: '/privacidad',
      name: 'privacidad',
      component: LegalView,
      meta: {
        titulo: 'Política de privacidad',
        descripcion: 'Qué datos tratamos y para qué: cuenta, cuota y sesión. Sin cookies, sin analítica y sin rastreo. Cómo ejercer tus derechos de acceso y eliminación.'
      }
    },
    {
      path: '/contacto',
      name: 'contacto',
      component: LegalView,
      meta: {
        titulo: 'Contacto y soporte',
        descripcion: 'Cómo contactarnos para soporte de uso, problemas con la cuota, solicitudes sobre tus datos personales o para reportar una vulnerabilidad de seguridad.'
      }
    },
    {
      path: '/auth',
      name: 'auth',
      component: AuthView,
      meta: {
        guestOnly: true,
        titulo: 'Acceder o crear cuenta',
        descripcion: 'Entra a tu cuenta o crea una gratis para consultar cédula, RUC, licencias, multas y vehículos del Ecuador. Sin tarjeta de crédito.'
      }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true, titulo: 'Panel de consultas', noIndexar: true }
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminView,
      meta: { requiresAuth: true, requiresAdmin: true, titulo: 'Administración', noIndexar: true }
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
})

router.beforeEach((to, _from, next) => {
  const { isAuthenticated, isAdmin } = useAuth();

  if (to.meta.requiresAuth && !isAuthenticated.value) {
    // Se guarda el destino para volver despues de entrar. Antes se mandaba
    // siempre al panel, perdiendo la intencion del usuario: quien pedia /admin
    // acababa en /dashboard sin saber por que.
    next({ name: 'auth', query: { next: to.fullPath } })
  } else if (to.meta.requiresAdmin && !isAdmin.value) {
    next({ name: 'dashboard' })
  } else if (to.meta.guestOnly && isAuthenticated.value) {
    // Quien ya tiene sesion y aterriza en /auth con un destino pedido va alli,
    // no al panel.
    const pedido = to.query.next
    const interno = typeof pedido === 'string' && pedido.startsWith('/') && !pedido.startsWith('//')
    next(interno ? (pedido as string) : { name: 'dashboard' })
  } else {
    next()
  }
})

/**
 * Titulo y descripcion por ruta.
 *
 * Al ser una SPA, sin esto las siete rutas comparten el mismo <title>, que es
 * justo lo que penaliza el buscador. Se actualizan tambien el canonical y las
 * etiquetas OpenGraph para que al compartir un enlace se vea la pagina real.
 */
const fijarEtiqueta = (selector: string, atributo: string, valor: string) => {
  const el = document.head.querySelector(selector)
  if (el) el.setAttribute(atributo, valor)
}

router.afterEach((to) => {
  const titulo = (to.meta.titulo as string) || MARCA
  document.title = titulo === MARCA ? titulo : `${titulo} | ${MARCA}`

  const desc = to.meta.descripcion as string | undefined
  if (desc) {
    fijarEtiqueta('meta[name="description"]', 'content', desc)
    fijarEtiqueta('meta[property="og:description"]', 'content', desc)
  }

  fijarEtiqueta('meta[property="og:title"]', 'content', document.title)
  fijarEtiqueta('link[rel="canonical"]', 'href', `https://devzio.site${to.path}`)
  fijarEtiqueta('meta[property="og:url"]', 'content', `https://devzio.site${to.path}`)

  // Las rutas con sesion no deben indexarse
  const robots = document.head.querySelector('meta[name="robots"]')
  if (robots) robots.setAttribute('content', to.meta.noIndexar ? 'noindex, nofollow' : 'index, follow')
})

export default router
