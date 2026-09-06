<template>
  <!--
    Estado vacío. Estaba escrito a mano en tres sitios con maquetación distinta
    en cada uno: el panel de resultados, la lista de usuarios y la de planes.
    Unificarlo evita que el siguiente que se añada invente una cuarta versión.

    El icono es decorativo: lo que informa es el título, así que va aria-hidden.
  -->
  <div
    class="flex flex-col items-center justify-center text-center p-xl"
    :class="compacto ? 'min-h-[160px]' : 'min-h-[320px] sm:min-h-[420px]'"
  >
    <div
      v-if="!compacto"
      class="w-20 h-20 rounded-full flex items-center justify-center mb-lg bg-[var(--accent-color)]/5"
      aria-hidden="true"
    >
      <svg class="w-9 h-9 text-[var(--accent-color)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" :d="icono" />
      </svg>
    </div>

    <p class="text-body text-[var(--text-primary)]">{{ titulo }}</p>

    <p v-if="detalle" class="text-caption leading-relaxed text-[var(--text-muted)] mt-sm max-w-[42ch]">
      {{ detalle }}
    </p>

    <!-- La acción es opcional: un vacío sin salida no necesita botón. -->
    <button v-if="accion" type="button" class="btn-secondary mt-lg" @click="$emit('accion')">
      {{ accion }}
    </button>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  titulo: string;
  /** Segunda línea, para explicar por qué está vacío o qué hacer. */
  detalle?: string;
  /** Texto del botón. Sin él no se pinta ninguno. */
  accion?: string;
  /** Trazado del icono. Por defecto, un documento. */
  icono?: string;
  /** Sin icono y con menos alto, para vacíos dentro de una tabla. */
  compacto?: boolean;
}>(), {
  icono: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  compacto: false
});

defineEmits<{ accion: [] }>();
</script>
