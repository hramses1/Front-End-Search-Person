<template>
  <div class="relative inline-block" ref="anchorRef">
    <!--
      Boton nativo, no un div con role="button": a diferencia del disparador
      de ProfileDropdown (que lleva un avatar dentro y no puede ser <button>),
      aqui el contenido es solo el icono, asi que el elemento nativo ya trae
      gratis la activacion por teclado y el foco.
    -->
    <button
      type="button"
      class="inline-flex items-center justify-center min-h-[2.75rem] min-w-[2.75rem] rounded-base text-[var(--text-secondary)] hover:bg-white/5 hover:text-[var(--text-primary)] transition-all"
      :aria-expanded="abierto"
      aria-haspopup="menu"
      :aria-label="etiqueta"
      @click="alternar"
    >
      <svg class="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <circle cx="12" cy="5" r="1.75" />
        <circle cx="12" cy="12" r="1.75" />
        <circle cx="12" cy="19" r="1.75" />
      </svg>
    </button>

    <Teleport to="body">
      <div v-if="abierto" class="fixed inset-0 z-[9998]" @click="cerrar"></div>
      <transition
        enter-active-class="transition duration-150 ease-out" enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100" leave-active-class="transition duration-100 ease-in"
        leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95"
      >
        <div
          v-if="abierto"
          role="menu"
          :aria-label="etiqueta"
          class="fixed z-[9999] w-56 p-sm rounded-base border shadow-2xl bg-[var(--surface-color)] border-[var(--border-color)]"
          :style="{ top: posicion.top, left: posicion.left }"
        >
          <!-- El consumidor recibe `cerrar` para poder plegar el menu tras elegir una accion. -->
          <slot :cerrar="cerrar" />
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue';

withDefaults(defineProps<{ etiqueta?: string }>(), { etiqueta: 'Más acciones' });

const abierto = ref(false);
const anchorRef = ref<HTMLElement | null>(null);
const posicion = reactive({ top: '0px', left: '0px' });

const ANCHO_MENU = 224; // w-56

/*
 * Anclado a la derecha del boton, como el desplegable de perfil. Si esa
 * posicion se saldria del viewport (fila cerca del borde derecho), se
 * recorta contra el borde en vez de dejar el menu cortado fuera de pantalla.
 */
const actualizarPosicion = () => {
  if (!anchorRef.value) return;
  const rect = anchorRef.value.getBoundingClientRect();
  posicion.top = `${rect.bottom + 8}px`;
  posicion.left = `${Math.min(rect.right - ANCHO_MENU, window.innerWidth - ANCHO_MENU - 16)}px`;
};

const alternar = () => {
  if (!abierto.value) actualizarPosicion();
  abierto.value = !abierto.value;
};
const cerrar = () => { abierto.value = false; };

/*
 * Cierra ante Escape, redimension o scroll: la posicion se calcula una sola
 * vez al abrir (position: fixed sobre las coordenadas de ese momento), asi
 * que si la fila se mueve el menu quedaria flotando lejos de su disparador.
 */
const alPulsarTecla = (e: KeyboardEvent) => { if (e.key === 'Escape' && abierto.value) cerrar(); };

onMounted(() => {
  window.addEventListener('keydown', alPulsarTecla);
  window.addEventListener('resize', cerrar);
  window.addEventListener('scroll', cerrar, true);
});
onUnmounted(() => {
  window.removeEventListener('keydown', alPulsarTecla);
  window.removeEventListener('resize', cerrar);
  window.removeEventListener('scroll', cerrar, true);
});

defineExpose({ cerrar });
</script>
