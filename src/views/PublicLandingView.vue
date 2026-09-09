<template>
  <div class="font-primary min-h-screen relative selection:bg-[var(--accent-color)]/30" style="background-color: var(--bg-color); color: var(--text-primary);">
    <a href="#contenido" class="salto-contenido">Saltar al contenido</a>

    <!--
      Cabecera: fondo de página, no kraft. El degradado bandera del
      logotipo (BrandMark, intocable) se afinó contra el papel y el
      carbón del tema oscuro; sobre un kraft intermedio el tramo azul
      pierde contraste y se vuelve ilegible. El kraft se reserva a
      superficies que no llevan el logotipo (pie, pestañas, etiquetas).
    -->
    <header class="border-b" style="border-color: var(--border-color);">
      <div class="max-w-5xl mx-auto px-lg sm:px-xl flex items-center justify-between py-lg">
        <BrandMark />
        <div class="flex items-center gap-sm">
          <button @click="toggleTheme" class="btn-icon" aria-label="Cambiar tema">
            <svg v-if="isDark" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-width="1.8" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"/></svg>
            <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-width="1.8" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
          </button>
          <button v-if="isAuthenticated" @click="router.push('/dashboard')" class="btn-secondary">Ir al panel</button>
          <button v-else @click="router.push('/auth')" class="btn-secondary">Acceder</button>
        </div>
      </div>
    </header>

    <div class="max-w-5xl mx-auto px-lg sm:px-xl">

      <!-- Portada: el titular a la izquierda, el expediente en vivo a la
           derecha. La demo es la tesis de la página entera: escribes una
           cédula y ves caer el sello, antes de que se te pida nada. -->
      <section id="contenido" class="py-2xl sm:py-3xl grid grid-cols-1 lg:grid-cols-2 gap-2xl items-center">
        <div>
          <h1 class="text-h3 sm:text-h2 font-extrabold leading-[1.1] tracking-tight">
            Verifica identidad, RUC, licencias y vehículos
            <span class="voz-sello text-[var(--accent-color)]">en un solo expediente</span>
          </h1>
          <p class="mt-lg text-body leading-relaxed text-[var(--text-secondary)] max-w-md">
            Registro Civil, SRI y ANT desde una misma pantalla. Escribes una cédula y recibes
            la ficha completa, sin saltar entre portales ni repetir captchas.
          </p>
          <div class="mt-xl flex flex-wrap gap-md">
            <button @click="router.push('/auth')" class="btn-primary">Crear cuenta gratis</button>
            <a href="#consultas" class="btn-secondary">Ver consultas</a>
          </div>
        </div>

        <div class="relative">
          <!-- Etiqueta de "en vivo": una pestaña de expediente clavada sobre
               la esquina de la hoja, no un texto flotando encima. -->
          <div
            class="absolute -top-3 left-lg z-10 inline-flex items-center gap-xs px-md py-xs rounded-base text-overline font-bold uppercase tracking-[0.1em]"
            style="background-color: var(--kraft-color); color: var(--kraft-ink); transform: rotate(-2deg);"
          >
            <span class="relative flex h-1.5 w-1.5" aria-hidden="true">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style="background-color: var(--estado-exito);"></span>
              <span class="relative inline-flex rounded-full h-1.5 w-1.5" style="background-color: var(--estado-exito);"></span>
            </span>
            En vivo, sin registro
          </div>
          <DemoCedula />
        </div>
      </section>

      <!-- Por qué: no son cuatro tarjetas iguales, son las líneas de un acta
           que se van marcando. -->
      <section class="pb-3xl">
        <div class="hoja-card p-lg sm:p-xl">
          <h2 class="text-h4 font-extrabold tracking-tight mb-lg">Por qué resolverlo aquí</h2>
          <ul class="divide-y" style="border-color: var(--border-color);">
            <li v-for="v in ventajas" :key="v.titulo" class="flex items-start gap-md py-md first:pt-0 last:pb-0">
              <svg class="w-5 h-5 shrink-0 mt-[2px] text-[var(--accent-color)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <h3 class="text-body font-bold tracking-wide">{{ v.titulo }}</h3>
                <p class="text-body leading-relaxed text-[var(--text-secondary)]">{{ v.texto }}</p>
              </div>
            </li>
          </ul>
        </div>
      </section>

      <!-- Catálogo de consultas: cada grupo es una carpeta con su propia
           pestaña; dentro, los ítems son renglones de un índice, no tarjetas
           repetidas. -->
      <section id="consultas" class="pb-3xl scroll-mt-xl">
        <h2 class="text-h4 font-extrabold tracking-tight mb-xl">Qué puedes averiguar</h2>

        <div v-for="grupo in GRUPOS" :key="grupo" class="mb-lg">
          <div class="inline-block px-md py-xs rounded-t-base text-overline font-bold uppercase tracking-[0.1em]"
               style="background-color: var(--kraft-color); color: var(--kraft-ink);">
            {{ grupo }}
          </div>
          <div class="hoja-card divide-y" style="border-top-left-radius: 0; border-color: var(--border-color);">
            <RouterLink
              v-for="item in porGrupo(grupo)" :key="item.slug"
              :to="`/${item.slug}`"
              class="flex items-center justify-between gap-md px-lg py-lg hover:bg-[var(--bg-color)]/60 transition-colors duration-base group"
            >
              <div>
                <h3 class="text-body font-bold tracking-wide">{{ item.titulo }}</h3>
                <p class="text-body leading-relaxed text-[var(--text-secondary)]">{{ item.texto }}</p>
              </div>
              <svg class="w-3.5 h-3.5 shrink-0 text-[var(--text-muted)] group-hover:text-[var(--accent-color)] transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </RouterLink>
          </div>
        </div>
      </section>

      <!-- Guías -->
      <section id="guias" class="pb-3xl scroll-mt-xl">
        <h2 class="text-h4 font-extrabold tracking-tight mb-xl">Cómo se leen los documentos ecuatorianos</h2>

        <div class="grid gap-sm sm:grid-cols-2">
          <RouterLink
            v-for="g in guiasDestacadas" :key="g.slug"
            :to="`/guias/${g.slug}`"
            class="hoja-card p-lg block hover:border-[var(--accent-color)]/40 transition-all duration-base"
          >
            <h3 class="text-body font-bold tracking-wide mb-xs">{{ g.titulo }}</h3>
            <p class="text-caption leading-relaxed text-[var(--text-secondary)] mb-sm">{{ g.resumen }}</p>
            <span class="inline-block px-sm py-[2px] rounded-base text-overline font-bold uppercase tracking-[0.08em]"
                  style="background-color: var(--kraft-color); color: var(--kraft-ink);">{{ g.categoria }}</span>
          </RouterLink>
        </div>

        <RouterLink to="/guias" class="btn-secondary mt-lg">Ver las {{ GUIAS.length }} guías</RouterLink>
      </section>

      <!-- Precio -->
      <section id="precio" class="pb-3xl scroll-mt-xl">
        <h2 class="text-h4 font-extrabold tracking-tight mb-xl">Gratis, con cuota diaria</h2>

        <div class="hoja-card p-lg sm:p-xl">
          <div class="flex flex-wrap items-baseline gap-md mb-lg">
            <span class="text-h2 font-extrabold tracking-tight text-[var(--accent-color)]">Gratis</span>
            <span class="text-body text-[var(--text-secondary)]">sin tarjeta y sin permanencia</span>
          </div>

          <ul class="grid gap-sm sm:grid-cols-2 mb-lg">
            <li v-for="v in ventajasPrecio" :key="v" class="flex items-start gap-sm text-body text-[var(--text-secondary)]">
              <svg class="w-4 h-4 shrink-0 mt-xs text-[var(--accent-color)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
              </svg>
              {{ v }}
            </li>
          </ul>

          <p class="text-caption leading-relaxed text-[var(--text-muted)] prose-limit">
            No cobramos por consulta ni vendemos paquetes de saldo. Tu cuota vuelve a cero cada
            medianoche, hora de Ecuador, y el día que no consultas no pierdes nada.
          </p>
        </div>
      </section>

      <section id="faq" class="pb-3xl scroll-mt-xl">
        <h2 class="text-h4 font-extrabold tracking-tight mb-xl">Preguntas frecuentes</h2>

        <div class="hoja-card divide-y" style="border-color: var(--border-color);">
          <div v-for="(f, i) in faq" :key="f.p">
            <button @click="faqAbierta = faqAbierta === i ? -1 : i" class="w-full flex items-center justify-between gap-md px-lg py-lg text-left">
              <span class="text-body font-bold tracking-wide">{{ f.p }}</span>
              <svg class="w-4 h-4 shrink-0 text-[var(--accent-color)] transition-transform duration-base" :class="faqAbierta === i ? 'rotate-45' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 5v14M5 12h14" />
              </svg>
            </button>
            <p v-if="faqAbierta === i" class="px-lg pb-lg text-body leading-relaxed text-[var(--text-secondary)]">{{ f.r }}</p>
          </div>
        </div>
      </section>

      <!-- Cierre -->
      <section class="pb-3xl">
        <div class="hoja-card p-lg sm:p-2xl text-center">
          <h2 class="text-lead sm:text-h4 font-extrabold tracking-tight mb-md">Crea tu cuenta y empieza a consultar</h2>
          <p class="text-body text-[var(--text-secondary)] max-w-md mx-auto mb-xl">
            El registro es gratuito y no pide tarjeta. Cada cuenta trae su cuota diaria de
            consultas, que vuelve a cero cada medianoche.
          </p>
          <button @click="router.push('/auth')" class="btn-primary">Crear cuenta gratis</button>
        </div>
      </section>
    </div>

    <!-- Pie: banda de carpeta, cierra la misma franja que abre la cabecera. -->
    <footer style="background-color: var(--kraft-color); color: var(--kraft-ink);">
      <div class="max-w-5xl mx-auto px-lg sm:px-xl py-2xl flex flex-col sm:flex-row items-center justify-between gap-lg">
        <div class="flex flex-wrap gap-x-lg gap-y-0 justify-center">
          <component
            v-for="l in enlacesLegales" :key="l.texto"
            :is="l.ruta ? 'button' : 'a'"
            :href="l.ruta ? undefined : l.href"
            @click="l.ruta && router.push(l.ruta)"
            class="enlace-menor"
            style="color: var(--kraft-ink);"
          >
            {{ l.texto }}
          </component>
        </div>
        <p class="text-overline uppercase tracking-[0.14em]">Devzio · {{ anio }}</p>
      </div>
    </footer>

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
import DemoCedula from '../ui/components/DemoCedula.vue';
import { useDatosEstructurados, preguntas } from '../composables/useDatosEstructurados';

const router = useRouter();
const { isAuthenticated, isDark, toggleTheme } = useAuth();

const anio = new Date().getFullYear();
const faqAbierta = ref(-1);

/** Cuatro guias en la portada; el resto, en el indice. */
const guiasDestacadas = GUIAS.slice(0, 4);

const ventajasPrecio = [
  'Cuota diaria que se renueva cada medianoche',
  'Acceso a las ocho consultas del catálogo',
  'Sin tarjeta de crédito ni permanencia',
  'Sin saldo que recargar ni consultas que caduquen'
];

const ventajas = [
  {
    titulo: 'Resultado inmediato',
    texto: 'La consulta se resuelve contra la fuente en el momento. Sin colas ni esperas.'
  },
  {
    titulo: 'Fuentes oficiales',
    texto: 'Registro Civil, SRI y ANT. No se inventa ni se completa nada por nuestra cuenta.'
  },
  {
    titulo: 'Un solo lugar',
    texto: 'Identidad, tributario, tránsito y judicial sin saltar entre portales distintos.'
  },
  {
    titulo: 'Cuota transparente',
    texto: 'Ves cuántas consultas llevas y cuándo se renuevan. Sin cargos sorpresa.'
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
  { texto: 'Precio', href: '#precio' },
  { texto: 'Guías', ruta: '/guias' },
  { texto: 'Estado', ruta: '/estado' },
  { texto: 'Preguntas frecuentes', href: '#faq' },
  { texto: 'Contacto', ruta: '/contacto' },
  { texto: 'Términos', ruta: '/terminos' },
  { texto: 'Privacidad', ruta: '/privacidad' },
  { texto: 'Bloquear mi información', ruta: '/bloquear-mi-informacion' },
  { texto: 'Novedades', ruta: '/novedades' }
];


/*
 * FAQPage de la portada. Estaba escrito a mano en index.html, asi que se servia
 * en las once rutas; en las paginas de consulta chocaba con el suyo. Aqui se
 * inyecta y se retira con la vista, y sale del mismo array que se pinta abajo:
 * el marcado y lo visible no pueden desincronizarse.
 */
useDatosEstructurados(() => preguntas(faq));
</script>
