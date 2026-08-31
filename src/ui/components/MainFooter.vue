<template>
  <footer class="mt-auto pt-sm border-t border-[var(--border-color)] flex flex-col sm:flex-row items-center justify-between gap-md pb-md relative">
    <!-- Copyright & Legal -->
    <div class="flex items-center gap-md order-2 sm:order-1 flex-wrap justify-center">
      <span class="text-caption font-black text-[var(--text-secondary)] tracking-[0.14em] uppercase">© {{ anio }} Devzio</span>
      <div class="h-3 w-[1.5px] bg-[var(--border-color)] text-[var(--text-muted)]"></div>

      <!--
        Antes esto abria dos modales con textos legales propios, distintos de
        los publicados en /privacidad y /terminos. Uno de ellos afirmaba que no
        se almacenan registros de consultas, algo que no esta verificado.
        Ahora hay una sola version de cada documento.
      -->
      <button
        v-for="l in legales" :key="l.ruta"
        @click="router.push(l.ruta)"
        class="text-caption font-bold tracking-[0.15em] uppercase text-[var(--text-muted)] hover:text-[var(--accent-color)] transition-all"
      >
        {{ l.texto }}
      </button>
    </div>

    <!-- Actions (LinkedIn & Scroll) -->
    <div class="flex items-center gap-sm order-1 sm:order-2">
      <a
        href="https://www.linkedin.com/in/hector-arismendi-469551167/"
        target="_blank"
        rel="noopener noreferrer"
        class="btn-icon border border-[var(--border-color)] text-[var(--text-muted)] hover:border-[var(--accent-color)] hover:text-[var(--accent-color)]"
        title="LinkedIn"
      >
        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path></svg>
      </a>

      <button
        @click="scrollToTop"
        class="btn-icon border border-[var(--border-color)] text-[var(--text-muted)] hover:border-[var(--accent-color)] hover:text-[var(--accent-color)] group"
        title="Volver arriba"
      >
        <svg class="w-3 h-3 group-hover:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>
      </button>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();
const anio = new Date().getFullYear();

const legales = [
  { texto: 'Privacidad', ruta: '/privacidad' },
  { texto: 'Términos', ruta: '/terminos' },
  { texto: 'Contacto', ruta: '/contacto' }
];

const scrollToTop = () => {
  const mainContent = document.querySelector('main');
  if (mainContent) {
    mainContent.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};
</script>
