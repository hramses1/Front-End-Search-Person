<template>
  <div class="space-y-md">
    <template v-for="(item, idx) in visibles" :key="idx">
      <slot :item="item" :idx="idx" />
    </template>

    <button
      v-if="items.length > UMBRAL"
      type="button"
      class="btn-tertiary"
      :aria-expanded="expandido"
      @click="expandido = !expandido"
    >
      {{ expandido ? 'Ver menos' : `Ver más (${items.length - LIMITE_INICIAL})` }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

/*
 * Mismo umbral en toda la app: con 3 o menos, se ven todos de una vez. Con
 * mas, solo aparecen los dos primeros y un boton para el resto, asi que una
 * lista larga no abruma la ficha completa con ruido visual.
 */
const UMBRAL = 3;
const LIMITE_INICIAL = 2;

const props = defineProps<{ items: any[] }>();
const expandido = ref(false);

/*
 * "Ver mas" revela el resto de la lista sin repetir los primeros dos: es el
 * mismo array completo, no una segunda copia de la cabecera.
 */
const visibles = computed(() =>
  props.items.length > UMBRAL && !expandido.value ? props.items.slice(0, LIMITE_INICIAL) : props.items
);
</script>
