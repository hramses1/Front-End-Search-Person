<template>
  <!--
    Boton flotante de soporte, fijo en toda la app (montado una sola vez
    desde App.vue). Va directo a WhatsApp con un mensaje ya escrito: es el
    mismo numero que usa la pagina de contacto (LegalView), asi que no hay
    dos canales distintos segun por donde se entre a pedir ayuda.

    Dos formas de no estorbar:
    - Se esconde al bajar (deslizandose fuera de la pantalla) y vuelve a
      aparecer al subir o al dejar de hacer scroll: mientras alguien lee una
      ficha larga de resultados no tiene un circulo verde tapando la esquina.
    - Un cierre pequeño lo apaga por lo que dure la pestaña (sessionStorage,
      igual que el resto de estado ligero de la app), para quien de plano no
      lo quiere ver mas en esta visita.
  -->
  <div
    v-if="!cerrado"
    class="fixed bottom-[6.5rem] right-lg z-[999] transition-all duration-base"
    :class="visible ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0 pointer-events-none'"
  >
    <div class="relative group">
      <button
        type="button"
        @click="cerrar"
        aria-label="Ocultar el botón de soporte"
        title="Ocultar"
        class="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full flex items-center justify-center text-caption leading-none opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity"
        style="background-color: var(--surface-color); border: 1px solid var(--border-color); color: var(--text-secondary);"
      >
        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path stroke-linecap="round" d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
      <a
        href="https://wa.me/593958652702?text=Hola%2C%20necesito%20ayuda%20con%20el%20Portal%20de%20Consulta%20Ciudadana"
        target="_blank"
        rel="noopener"
        aria-label="Soporte por WhatsApp"
        title="Soporte por WhatsApp"
        class="relative block w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95"
        style="background-color: #25D366;"
      >
        <!-- Anillo que respira cada tanto: la señal de "seguimos aquí",
             sin quedarse parpadeando todo el rato. -->
        <span class="anillo-soporte absolute inset-0 rounded-full" style="background-color: #25D366;" aria-hidden="true"></span>
        <span class="ola-soporte relative">
          <svg class="w-7 h-7" viewBox="0 0 24 24" fill="#FFFFFF" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884a9.82 9.82 0 0 1 6.988 2.896 9.83 9.83 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.82 11.82 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 0 0-3.48-8.413Z" />
          </svg>
        </span>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const CLAVE_CERRADO = 'soporte_oculto';

const cerrado = ref(sessionStorage.getItem(CLAVE_CERRADO) === '1');
const visible = ref(true);

const cerrar = () => {
  cerrado.value = true;
  sessionStorage.setItem(CLAVE_CERRADO, '1');
};

let ultimoScrollY = window.scrollY;
let temporizadorQuieto: ReturnType<typeof setTimeout> | undefined;

/*
 * Se esconde al bajar, sin importar cuanto: un scroll largo hacia un dato de
 * mas abajo no debe pasar por un tramo intermedio donde el boton reaparece.
 * Vuelve a aparecer al subir, y tambien un momento despues de quedarse
 * quieto (por si alguien llega directo al fondo de la pagina y ahi se
 * detiene, sin haber subido nunca).
 */
const alHacerScroll = () => {
  const actual = window.scrollY;
  const bajando = actual > ultimoScrollY;
  visible.value = !bajando || actual < 80;
  ultimoScrollY = actual;

  clearTimeout(temporizadorQuieto);
  temporizadorQuieto = setTimeout(() => { visible.value = true; }, 1200);
};

onMounted(() => window.addEventListener('scroll', alHacerScroll, { passive: true }));
onUnmounted(() => {
  window.removeEventListener('scroll', alHacerScroll);
  clearTimeout(temporizadorQuieto);
});
</script>

<style scoped>
/*
 * El icono saluda (como una mano) un instante cada pocos segundos, y el
 * resto del tiempo queda quieto: un vaiven constante cansa la vista, un
 * saludo de vez en cuando se lee como "seguimos aqui" sin ser ruidoso.
 */
@keyframes ola-soporte {
  0%, 82%, 100% { transform: rotate(0deg); }
  86% { transform: rotate(-16deg); }
  90% { transform: rotate(14deg); }
  94% { transform: rotate(-8deg); }
  98% { transform: rotate(4deg); }
}
.ola-soporte {
  display: inline-flex;
  transform-origin: 70% 70%;
  animation: ola-soporte 6s ease-in-out infinite;
}

/* El anillo se expande y se apaga junto con el saludo, no todo el rato. */
@keyframes anillo-soporte {
  0%, 82%, 100% { transform: scale(1); opacity: 0; }
  88% { opacity: 0.35; }
  98% { transform: scale(1.55); opacity: 0; }
}
.anillo-soporte {
  animation: anillo-soporte 6s ease-out infinite;
}
</style>
