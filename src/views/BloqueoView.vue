<template>
  <div class="font-primary min-h-screen relative selection:bg-[var(--accent-color)]/30"
       style="background-color: var(--bg-color); color: var(--text-primary);">
    <a href="#contenido" class="salto-contenido">Saltar al contenido</a>

    <div class="relative z-10 max-w-2xl mx-auto contenedor">

      <header class="flex items-center justify-between gap-md py-lg border-b border-[var(--border-color)]">
        <button
          @click="irAVolver"
          class="inline-flex items-center min-h-[2.75rem] gap-sm text-caption text-[var(--text-secondary)] hover:text-[var(--accent-color)] transition-all"
        >
          <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          {{ etiquetaVolver }}
        </button>
        <button
          @click="toggleTheme"
          aria-label="Cambiar tema"
          class="inline-flex items-center justify-center min-h-[2.75rem] min-w-[2.75rem] hoja-panel rounded-base text-[var(--accent-color)] transition-transform"
        >
          <svg v-if="isDark" class="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"/>
          </svg>
          <svg v-else class="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
          </svg>
        </button>
      </header>

      <MigasDePan class="pt-lg" :pasos="[{ texto: 'Bloquear mi información' }]" />

      <main id="contenido">
        <section class="py-xl sm:py-2xl">
          <p class="text-overline font-bold tracking-[0.14em] uppercase text-[var(--accent-color)] mb-sm">Tus datos</p>
          <h1 class="text-h2 font-light tracking-tight text-balance mb-md">Bloquear mi información</h1>
          <p class="text-lead leading-relaxed text-[var(--text-secondary)] prose-limit">
            Si tu cédula, tu placa o tu RUC aparecen en nuestras consultas y quieres que dejen de
            mostrarse, puedes pedirlo aquí. Es tu derecho de oposición conforme a la LOPDP.
          </p>
        </section>

        <section class="pb-2xl grid gap-md sm:grid-cols-3">
          <div class="hoja-card p-lg">
            <p class="text-overline font-bold text-[var(--accent-color)] mb-xs">1</p>
            <p class="text-body font-medium mb-xs">Envías tu solicitud</p>
            <p class="text-caption leading-relaxed text-[var(--text-muted)]">
              Con el dato a bloquear y tu correo de contacto.
            </p>
          </div>
          <div class="hoja-card p-lg">
            <p class="text-overline font-bold text-[var(--accent-color)] mb-xs">2</p>
            <p class="text-body font-medium mb-xs">Verificamos la titularidad</p>
            <p class="text-caption leading-relaxed text-[var(--text-muted)]">
              Podemos pedirte una prueba, para evitar bloqueos pedidos por terceros.
            </p>
          </div>
          <div class="hoja-card p-lg">
            <p class="text-overline font-bold text-[var(--accent-color)] mb-xs">3</p>
            <p class="text-body font-medium mb-xs">Bloqueo permanente</p>
            <p class="text-caption leading-relaxed text-[var(--text-muted)]">
              El dato deja de aparecer en la web y en la API, de forma indefinida.
            </p>
          </div>
        </section>

        <section class="pb-2xl">
          <div class="hoja-card p-lg sm:p-xl">
            <form v-if="!enviado" @submit.prevent="enviar" class="space-y-lg" novalidate>
              <div>
                <label class="block text-caption font-medium mb-sm" style="color: var(--text-muted);">Qué dato quieres bloquear</label>
                <div class="flex flex-wrap gap-sm">
                  <button
                    v-for="t in tipos" :key="t.valor" type="button"
                    class="chip" :aria-pressed="tipo === t.valor"
                    @click="tipo = t.valor"
                  >{{ t.texto }}</button>
                </div>
              </div>

              <div>
                <label for="b_valor" class="block text-caption font-medium mb-xs" style="color: var(--text-muted);">
                  {{ etiquetaValor }}
                </label>
                <input
                  id="b_valor" v-model.trim="valor" type="text" required minlength="3" maxlength="20"
                  class="w-full min-h-[2.75rem] px-md bg-transparent border-b border-[var(--border-color)] outline-none font-body text-body text-[var(--text-primary)] transition-colors focus:border-[var(--accent-color)]"
                />
              </div>

              <div>
                <label for="b_email" class="block text-caption font-medium mb-xs" style="color: var(--text-muted);">Tu correo de contacto</label>
                <input
                  id="b_email" v-model.trim="email" type="email" required maxlength="120" autocomplete="email"
                  class="w-full min-h-[2.75rem] px-md bg-transparent border-b border-[var(--border-color)] outline-none font-body text-body text-[var(--text-primary)] transition-colors focus:border-[var(--accent-color)]"
                />
              </div>

              <div>
                <label for="b_prueba" class="block text-caption font-medium mb-xs" style="color: var(--text-muted);">
                  Cómo podemos verificar que eres el titular (opcional)
                </label>
                <textarea
                  id="b_prueba" v-model.trim="prueba" maxlength="500" rows="3"
                  placeholder="Por ejemplo, indica un dato que solo el titular conocería, o cómo prefieres que verifiquemos tu identidad."
                  class="w-full px-md py-sm bg-transparent border border-[var(--border-color)] rounded-base outline-none font-body text-body text-[var(--text-primary)] placeholder:text-[var(--text-muted)]/70 transition-colors focus:border-[var(--accent-color)] resize-y"
                ></textarea>
              </div>

              <p class="text-caption leading-relaxed text-[var(--text-muted)]">
                Declaras ser el titular de este dato, o su representante legal, y solicitas formalmente
                que deje de aparecer en nuestras consultas.
              </p>

              <p v-if="error" class="text-caption text-[var(--estado-error)]">{{ error }}</p>

              <button type="submit" class="btn-primary" :disabled="enviando">
                <span v-if="enviando" class="w-3 h-3 border-2 border-t-transparent rounded-full animate-spin border-current"></span>
                {{ enviando ? 'Enviando…' : 'Enviar solicitud' }}
              </button>
            </form>

            <div v-else class="flex items-start gap-md">
              <svg class="w-5 h-5 shrink-0 mt-xs" style="color: var(--estado-exito);" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <p class="text-body font-medium text-[var(--text-primary)]">Solicitud recibida</p>
                <p class="text-caption text-[var(--text-muted)] mt-xs">
                  La revisaremos y te escribiremos a {{ email }} para verificar la titularidad.
                </p>
              </div>
            </div>
          </div>

          <p class="text-caption leading-relaxed text-[var(--text-muted)] mt-lg prose-limit">
            No somos la fuente de estos datos: el bloqueo aplica a nuestro servicio, no a los
            registros oficiales del Registro Civil, el SRI o la ANT.
          </p>
        </section>
      </main>

      <footer class="border-t border-[var(--border-color)] py-2xl flex flex-col sm:flex-row items-center justify-between gap-lg">
        <div class="flex flex-wrap gap-x-lg gap-y-0 justify-center">
          <RouterLink to="/privacidad" class="enlace-menor">Privacidad</RouterLink>
          <RouterLink to="/contacto" class="enlace-menor">Contacto</RouterLink>
          <RouterLink to="/terminos" class="enlace-menor">Términos</RouterLink>
        </div>
        <p class="text-overline uppercase tracking-[0.14em] text-[var(--text-muted)]">Devzio · {{ anio }}</p>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { RouterLink } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import { authService } from '../api/authService';
import { useDatosEstructurados, migas } from '../composables/useDatosEstructurados';
import { useVolver } from '../composables/useVolver';
import MigasDePan from '../ui/components/MigasDePan.vue';

const { isDark, toggleTheme } = useAuth();
const anio = new Date().getFullYear();
const { etiquetaVolver, irAVolver } = useVolver();

type TipoBloqueo = 'cedula' | 'placa' | 'ruc';

const tipos: { valor: TipoBloqueo; texto: string }[] = [
  { valor: 'cedula', texto: 'Cédula' },
  { valor: 'placa', texto: 'Placa' },
  { valor: 'ruc', texto: 'RUC' }
];

const tipo = ref<TipoBloqueo>('cedula');
const valor = ref('');
const email = ref('');
const prueba = ref('');
const enviando = ref(false);
const enviado = ref(false);
const error = ref('');

const etiquetaValor = computed(() => ({
  cedula: 'Número de cédula',
  placa: 'Placa del vehículo',
  ruc: 'Número de RUC'
}[tipo.value]));

const enviar = async () => {
  error.value = '';
  if (valor.value.length < 3 || !email.value) {
    error.value = 'Completa el dato a bloquear y tu correo de contacto.';
    return;
  }
  enviando.value = true;
  try {
    await authService.solicitarBloqueo({
      tipo: tipo.value,
      valor: valor.value,
      solicitante_email: email.value,
      prueba: prueba.value || undefined
    });
    enviado.value = true;
  } catch (e: any) {
    error.value = e?.response?.data?.message || e?.message || 'No se pudo enviar la solicitud. Intenta de nuevo.';
  } finally {
    enviando.value = false;
  }
};

useDatosEstructurados(() => migas('/bloquear-mi-informacion', 'Bloquear mi información'));
</script>
