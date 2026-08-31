<template>
  <!--
    El estado nunca se comunica solo con color: cada variante trae su propio
    icono, de modo que sigue siendo legible sin percepcion cromatica.
  -->
  <span class="badge-base" :style="estilo">
    <svg v-if="icono" class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" :d="icono" />
    </svg>
    <slot />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<{
  variante?: 'neutro' | 'exito' | 'error' | 'aviso' | 'acento';
}>(), { variante: 'neutro' });

const ICONOS: Record<string, string> = {
  exito: 'M5 13l4 4L19 7',
  error: 'M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z',
  aviso: 'M12 9v4m0 4h.01M12 3a9 9 0 100 18 9 9 0 000-18z',
  neutro: '',
  acento: ''
};

const VARIABLES: Record<string, string> = {
  exito: 'var(--estado-exito)',
  error: 'var(--estado-error)',
  aviso: 'var(--estado-aviso)',
  acento: 'var(--accent-color)',
  neutro: 'var(--text-secondary)'
};

const icono = computed(() => ICONOS[props.variante] || '');
const estilo = computed(() => {
  const c = VARIABLES[props.variante];
  return { color: c, borderColor: c, backgroundColor: `color-mix(in srgb, ${c} 8%, transparent)` };
});
</script>
