<template>
  <!--
    Demo publica de cedula, contra /api/main/demo/id_card/: sin sesion, con
    un cupo diario por IP que cuenta el propio backend (no se fija aqui el
    numero, para no tener que sincronizarlo si cambia). Nombre, apellido y
    cedula llegan en claro; el resto enmascarado. Es lo que convierte esta
    pagina en un escaparate en vez de en una promesa: el visitante ve que
    funciona antes de registrarse.
  -->
  <div class="hoja-card p-lg sm:p-xl">
    <h2 class="text-lead font-bold tracking-tight mb-md">Consulta una cédula sin registrarte</h2>

    <form @submit.prevent="consultar" class="flex flex-col sm:flex-row gap-sm mb-lg" novalidate>
      <div class="flex-1">
        <label for="demo_ci" class="sr-only">Número de cédula</label>
        <input
          id="demo_ci" v-model="ci" type="text" inputmode="numeric" maxlength="10"
          placeholder="Diez dígitos, ej. 0912345678"
          class="dato w-full min-h-[2.75rem] px-md bg-transparent border-b border-[var(--border-color)] outline-none text-body text-[var(--text-primary)] transition-colors focus:border-[var(--accent-color)]"
        />
      </div>
      <button type="submit" class="btn-primary shrink-0" :disabled="cargando">
        <span v-if="cargando" class="w-3 h-3 border-2 border-t-transparent rounded-full animate-spin border-current"></span>
        {{ cargando ? 'Consultando…' : (isAuthenticated ? 'Consultar en mi panel' : 'Probar gratis') }}
      </button>
    </form>

    <p v-if="error" class="text-caption text-[var(--estado-error)] mb-md">{{ error }}</p>

    <!--
      Resultado real. Nombre, apellido y cedula en claro; el resto llega
      enmascarado desde el backend y aqui se sustituye por un aviso, en vez
      de mostrar el texto con asteriscos, que se lee como un error. El sello
      cae una sola vez, sobre la hoja del resultado: es la interaccion de
      firma de la portada, no un adorno que se repite en cada tarjeta.
    -->
    <div v-if="resultado" class="relative border-t border-[var(--border-color)] pt-lg overflow-hidden">
      <!--
        El sello de tinta. Un rectangulo limpio con esquinas redondas se lee
        como una insignia de "verificado" generica, no como algo estampado:
        el filtro SVG (turbulencia + desplazamiento) rompe el borde y el
        relleno de forma irregular, como tinta que se corrio un poco al
        golpear el papel. Sin esto la THESIS de la portada ("cae un sello")
        no se sostenia con evidencia visual.
      -->
      <svg width="0" height="0" style="position:absolute" aria-hidden="true">
        <filter id="textura-sello" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" result="ruido" />
          <feDisplacementMap in="SourceGraphic" in2="ruido" scale="7" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      <div
        class="animate-sello absolute top-0 right-0 sm:right-lg select-none pointer-events-none"
        style="mix-blend-mode: multiply;"
        aria-hidden="true"
      >
        <!-- Halo de tinta: una copia mayor, mas transparente y desplazada,
             simulando el doble golpe de un sello mal alineado. -->
        <div
          class="voz-sello absolute inset-0 inline-flex items-center gap-xs px-md py-xs border-[3px] opacity-40"
          style="border-color: var(--accent-color); color: var(--accent-color); filter: url(#textura-sello); transform: scale(1.12) rotate(2deg);"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
          VERIFICADO
        </div>
        <div
          class="voz-sello relative inline-flex items-center gap-xs px-md py-xs border-[3px]"
          style="border-color: var(--accent-color); color: var(--accent-color); filter: url(#textura-sello);"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
          VERIFICADO
        </div>
      </div>

      <p class="text-lead font-bold text-[var(--text-primary)]">
        {{ resultado.Nombre }} {{ resultado.Apellido }}
      </p>
      <p class="dato text-caption text-[var(--text-muted)] mb-lg">Cédula {{ resultado.Ci }}</p>

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

      <div class="hoja-panel p-lg mt-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-md">
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
import { formatCountdown } from '../../utils/quota';
import { useAuth } from '../../composables/useAuth';

const router = useRouter();
const route = useRoute();
const { isAuthenticated } = useAuth();

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

  /*
   * Quien ya tiene cuenta no necesita la demo: le devolvia datos
   * enmascarados y un boton de "Crear cuenta gratis" a alguien que ya la
   * tiene, que es justo la confusion que reporto un usuario registrado.
   * En vez de llamar al endpoint publico, se va directo a la consulta real
   * del panel con la cedula ya escrita.
   */
  if (isAuthenticated.value) {
    router.push({ name: 'dashboard', query: { seccion: 'identity', ci: limpio } });
    return;
  }

  cargando.value = true;
  try {
    resultado.value = await authService.consultaDemo(limpio);
  } catch (e: any) {
    const estado = e?.response?.status;
    if (estado === 429) {
      /*
       * Se lee el cuerpo crudo, no e.message: el interceptor global
       * sustituye cualquier error con code "rate_limited" por un texto
       * generico de "espera un momento", pensado para un throttle de
       * segundos. Aqui el limite es diario, y el backend manda su propio
       * mensaje ("Has agotado tus N consultas gratuitas de hoy...") mas
       * detail.reset_at, siguiendo el mismo contrato {error, message,
       * detail} que usa el resto de la API. Leer el original evita
       * mostrar un texto que dice "un momento" cuando en realidad hay que
       * esperar hasta manana.
       */
      const cuerpo = e?.response?.data;
      const cuando = formatCountdown(cuerpo?.detail?.reset_at);
      const base = cuerpo?.message || 'Agotaste las consultas gratuitas de hoy.';
      error.value = cuando ? `${base} Se renueva ${cuando}.` : base;
    } else if (estado === 503) {
      // El backend prefiere no servir la demo antes que dejarla sin limite
      // si no puede contar el cupo: aqui se explica por que fallo, no se
      // trata como un error generico.
      error.value = e?.response?.data?.message || 'La demo no está disponible en este momento. Intenta de nuevo en unos minutos.';
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
