<template>
  <!--
    Logotipo. Se extrae a componente para que sea identico en todas las vistas
    y para aislarlo del sistema de diseno: los colores de la bandera y la
    tipografia de esta marca NO siguen los tokens y no deben tocarse.

    WCAG exime del requisito de contraste al texto que forma parte de un
    logotipo, asi que el degradado se queda tal cual.
  -->
  <div>
    <p class="text-[13px] leading-tight tracking-[0.15em] font-light uppercase">
      Portal de
      <span class="font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFDD00] via-[#0033A0] to-[#ED1C24]">
        Consulta Ciudadana
      </span>
    </p>
    <div class="mt-2 flex gap-1">
      <div class="h-1 w-6 rounded-full bg-[#FFDD00]"></div>
      <div class="h-1 w-3 rounded-full bg-[#0033A0]"></div>
      <div class="h-1 w-2 rounded-full bg-[#ED1C24]"></div>
    </div>
  </div>
</template>
