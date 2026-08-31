<template>
  <div class="border rounded-base shadow-negative p-lg space-y-md animate-pulse" style="background-color: var(--surface-color); border-color: var(--border-color);">
    <!-- Header Simulado -->
    <div class="flex justify-between items-center border-b pb-md mb-sm" style="border-color: var(--border-color);">
      <div class="h-3 w-32 rounded-full" style="background-color: var(--border-color);"></div>
      <div class="h-3 w-16 rounded-full" style="background-color: var(--border-color);"></div>
    </div>
    
    <!-- Grid de Datos Simulado -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-md">
      <div v-for="i in 4" :key="i" class="border rounded-base p-lg space-y-md" style="background-color: var(--card-bg); border-color: var(--border-color);">
        <div class="space-y-sm">
          <div class="h-2 w-20 rounded-full" style="background-color: var(--border-color);"></div>
          <div class="h-3 w-full rounded-full text-[var(--text-secondary)]" style="background-color: var(--border-color);"></div>
        </div>
        <div class="space-y-sm pt-sm">
          <div class="h-2 w-24 rounded-full" style="background-color: var(--border-color);"></div>
          <div class="h-3 w-3/4 rounded-full text-[var(--text-secondary)]" style="background-color: var(--border-color);"></div>
        </div>
      </div>
    </div>
  </div>
</template>
