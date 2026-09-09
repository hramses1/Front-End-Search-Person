<template>
  <!--
    Aviso de que hay novedades sin ver. Al abrirse, no lleva a la pagina de
    novedades: es su propio panel flotante (mismo patron que DonationMenu),
    con las mas recientes ahi mismo y un enlace abajo para ver el resto.

    localStorage a proposito, no sessionStorage como el resto de la app: si
    se olvidara al cerrar la pestaña, avisaria de "nuevo" en cada sesion
    aunque el usuario ya lo hubiera visto ayer, que es justo lo que este
    boton existe para evitar.
  -->
  <div class="relative inline-block" ref="anchorRef">
    <button
      type="button"
      :aria-expanded="isOpen"
      aria-haspopup="dialog"
      aria-label="Novedades"
      title="Novedades"
      @click="toggle"
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
    </button>

    <Teleport to="body">
      <!-- Overlay para movil -->
      <transition name="fade">
        <div v-if="isOpen" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]" @click="close"></div>
      </transition>

      <transition
        enter-active-class="transition duration-base ease-out"
        enter-from-class="transform scale-95 opacity-0 translate-y-4 sm:translate-y-0"
        enter-to-class="transform scale-100 opacity-100 translate-y-0"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="transform scale-100 opacity-100 translate-y-0"
        leave-to-class="transform scale-95 opacity-0 translate-y-4 sm:translate-y-0"
      >
        <div
          v-if="isOpen"
          role="dialog"
          aria-modal="true"
          aria-label="Novedades"
          class="fixed z-[9999] w-[90%] max-w-sm sm:w-96 max-h-[80vh] flex flex-col rounded-base border shadow-2xl overflow-hidden bg-[var(--surface-color)] border-[var(--border-color)]"
          :style="isMobile ? mobileStyle : desktopStyle"
        >
          <div class="flex justify-between items-center gap-md px-lg py-md border-b border-[var(--border-color)] flex-shrink-0">
            <span class="text-body font-bold">Novedades</span>
            <button @click="close" aria-label="Cerrar" class="p-sm rounded-base hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" stroke-width="3"></path></svg>
            </button>
          </div>

          <div class="overflow-y-auto custom-scrollbar divide-y divide-[var(--border-color)]">
            <div v-for="n in recientes" :key="n.fecha + n.titulo" class="px-lg py-md">
              <time :datetime="n.fecha" class="text-caption text-[var(--text-muted)] uppercase tracking-[0.1em]">
                {{ formatoFecha(n.fecha) }}
              </time>
              <p class="text-body font-bold tracking-wide mt-xs">{{ n.titulo }}</p>
              <p class="text-caption leading-relaxed text-[var(--text-secondary)] mt-xs">{{ n.descripcion }}</p>
            </div>
          </div>

          <RouterLink
            to="/novedades"
            @click="close"
            class="text-center text-caption font-medium py-md border-t border-[var(--border-color)] text-[var(--accent-color)] hover:bg-[var(--accent-color)]/5 transition-colors flex-shrink-0"
          >
            Ver todas las novedades
          </RouterLink>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import { RouterLink } from 'vue-router';
import { NOVEDADES } from '../../datos/novedades';

/** 'panel': icono como los del dashboard (hoja-panel). 'publica': como el resto de la portada (btn-icon). */
withDefaults(defineProps<{ variante?: 'panel' | 'publica' }>(), { variante: 'publica' });

const CLAVE = 'novedades_vistas_hasta';
const ultimaFecha = NOVEDADES[0]?.fecha ?? '';
const recientes = NOVEDADES.slice(0, 5);

const vistaHasta = ref('');
try { vistaHasta.value = localStorage.getItem(CLAVE) ?? ''; } catch { /* privado o bloqueado: sin aviso persistente, no rompe nada */ }

const hayNuevas = computed(() => ultimaFecha > vistaHasta.value);

const marcarVistas = () => {
  vistaHasta.value = ultimaFecha;
  try { localStorage.setItem(CLAVE, ultimaFecha); } catch { /* idem */ }
};

const formatoFecha = (iso: string) => {
  const d = new Date(`${iso}T12:00:00`);
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString('es-EC', { day: 'numeric', month: 'short', year: 'numeric' });
};

const isOpen = ref(false);
const isMobile = ref(false);
const anchorRef = ref<HTMLElement | null>(null);
const desktopStyle = reactive({ top: '0px', left: '0px' });
const mobileStyle = { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };

const checkMobile = () => { isMobile.value = window.innerWidth < 640; };

const updatePosition = () => {
  if (anchorRef.value && !isMobile.value) {
    const rect = anchorRef.value.getBoundingClientRect();
    desktopStyle.top = `${rect.bottom + 12}px`;
    desktopStyle.left = `${Math.max(rect.right - 384, 12)}px`;
  }
};

const toggle = () => {
  checkMobile();
  if (!isOpen.value) {
    updatePosition();
    marcarVistas();
  }
  isOpen.value = !isOpen.value;
};

const close = () => { isOpen.value = false; };

const alPulsarTecla = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && isOpen.value) close();
};

onMounted(() => {
  checkMobile();
  window.addEventListener('resize', checkMobile);
  window.addEventListener('resize', updatePosition);
  window.addEventListener('keydown', alPulsarTecla);
});
onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
  window.removeEventListener('resize', updatePosition);
  window.removeEventListener('keydown', alPulsarTecla);
});
</script>
