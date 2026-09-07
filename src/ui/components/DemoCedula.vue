<template>
  <!--
    Demo publica de cedula, contra /api/main/demo/id_card/: sin sesion,
    5 al dia por IP. Nombre, apellido y cedula llegan en claro; el resto
    enmascarado. Es lo que convierte esta pagina en un escaparate en vez
    de en una promesa: el visitante ve que funciona antes de registrarse.
  -->
  <div class="glass-card p-lg sm:p-xl">
    <p class="text-overline font-bold tracking-[0.14em] uppercase text-[var(--accent-color)] mb-xs">
      Pruébalo ahora
    </p>
    <h2 class="text-lead font-light tracking-tight mb-md">Consulta una cédula sin registrarte</h2>

    <form @submit.prevent="consultar" class="flex flex-col sm:flex-row gap-sm mb-lg" novalidate>
      <div class="flex-1">
        <label for="demo_ci" class="sr-only">Número de cédula</label>
        <input
          id="demo_ci" v-model="ci" type="text" inputmode="numeric" maxlength="10"
          placeholder="Diez dígitos, ej. 0912345678"
          class="w-full min-h-[2.75rem] px-md bg-transparent border-b border-[var(--border-color)] outline-none font-body text-body text-[var(--text-primary)] transition-colors focus:border-[var(--accent-color)]"
        />
      </div>
      <button type="submit" class="btn-primary shrink-0" :disabled="cargando">
        <span v-if="cargando" class="w-3 h-3 border-2 border-t-transparent rounded-full animate-spin border-current"></span>
        {{ cargando ? 'Consultando…' : 'Probar gratis' }}
      </button>
    </form>

    <p v-if="error" class="text-caption text-[var(--estado-error)] mb-md">{{ error }}</p>

    <!--
      Resultado real. Nombre, apellido y cedula en claro; el resto llega
      enmascarado desde el backend y aqui se sustituye por un aviso, en vez
      de mostrar el texto con asteriscos, que se lee como un error.
    -->
    <div v-if="resultado" class="border-t border-[var(--border-color)] pt-lg">
      <p class="text-lead font-medium text-[var(--text-primary)]">
        {{ resultado.Nombre }} {{ resultado.Apellido }}
      </p>
      <p class="text-caption text-[var(--text-muted)] mb-lg">Cédula {{ resultado.Ci }}</p>

      <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-lg gap-y-sm">
        <div v-for="campo in camposOcultos" :key="campo.clave" class="flex items-center justify-between gap-md py-xs border-b border-[var(--border-color)]">
          <dt class="text-caption text-[var(--text-muted)]">{{ campo.etiqueta }}</dt>
          <dd class="inline-flex items-center gap-xs text-caption font-medium text-[var(--accent-color)]">
            <svg class="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Requiere cuenta
          </dd>
        </div>
      </dl>

      <div class="glass-panel p-lg mt-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-md">
        <p class="text-body text-[var(--text-secondary)]">
          Regístrate gratis para ver {{ camposOcultos.length === 1 ? 'este dato' : 'estos datos' }}, sin tarjeta.
        </p>
        <button type="button" class="btn-primary shrink-0" @click="irARegistro">Crear cuenta gratis</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { authService } from '../../api/authService';

const router = useRouter();
const route = useRoute();

const ci = ref('');
const cargando = ref(false);
const error = ref('');
const resultado = ref<Record<string, string> | null>(null);

/** Etiquetas de los campos que la demo devuelve enmascarados. */
const ETIQUETAS: Record<string, string> = {
  FechaNacimiento: 'Fecha de nacimiento',
  Edad: 'Edad',
  Genero: 'Género',
  EstadoCivil: 'Estado civil',
  Nacionalidad: 'Nacionalidad',
  Ciudad: 'Ciudad',
  Direccion: 'Dirección',
  Clase: 'Clase',
  TipoIdentificacion: 'Tipo de identificación'
};

/*
 * Un campo cuenta como oculto si trae dos o mas asteriscos seguidos: es lo
 * que el backend usa para enmascarar, tanto en un valor entero ("****")
 * como en uno parcial ("G****s"). Nombre, Apellido y Ci nunca lo llevan.
 */
const camposOcultos = computed(() => {
  if (!resultado.value) return [];
  return Object.entries(resultado.value)
    .filter(([clave, valor]) => clave in ETIQUETAS && /\*{2,}/.test(String(valor)))
    .map(([clave]) => ({ clave, etiqueta: ETIQUETAS[clave] }));
});

const consultar = async () => {
  error.value = '';
  resultado.value = null;
  const limpio = ci.value.trim();
  if (!/^\d{10}$/.test(limpio)) {
    error.value = 'Escribe los diez dígitos de la cédula, sin espacios ni guiones.';
    return;
  }
  cargando.value = true;
  try {
    resultado.value = await authService.consultaDemo(limpio);
  } catch (e: any) {
    const estado = e?.response?.status;
    if (estado === 429) {
      error.value = 'Ya usaste las 5 pruebas gratis de hoy desde esta conexión. Vuelve mañana, o crea una cuenta para consultar sin ese límite.';
    } else if (estado === 404) {
      error.value = 'No encontramos esa cédula.';
    } else {
      error.value = e?.message || 'No se pudo completar la prueba. Intenta de nuevo.';
    }
  } finally {
    cargando.value = false;
  }
};

/** Al registrarse se vuelve a esta misma página, ya con cuenta y sin límite. */
const irARegistro = () => {
  router.push({ name: 'auth', query: { next: route.path, registro: '1' } });
};
</script>
