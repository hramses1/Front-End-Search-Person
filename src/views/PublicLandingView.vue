<template>
  <div class="font-primary min-h-screen relative selection:bg-[var(--accent-color)]/30" style="background-color: var(--bg-color); color: var(--text-primary);">
    <a href="#contenido" class="salto-contenido">Saltar al contenido</a>

    <div class="absolute inset-0 pointer-events-none noise-overlay z-0 text-[var(--text-muted)]"></div>
    <div class="absolute inset-0 pointer-events-none overflow-hidden z-0">
      <div class="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-[var(--accent-color)]/5 blur-[120px] rounded-full"></div>
      <div class="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[var(--accent-color)]/3 blur-[100px] rounded-full"></div>
    </div>

    <div class="relative z-10 max-w-5xl mx-auto px-lg sm:px-xl">

      <!-- Barra superior -->
      <header class="flex items-center justify-between py-lg">
        <div>
          <BrandMark />
        </div>

        <div class="flex items-center gap-sm">
          <button @click="toggleTheme" class="btn-icon glass-panel">
            <svg v-if="isDark" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-width="1.8" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"/></svg>
            <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-width="1.8" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
          </button>
          <button v-if="isAuthenticated" @click="router.push('/dashboard')" class="btn-secondary">Ir al panel</button>
          <button v-else @click="router.push('/auth')" class="btn-secondary">Acceder</button>
        </div>
      </header>

      <!-- Portada -->
      <section id="contenido" class="py-2xl sm:py-3xl text-center">
        <p class="text-overline font-black tracking-[0.14em] uppercase text-[var(--text-muted)] mb-lg">Datos públicos del Ecuador</p>
        <h1 class="text-h3 sm:text-h2 font-light leading-[1.15] tracking-tight max-w-3xl mx-auto">
          Verifica identidad, RUC, licencias y vehículos
          <span class="font-black text-[var(--accent-color)]">en una sola consulta</span>
        </h1>
        <p class="mt-lg text-body sm:text-body leading-relaxed text-[var(--text-secondary)] max-w-xl mx-auto">
          Registro Civil, SRI y ANT desde una misma pantalla. Escribes una cédula y recibes
          la ficha completa, sin saltar entre portales ni repetir captchas.
        </p>
        <div class="mt-2xl flex flex-wrap gap-md justify-center">
          <button @click="router.push('/auth')" class="btn-primary">Crear cuenta gratis</button>
          <a href="#consultas" class="btn-secondary">
            Ver consultas
          </a>
        </div>
      </section>

      <!-- Ventajas -->
      <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md pb-3xl">
        <div v-for="v in ventajas" :key="v.titulo" class="glass-card p-lg">
          <svg class="w-5 h-5 text-[var(--accent-color)] mb-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path v-for="d in v.icon" :key="d" :d="d" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" />
          </svg>
          <h3 class="text-body font-bold tracking-wide mb-sm">{{ v.titulo }}</h3>
          <p class="text-body leading-relaxed text-[var(--text-secondary)]">{{ v.texto }}</p>
        </div>
      </section>

      <!-- Catálogo de consultas -->
      <section id="consultas" class="pb-3xl scroll-mt-xl">
        <p class="text-overline font-black tracking-[0.14em] uppercase text-[var(--text-muted)] mb-sm">Consultas disponibles</p>
        <h2 class="text-h4 font-light tracking-tight mb-xl">Qué puedes averiguar</h2>

        <!--
          Cada tarjeta enlaza a la pagina de su consulta. Antes abria un modal
          pidiendo cuenta: el visitante no llegaba a ver nada y la portada era
          la unica URL indexable de las ocho consultas.
        -->
        <div v-for="grupo in GRUPOS" :key="grupo" class="mb-xl">
          <p class="text-overline font-black tracking-[0.14em] uppercase text-[var(--text-muted)] mb-md">{{ grupo }}</p>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-md">
            <RouterLink
              v-for="item in porGrupo(grupo)" :key="item.slug"
              :to="`/${item.slug}`"
              class="glass-card p-lg text-left hover:border-[var(--accent-color)]/40 hover:-translate-y-0.5 transition-all duration-base group block"
            >
              <div class="flex items-start justify-between gap-md mb-sm">
                <h3 class="text-body font-bold tracking-wide">{{ item.titulo }}</h3>
                <svg class="w-3.5 h-3.5 shrink-0 text-[var(--text-muted)] group-hover:text-[var(--text-secondary)] group-hover:text-[var(--accent-color)] transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <p class="text-body leading-relaxed text-[var(--text-secondary)]">{{ item.texto }}</p>
            </RouterLink>
          </div>
        </div>
      </section>

      <!-- Guías -->
      <section id="guias" class="pb-3xl scroll-mt-xl">
        <p class="text-overline font-black tracking-[0.14em] uppercase text-[var(--text-muted)] mb-sm">Guías</p>
        <h2 class="text-h4 font-light tracking-tight mb-xl">Cómo se leen los documentos ecuatorianos</h2>

        <!--
          Las guias enlazan a su pagina en vez de desplegarse aqui. En un
          acordeon no tenian URL, asi que ninguna podia posicionar sola.
        -->
        <div class="grid gap-sm sm:grid-cols-2">
          <RouterLink
            v-for="g in guiasDestacadas" :key="g.slug"
            :to="`/guias/${g.slug}`"
            class="glass-card p-lg block hover:border-[var(--accent-color)]/40 hover:-translate-y-0.5 transition-all duration-base"
          >
            <p class="text-overline uppercase tracking-[0.14em] text-[var(--text-muted)] mb-xs">{{ g.categoria }}</p>
            <h3 class="text-body font-bold tracking-wide mb-xs">{{ g.titulo }}</h3>
            <p class="text-caption leading-relaxed text-[var(--text-secondary)]">{{ g.resumen }}</p>
          </RouterLink>
        </div>

        <RouterLink to="/guias" class="btn-secondary mt-lg">Ver las {{ GUIAS.length }} guías</RouterLink>
      </section>

      <!-- Preguntas frecuentes -->
      <section id="faq" class="pb-3xl scroll-mt-xl">
        <p class="text-overline font-black tracking-[0.14em] uppercase text-[var(--text-muted)] mb-sm">Preguntas frecuentes</p>
        <h2 class="text-h4 font-light tracking-tight mb-xl">Dudas habituales</h2>

        <div class="glass-card divide-y divide-[var(--border-color)]">
          <div v-for="(f, i) in faq" :key="f.p">
            <button @click="faqAbierta = faqAbierta === i ? -1 : i" class="w-full flex items-center justify-between gap-md px-lg py-lg text-left">
              <span class="text-body font-bold tracking-wide">{{ f.p }}</span>
              <span class="text-[var(--accent-color)] text-lead leading-none shrink-0 transition-transform duration-base" :class="faqAbierta === i ? 'rotate-45' : ''">+</span>
            </button>
            <p v-if="faqAbierta === i" class="px-lg pb-lg text-body leading-relaxed text-[var(--text-secondary)]">{{ f.r }}</p>
          </div>
        </div>
      </section>

      <!-- Cierre -->
      <section class="pb-3xl">
        <div class="glass-card p-lg sm:p-2xl text-center">
          <h2 class="text-lead sm:text-h4 font-light tracking-tight mb-md">Crea tu cuenta y empieza a consultar</h2>
          <p class="text-body text-[var(--text-secondary)] max-w-md mx-auto mb-xl">
            El registro es gratuito y no pide tarjeta. Cada cuenta trae su cuota diaria de
            consultas, que vuelve a cero cada medianoche.
          </p>
          <button @click="router.push('/auth')" class="btn-primary">Crear cuenta gratis</button>
        </div>
      </section>

      <!-- Pie -->
      <footer class="border-t border-[var(--border-color)] py-2xl flex flex-col sm:flex-row items-center justify-between gap-lg">
        <div class="flex flex-wrap gap-x-lg gap-y-0 justify-center">
          <component
            v-for="l in enlacesLegales" :key="l.texto"
            :is="l.ruta ? 'button' : 'a'"
            :href="l.ruta ? undefined : l.href"
            @click="l.ruta && router.push(l.ruta)"
            class="enlace-menor"
          >
            {{ l.texto }}
          </component>
        </div>
        <p class="text-overline uppercase tracking-[0.14em] text-[var(--text-muted)]">Devzio · {{ anio }}</p>
      </footer>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import { useRouter } from 'vue-router';
import BrandMark from '../ui/components/BrandMark.vue';
import { useAuth } from '../composables/useAuth';
import { GRUPOS, porGrupo } from '../datos/consultas';
import { GUIAS } from '../datos/guias';
import { useDatosEstructurados, preguntas } from '../composables/useDatosEstructurados';

const router = useRouter();
const { isAuthenticated, isDark, toggleTheme } = useAuth();

const anio = new Date().getFullYear();
const faqAbierta = ref(-1);

/** Cuatro guias en la portada; el resto, en el indice. */
const guiasDestacadas = GUIAS.slice(0, 4);



const ventajas = [
  {
    titulo: 'Resultado inmediato',
    texto: 'La consulta se resuelve contra la fuente en el momento. Sin colas ni esperas.',
    icon: ['M13 10V3L4 14h7v7l9-11h-7z']
  },
  {
    titulo: 'Fuentes oficiales',
    texto: 'Registro Civil, SRI y ANT. No se inventa ni se completa nada por nuestra cuenta.',
    icon: ['M9 12l2 2 4-4', 'M12 3l7 4v5c0 4.418-2.985 8.167-7 9-4.015-.833-7-4.582-7-9V7l7-4z']
  },
  {
    titulo: 'Un solo lugar',
    texto: 'Identidad, tributario, tránsito y judicial sin saltar entre portales distintos.',
    icon: ['M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z']
  },
  {
    titulo: 'Cuota transparente',
    texto: 'Ves cuántas consultas llevas y cuándo se renuevan. Sin cargos sorpresa.',
    icon: ['M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z']
  }
];





const faq = [
  {
    p: '¿Cómo consulto una cédula?',
    r: 'Creas una cuenta, entras al panel y escribes los diez dígitos en la sección de identidad. La respuesta llega en segundos, con los datos tal como los devuelve la fuente oficial.'
  },
  {
    p: '¿Puedo buscar por nombres y apellidos?',
    r: 'Sí. La sección de búsqueda por nombre acepta nombres y apellidos y devuelve las coincidencias. Cuantos más datos aportes, menos resultados ambiguos obtendrás.'
  },
  {
    p: '¿Qué datos devuelve la consulta de cédula?',
    r: 'Nombres y apellidos completos, fecha de nacimiento, edad, género, nacionalidad, estado civil y lugar de nacimiento, cuando la fuente los publica.'
  },
  {
    p: '¿Hace falta registrarse?',
    r: 'Sí. Todas las consultas requieren una cuenta, porque cada una se descuenta de una cuota diaria asociada a tu usuario. El registro es gratuito y no pide tarjeta.'
  },
  {
    p: '¿Cuántas consultas incluye la cuenta gratuita?',
    r: 'La cuota depende de tu plan y se ve siempre en la cabecera del panel, junto al tiempo que falta para que se renueve. El contador vuelve a cero cada medianoche, hora de Ecuador.'
  },
  {
    p: '¿De dónde salen los datos y es legal consultarlos?',
    r: 'De registros públicos del Estado ecuatoriano: Registro Civil, SRI, ANT y Función Judicial. Son consultas que cualquier persona puede hacer en los portales oficiales; aquí se agrupan en un solo sitio para ahorrarte el recorrido. El uso que des a la información obtenida es responsabilidad tuya.'
  }
];

const enlacesLegales: { texto: string; href?: string; ruta?: string }[] = [
  { texto: 'Guías', ruta: '/guias' },
  { texto: 'Preguntas frecuentes', href: '#faq' },
  { texto: 'Contacto', ruta: '/contacto' },
  { texto: 'Términos', ruta: '/terminos' },
  { texto: 'Privacidad', ruta: '/privacidad' }
];


/*
 * FAQPage de la portada. Estaba escrito a mano en index.html, asi que se servia
 * en las once rutas; en las paginas de consulta chocaba con el suyo. Aqui se
 * inyecta y se retira con la vista, y sale del mismo array que se pinta abajo:
 * el marcado y lo visible no pueden desincronizarse.
 */
useDatosEstructurados(() => preguntas(faq));
</script>
