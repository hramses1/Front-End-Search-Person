<template>
  <div class="font-primary min-h-screen relative selection:bg-[var(--accent-color)]/30"
       style="background-color: var(--bg-color); color: var(--text-primary);">
    <a href="#contenido" class="salto-contenido">Saltar al contenido</a>

    <div class="relative z-10 max-w-4xl mx-auto contenedor">

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

      <nav aria-label="Migas de pan" class="pt-lg">
        <ol class="flex flex-wrap items-center gap-xs text-caption text-[var(--text-muted)]">
          <li><RouterLink to="/" class="hover:text-[var(--accent-color)] transition-colors">Inicio</RouterLink></li>
          <li aria-hidden="true" class="opacity-50">/</li>
          <li v-if="guia">
            <RouterLink to="/guias" class="hover:text-[var(--accent-color)] transition-colors">Guías</RouterLink>
          </li>
          <li v-else aria-current="page" class="text-[var(--text-secondary)]">Guías</li>
          <template v-if="guia">
            <li aria-hidden="true" class="opacity-50">/</li>
            <li aria-current="page" class="text-[var(--text-secondary)]">{{ guia.categoria }}</li>
          </template>
        </ol>
      </nav>

      <main id="contenido">
        <!-- Índice de guías -->
        <template v-if="!guia">
          <section class="py-xl sm:py-2xl">
            <p class="text-overline font-bold tracking-[0.14em] uppercase text-[var(--accent-color)] mb-sm">Guías</p>
            <h1 class="text-h2 font-light tracking-tight text-balance mb-md">
              Entender los datos públicos del Ecuador
            </h1>
            <p class="text-lead leading-relaxed text-[var(--text-secondary)] prose-limit">
              Explicaciones cortas para saber qué significa cada dato antes de consultarlo: cédula, RUC,
              multas, licencia y vehículos.
            </p>
          </section>

          <section v-for="cat in categorias" :key="cat" class="pb-2xl">
            <p class="text-overline font-bold tracking-[0.14em] uppercase text-[var(--text-muted)] mb-md">{{ cat }}</p>
            <div class="grid gap-sm sm:grid-cols-2">
              <RouterLink
                v-for="g in porCategoria(cat)" :key="g.slug"
                :to="`/guias/${g.slug}`"
                class="glass-card p-lg block hover:border-[var(--accent-color)]/40 hover:-translate-y-0.5 transition-all duration-base"
              >
                <h2 class="text-body font-bold tracking-wide mb-xs">{{ g.titulo }}</h2>
                <p class="text-caption leading-relaxed text-[var(--text-secondary)]">{{ g.resumen }}</p>
              </RouterLink>
            </div>
          </section>
        </template>

        <!-- Una guía -->
        <template v-else>
          <article class="py-xl sm:py-2xl">
            <p class="text-overline font-bold tracking-[0.14em] uppercase text-[var(--accent-color)] mb-sm">
              {{ guia.categoria }}
            </p>
            <h1 class="text-h2 font-light tracking-tight text-balance mb-md">{{ guia.titulo }}</h1>
            <p class="text-lead leading-relaxed text-[var(--text-secondary)] prose-limit mb-2xl">
              {{ guia.resumen }}
            </p>

            <div class="space-y-lg prose-limit">
              <p
                v-for="(par, i) in guia.cuerpo" :key="i"
                class="text-body leading-relaxed text-[var(--text-secondary)]"
              >
                {{ par }}
              </p>
            </div>
          </article>

          <!-- Consultas que resuelven lo que la guía explica -->
          <section v-if="relacionadas.length" class="pb-2xl">
            <h2 class="text-h4 font-light tracking-tight mb-lg">Consultas relacionadas</h2>
            <div class="grid gap-sm sm:grid-cols-2 lg:grid-cols-3">
              <RouterLink
                v-for="c in relacionadas" :key="c.slug"
                :to="`/${c.slug}`"
                class="glass-card p-md block transition-all hover:border-[var(--accent-color)]"
              >
                <p class="text-overline uppercase tracking-[0.14em] text-[var(--text-muted)] mb-xs">{{ c.grupo }}</p>
                <p class="text-body font-medium text-[var(--text-primary)] mb-xs">{{ c.titulo }}</p>
                <p class="text-caption leading-relaxed text-[var(--text-secondary)]">{{ c.texto }}</p>
              </RouterLink>
            </div>
          </section>

          <section class="pb-2xl">
            <h2 class="text-h4 font-light tracking-tight mb-lg">Otras guías</h2>
            <div class="grid gap-sm sm:grid-cols-2">
              <RouterLink
                v-for="o in otrasGuias" :key="o.slug"
                :to="`/guias/${o.slug}`"
                class="glass-card p-md block transition-all hover:border-[var(--accent-color)]"
              >
                <p class="text-overline uppercase tracking-[0.14em] text-[var(--text-muted)] mb-xs">{{ o.categoria }}</p>
                <p class="text-body font-medium text-[var(--text-primary)]">{{ o.titulo }}</p>
              </RouterLink>
            </div>
          </section>
        </template>
      </main>

      <footer class="border-t border-[var(--border-color)] py-2xl flex flex-col sm:flex-row items-center justify-between gap-lg">
        <div class="flex flex-wrap gap-x-lg gap-y-0 justify-center">
          <RouterLink to="/guias" class="enlace-menor">Guías</RouterLink>
          <RouterLink to="/contacto" class="enlace-menor">Contacto</RouterLink>
          <RouterLink to="/terminos" class="enlace-menor">Términos</RouterLink>
          <RouterLink to="/privacidad" class="enlace-menor">Privacidad</RouterLink>
        </div>
        <p class="text-overline uppercase tracking-[0.14em] text-[var(--text-muted)]">Devzio · {{ anio }}</p>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter, RouterLink } from 'vue-router';
import { GUIAS, GUIA_POR_SLUG } from '../datos/guias';
import { POR_SLUG } from '../datos/consultas';
import { useAuth } from '../composables/useAuth';
import { useDatosEstructurados, migas, repintarAlCambiar } from '../composables/useDatosEstructurados';

const route = useRoute();
const router = useRouter();
const { isDark, toggleTheme } = useAuth();
const anio = new Date().getFullYear();

/**
 * Sin slug se pinta el índice; con él, la guía.
 *
 * El slug viene de meta, no de params: las rutas son estáticas (/guias/x), no
 * dinámicas (/guias/:slug), así que params siempre está vacío.
 */
const guia = computed(() => GUIA_POR_SLUG[String(route.meta.slug ?? '')] ?? null);

const categorias = computed(() => [...new Set(GUIAS.map(g => g.categoria))]);
const porCategoria = (cat: string) => GUIAS.filter(g => g.categoria === cat);

const relacionadas = computed(() =>
  (guia.value?.relacionadas ?? []).map(s => POR_SLUG[s]).filter(Boolean)
);

const otrasGuias = computed(() =>
  GUIAS.filter(g => g.slug !== guia.value?.slug).slice(0, 4)
);

const { pintar } = useDatosEstructurados(() => {
  if (!guia.value) {
    return migas('/guias', 'Guías');
  }
  return [
    migas(`/guias/${guia.value.slug}`, guia.value.titulo, { nombre: 'Guías', ruta: '/guias' }),
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: guia.value.titulo,
      description: guia.value.descripcion,
      inLanguage: 'es-EC',
      articleSection: guia.value.categoria,
      author: { '@type': 'Organization', name: 'Devzio', url: 'https://devzio.site' },
      publisher: { '@type': 'Organization', name: 'Devzio', url: 'https://devzio.site' },
      mainEntityOfPage: `https://devzio.site/guias/${guia.value.slug}`
    }
  ];
});
repintarAlCambiar(computed(() => route.path), pintar);
</script>
