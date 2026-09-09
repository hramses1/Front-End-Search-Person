<template>
  <div class="font-primary min-h-screen relative selection:bg-[var(--accent-color)]/30"
       style="background-color: var(--bg-color); color: var(--text-primary);">
    <a href="#contenido" class="salto-contenido">Saltar al contenido</a>

    <div class="relative z-10 max-w-3xl mx-auto contenedor">

      <header class="flex items-center justify-between gap-md py-lg border-b border-[var(--border-color)]">
        <button
          @click="irAVolver"
          class="inline-flex items-center min-h-[2.75rem] gap-sm text-caption text-[var(--text-secondary)] hover:text-[var(--accent-color)] transition-all"
        >
          <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          {{ etiquetaVolver }}
        </button>
        <button
          @click="toggleTheme"
          aria-label="Cambiar tema"
          class="inline-flex items-center justify-center min-h-[2.75rem] min-w-[2.75rem] hoja-panel rounded-base text-[var(--accent-color)] transition-transform"
        >
          <svg v-if="isDark" class="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"/>
          </svg>
          <svg v-else class="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
          </svg>
        </button>
      </header>

      <MigasDePan class="pt-lg" :pasos="[{ texto: 'Novedades' }]" />

      <main id="contenido">
        <section class="py-xl sm:py-2xl">
          <h1 class="text-h2 font-light tracking-tight text-balance mb-md">Qué ha cambiado</h1>
          <p class="text-lead leading-relaxed text-[var(--text-secondary)] prose-limit">
            Un registro de lo que vamos añadiendo y corrigiendo, en el mismo lenguaje con el que
            lo contaríamos si preguntaras.
          </p>
        </section>

        <section class="pb-3xl">
          <ol class="space-y-2xl">
            <li v-for="n in NOVEDADES" :key="n.titulo" class="relative pl-xl border-l border-[var(--border-color)]">
              <span
                class="absolute -left-[5px] top-1 w-[9px] h-[9px] rounded-full bg-[var(--accent-color)]"
                aria-hidden="true"
              ></span>
              <time :datetime="n.fecha" class="text-overline uppercase tracking-[0.14em] text-[var(--text-muted)] block mb-xs">
                {{ formatoFecha(n.fecha) }}
              </time>
              <h2 class="text-body font-bold tracking-wide mb-xs">{{ n.titulo }}</h2>
              <p class="text-body leading-relaxed text-[var(--text-secondary)]">{{ n.descripcion }}</p>
            </li>
          </ol>
        </section>
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
import { RouterLink } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import { useDatosEstructurados, migas } from '../composables/useDatosEstructurados';
import { useVolver } from '../composables/useVolver';
import { NOVEDADES } from '../datos/novedades';
import MigasDePan from '../ui/components/MigasDePan.vue';

const { isDark, toggleTheme } = useAuth();
const anio = new Date().getFullYear();
const { etiquetaVolver, irAVolver } = useVolver();

const formatoFecha = (iso: string) => {
  const d = new Date(`${iso}T12:00:00`);
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString('es-EC', { day: 'numeric', month: 'long', year: 'numeric' });
};

useDatosEstructurados(() => migas('/novedades', 'Novedades'));
</script>
