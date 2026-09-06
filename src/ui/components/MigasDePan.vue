<template>
  <!--
    Migas visibles. Quien llega desde el buscador aterriza en una página
    interior sin haber pasado por la portada, y necesita saber dónde está.

    El marcado JSON-LD equivalente lo pone cada vista con useDatosEstructurados:
    aquí solo va lo que se ve.
  -->
  <nav aria-label="Migas de pan">
    <ol class="flex flex-wrap items-center gap-xs text-caption text-[var(--text-muted)]">
      <li>
        <RouterLink to="/" class="hover:text-[var(--accent-color)] transition-colors">Inicio</RouterLink>
      </li>
      <template v-for="(paso, i) in pasos" :key="paso.texto">
        <li aria-hidden="true" class="opacity-50">/</li>
        <li v-if="paso.ruta && i < pasos.length - 1">
          <RouterLink :to="paso.ruta" class="hover:text-[var(--accent-color)] transition-colors">
            {{ paso.texto }}
          </RouterLink>
        </li>
        <li
          v-else
          :aria-current="i === pasos.length - 1 ? 'page' : undefined"
          class="text-[var(--text-secondary)]"
        >
          {{ paso.texto }}
        </li>
      </template>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';

defineProps<{
  /** Niveles después de Inicio. El último se marca como página actual. */
  pasos: { texto: string; ruta?: string }[];
}>();
</script>
