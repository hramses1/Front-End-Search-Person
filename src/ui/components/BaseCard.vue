<template>
  <component :is="as" class="glass-card" :class="padding">
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<{
  as?: string;
  /** Solo pasos de la escala: 16, 24, 32 px. */
  espaciado?: 'md' | 'lg' | 'xl';
}>(), { as: 'div', espaciado: 'lg' });

const padding = computed(() => ({ md: 'p-md', lg: 'p-lg', xl: 'p-xl' }[props.espaciado]));
</script>
