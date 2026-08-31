<template>
  <!--
    Logotipo. Se aisla en un componente para que sea identico en todas las
    vistas y para dejarlo FUERA del sistema de diseno: sus colores, su tamano
    y su tipografia no siguen los tokens y no deben migrarse.

    WCAG exime del requisito de contraste al texto que forma parte de un
    logotipo, asi que el degradado se mantiene tal cual.
  -->
  <div>
    <p class="text-[13px] leading-tight tracking-[0.15em] font-light uppercase" style="color: var(--text-primary);">
      {{ prefijo }}<br v-if="apilado" />
      <span class="font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFDD00] via-[#0033A0] to-[#ED1C24]">
        {{ titulo }}
      </span>
    </p>
    <div class="mt-2 flex gap-1">
      <div class="h-1 w-6 rounded-full bg-[#FFDD00]"></div>
      <div class="h-1 w-3 rounded-full bg-[#0033A0]"></div>
      <div class="h-1 w-2 rounded-full bg-[#ED1C24]"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  prefijo?: string;
  titulo?: string;
  /** Parte el rotulo en dos lineas, como en las barras laterales. */
  apilado?: boolean;
}>(), {
  prefijo: 'Portal de ',
  titulo: 'Consulta Ciudadana',
  apilado: false
});
</script>
