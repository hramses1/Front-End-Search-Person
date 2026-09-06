<template>
  <div class="font-primary min-h-screen relative selection:bg-[var(--accent-color)]/30"
       style="background-color: var(--bg-color); color: var(--text-primary);">
    <a href="#contenido" class="salto-contenido">Saltar al contenido</a>

    <div class="relative z-10 max-w-5xl mx-auto contenedor">

      <header class="flex items-center justify-between gap-md py-lg border-b border-[var(--border-color)]">
        <button
          @click="router.push('/')"
          class="inline-flex items-center min-h-[2.75rem] gap-sm text-caption text-[var(--text-secondary)] hover:text-[var(--accent-color)] transition-all"
        >
          <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Volver a la portada
        </button>
        <button
          @click="toggleTheme"
          aria-label="Cambiar tema"
          class="inline-flex items-center justify-center min-h-[2.75rem] min-w-[2.75rem] glass-panel rounded-base text-[var(--accent-color)] transition-transform"
        >
          <svg v-if="isDark" class="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"/>
          </svg>
          <svg v-else class="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
          </svg>
        </button>
      </header>

      <!--
        Migas visibles, no solo en el JSON-LD: el visitante que llega desde el
        buscador aterriza aqui sin haber pasado por la portada y necesita saber
        donde esta.
      -->
      <nav aria-label="Migas de pan" class="pt-lg">
        <ol class="flex flex-wrap items-center gap-xs text-caption text-[var(--text-muted)]">
          <li><RouterLink to="/" class="hover:text-[var(--accent-color)] transition-colors">Inicio</RouterLink></li>
          <li aria-hidden="true" class="opacity-50">/</li>
          <li>{{ consulta.grupo }}</li>
          <li aria-hidden="true" class="opacity-50">/</li>
          <li aria-current="page" class="text-[var(--text-secondary)]">{{ consulta.titulo }}</li>
        </ol>
      </nav>

      <main id="contenido">
        <section class="py-xl sm:py-2xl">
          <p class="text-overline font-bold tracking-[0.14em] uppercase text-[var(--accent-color)] mb-sm">
            {{ consulta.grupo }}
          </p>
          <h1 class="text-h2 font-light tracking-tight text-balance mb-md">{{ consulta.encabezado }}</h1>
          <p class="text-lead leading-relaxed text-[var(--text-secondary)] prose-limit">
            {{ consulta.entradilla }}
          </p>

          <div class="flex flex-wrap items-center gap-md mt-xl">
            <button class="btn-primary" @click="irAConsultar">Consultar ahora</button>
            <span class="text-caption text-[var(--text-muted)]">
              Cuenta gratuita, sin tarjeta
            </span>
          </div>
        </section>

        <!-- Qué necesitas y qué recibes -->
        <section class="grid gap-lg md:grid-cols-2 pb-2xl">
          <div class="glass-card p-lg">
            <h2 class="text-overline font-bold tracking-[0.14em] uppercase text-[var(--text-muted)] mb-md">
              Qué necesitas
            </h2>
            <p class="text-body leading-relaxed text-[var(--text-secondary)]">{{ consulta.requisito }}</p>
            <p class="text-caption text-[var(--text-muted)] mt-lg">
              Fuente: {{ consulta.fuente }}
            </p>
          </div>

          <div class="glass-card p-lg">
            <h2 class="text-overline font-bold tracking-[0.14em] uppercase text-[var(--text-muted)] mb-md">
              Qué recibes
            </h2>
            <!--
              Ejemplo real de respuesta. Es lo que convierte una pagina de
              aterrizaje en algo util: el visitante ve los campos antes de
              decidir si le sirve.
            -->
            <dl class="space-y-xs">
              <div
                v-for="fila in consulta.ejemplo" :key="fila[0]"
                class="flex items-baseline justify-between gap-md py-xs border-b border-[var(--border-color)] last:border-0"
              >
                <dt class="text-caption text-[var(--text-muted)] shrink-0">{{ fila[0] }}</dt>
                <dd class="text-caption font-medium text-[var(--text-primary)] text-right break-words">{{ fila[1] }}</dd>
              </div>
            </dl>
            <p class="text-overline uppercase tracking-[0.14em] text-[var(--text-muted)] mt-md">
              Ejemplo ilustrativo
            </p>
          </div>
        </section>

        <!-- Preguntas propias de esta consulta -->
        <section class="pb-2xl">
          <h2 class="text-h4 font-light tracking-tight mb-lg">Preguntas frecuentes</h2>
          <div class="space-y-sm">
            <div
              v-for="(f, i) in consulta.faq" :key="f.p"
              class="glass-card overflow-hidden"
            >
              <h3>
                <button
                  class="w-full flex items-center justify-between gap-md text-left px-lg min-h-[3.25rem] text-body font-medium transition-colors hover:text-[var(--accent-color)]"
                  :aria-expanded="abierta === i"
                  @click="abierta = abierta === i ? -1 : i"
                >
                  <span>{{ f.p }}</span>
                  <span aria-hidden="true" class="text-[var(--accent-color)] shrink-0 text-lead leading-none">
                    {{ abierta === i ? '−' : '+' }}
                  </span>
                </button>
              </h3>
              <p v-if="abierta === i" class="px-lg pb-lg text-body leading-relaxed text-[var(--text-secondary)] prose-limit">
                {{ f.r }}
              </p>
            </div>
          </div>
        </section>

        <!-- Otras consultas: enlace interno entre paginas hermanas -->
        <section class="pb-2xl">
          <h2 class="text-h4 font-light tracking-tight mb-lg">Otras consultas</h2>
          <div class="grid gap-sm sm:grid-cols-2 lg:grid-cols-3">
            <RouterLink
              v-for="otra in otras" :key="otra.slug"
              :to="`/${otra.slug}`"
              class="glass-card p-md block transition-all hover:border-[var(--accent-color)]"
            >
              <p class="text-overline uppercase tracking-[0.14em] text-[var(--text-muted)] mb-xs">{{ otra.grupo }}</p>
              <p class="text-body font-medium text-[var(--text-primary)] mb-xs">{{ otra.titulo }}</p>
              <p class="text-caption leading-relaxed text-[var(--text-secondary)]">{{ otra.texto }}</p>
            </RouterLink>
          </div>
        </section>

        <section class="pb-2xl">
          <div class="glass-card p-lg sm:p-xl text-center">
            <h2 class="text-h4 font-light tracking-tight mb-sm">{{ consulta.encabezado }}</h2>
            <p class="text-body leading-relaxed text-[var(--text-secondary)] mb-lg mx-auto prose-limit">
              El registro es gratuito y no pide tarjeta. Cada cuenta trae su cuota diaria de consultas,
              que vuelve a cero cada medianoche.
            </p>
            <button class="btn-primary" @click="irAConsultar">Crear cuenta gratis</button>
          </div>
        </section>
      </main>

      <footer class="border-t border-[var(--border-color)] py-2xl flex flex-col sm:flex-row items-center justify-between gap-lg">
        <div class="flex flex-wrap gap-x-lg gap-y-0 justify-center">
          <RouterLink v-for="l in enlacesLegales" :key="l.ruta" :to="l.ruta" class="enlace-menor">
            {{ l.texto }}
          </RouterLink>
        </div>
        <p class="text-overline uppercase tracking-[0.14em] text-[var(--text-muted)]">Devzio · {{ anio }}</p>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter, RouterLink } from 'vue-router';
import { POR_SLUG, CONSULTAS } from '../datos/consultas';
import { useAuth } from '../composables/useAuth';
import { useDatosEstructurados, migas, preguntas, repintarAlCambiar } from '../composables/useDatosEstructurados';

const route = useRoute();
const router = useRouter();
const { isDark, toggleTheme, isAuthenticated } = useAuth();

const anio = new Date().getFullYear();
const abierta = ref(-1);

/*
 * El slug viene de meta, no de params: las rutas son estaticas (/consultar-ruc),
 * no dinamicas (/:slug), asi que params siempre esta vacio. Se cayo en ese error
 * al montarlo y la pagina de RUC mostraba el contenido de cedula.
 */
const consulta = computed(() => POR_SLUG[String(route.meta.slug ?? '')] ?? CONSULTAS[0]);

/** Tres hermanas, empezando por las del mismo grupo. */
const otras = computed(() => {
  const resto = CONSULTAS.filter(c => c.slug !== consulta.value.slug);
  const mismas = resto.filter(c => c.grupo === consulta.value.grupo);
  return [...mismas, ...resto.filter(c => c.grupo !== consulta.value.grupo)].slice(0, 3);
});

/**
 * Con sesion se va directo a la seccion del panel; sin ella, al registro
 * guardando el destino para volver aqui despues.
 */
const irAConsultar = () => {
  if (isAuthenticated.value) {
    router.push({ name: 'dashboard', query: { seccion: consulta.value.seccion } });
  } else {
    router.push({ name: 'auth', query: { next: route.path } });
  }
};

const enlacesLegales = [
  { texto: 'Contacto', ruta: '/contacto' },
  { texto: 'Términos', ruta: '/terminos' },
  { texto: 'Privacidad', ruta: '/privacidad' }
];

/* Migas y preguntas van en un solo bloque: son dos grafos independientes. */
const { pintar } = useDatosEstructurados(() => [
  migas(`/${consulta.value.slug}`, consulta.value.titulo),
  preguntas(consulta.value.faq)
]);
repintarAlCambiar(computed(() => route.path), pintar);

/* Al saltar entre consultas hermanas, la pregunta abierta no debe quedarse. */
watch(() => route.path, () => { abierta.value = -1; });
</script>
