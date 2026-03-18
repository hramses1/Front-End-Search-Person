<template>
  <div class="border rounded-2xl shadow-negative p-6 space-y-4 animate-pulse" style="background-color: var(--surface-color); border-color: var(--border-color);">
    <!-- Header Simulado -->
    <div class="flex justify-between items-center border-b pb-4 mb-2" style="border-color: var(--border-color);">
      <div class="h-3 w-32 rounded-full" style="background-color: var(--border-color);"></div>
      <div class="h-3 w-16 rounded-full" style="background-color: var(--border-color);"></div>
    </div>
    
    <!-- Grid de Datos Simulado -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div v-for="i in 4" :key="i" class="border rounded-xl p-5 space-y-3" style="background-color: var(--card-bg); border-color: var(--border-color);">
        <div class="space-y-2">
          <div class="h-2 w-20 rounded-full" style="background-color: var(--border-color);"></div>
          <div class="h-3 w-full rounded-full opacity-60" style="background-color: var(--border-color);"></div>
        </div>
        <div class="space-y-2 pt-2">
          <div class="h-2 w-24 rounded-full" style="background-color: var(--border-color);"></div>
          <div class="h-3 w-3/4 rounded-full opacity-60" style="background-color: var(--border-color);"></div>
        </div>
      </div>
    </div>
  </div>
</template>
