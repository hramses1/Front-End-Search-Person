<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[clase, bloque ? 'w-full' : '']"
    :aria-busy="loading ? 'true' : undefined"
  >
    <!--
      Todo boton que dispara una accion asincrona muestra su estado: nunca se
      queda mudo. El texto se sustituye por el de carga para que el ancho no
      salte y el lector de pantalla anuncie el cambio.
    -->
    <svg
      v-if="loading"
      class="w-4 h-4 shrink-0 animate-spin"
      viewBox="0 0 24 24" fill="none" aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2.5" class="opacity-25" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
    </svg>

    <slot v-if="!loading" name="icono" />
    <span>{{ loading ? textoCarga : undefined }}<slot v-if="!loading" /></span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<{
  /** primario relleno, secundario contorno, terciario texto, icono cuadrado */
  variante?: 'primario' | 'secundario' | 'terciario' | 'icono';
  type?: 'button' | 'submit';
  loading?: boolean;
  disabled?: boolean;
  bloque?: boolean;
  /** Verbo + beneficio. Nunca "Enviar" a secas. */
  textoCarga?: string;
}>(), {
  variante: 'secundario',
  type: 'button',
  loading: false,
  disabled: false,
  bloque: false,
  textoCarga: 'Procesando…'
});

const clase = computed(() => ({
  primario: 'btn-primary',
  secundario: 'btn-secondary',
  terciario: 'btn-tertiary',
  icono: 'btn-icon'
}[props.variante]));
</script>
