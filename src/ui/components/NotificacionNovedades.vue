<template>
  <!--
    Aviso de que hay novedades sin ver. localStorage a proposito, no
    sessionStorage como el resto de la app: si se olvidara al cerrar la
    pestaña, avisaria de "nuevo" en cada sesion aunque el usuario ya lo
    hubiera visto ayer, que es justo lo que este boton existe para evitar.
  -->
  <RouterLink
    to="/novedades"
    @click="marcarVistas"
    aria-label="Novedades"
    title="Novedades"
    class="relative"
    :class="variante === 'panel'
      ? 'control-encabezado-icono hoja-panel hover:bg-white/5 transition-all text-[var(--accent-color)] active:scale-90'
      : 'btn-icon'"
  >
    <svg :class="variante === 'panel' ? 'w-[18px] h-[18px]' : 'w-4 h-4'" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
    <span
      v-if="hayNuevas"
      class="absolute top-1 right-1 w-2 h-2 rounded-full"
      style="background-color: var(--accent-color); box-shadow: 0 0 0 2px var(--surface-color);"
      aria-hidden="true"
    ></span>
  </RouterLink>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { RouterLink } from 'vue-router';
import { NOVEDADES } from '../../datos/novedades';

/** 'panel': icono como los del dashboard (hoja-panel). 'publica': como el resto de la portada (btn-icon). */
withDefaults(defineProps<{ variante?: 'panel' | 'publica' }>(), { variante: 'publica' });

const CLAVE = 'novedades_vistas_hasta';
const ultimaFecha = NOVEDADES[0]?.fecha ?? '';

const vistaHasta = ref('');
try { vistaHasta.value = localStorage.getItem(CLAVE) ?? ''; } catch { /* privado o bloqueado: sin aviso persistente, no rompe nada */ }

const hayNuevas = computed(() => ultimaFecha > vistaHasta.value);

const marcarVistas = () => {
  vistaHasta.value = ultimaFecha;
  try { localStorage.setItem(CLAVE, ultimaFecha); } catch { /* idem */ }
};
</script>
