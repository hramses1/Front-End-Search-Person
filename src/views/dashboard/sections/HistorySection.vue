<template>
  <div class="space-y-xl animate-fade-in">
    <div>
      <h2 class="text-h4 font-light tracking-tight mb-xs">Mi actividad</h2>
      <p class="text-body text-[var(--text-secondary)]">
        Qué has consultado y cuándo. Solo tú ves esta lista.
      </p>
    </div>

    <!-- Resumen: la cuota de hoy y lo que llevas en el periodo -->
    <div class="grid gap-md sm:grid-cols-3">
      <FilaMetrica
        etiqueta="Consultas de hoy"
        :valor="deHoy"
        :detalle="cuotaSinTope ? 'Tu plan no tiene tope diario.' : `De ${tokenLimit} que trae tu plan.`"
        :estado="estadoCuota"
      />
      <FilaMetrica
        etiqueta="En el historial"
        :valor="total"
        :detalle="`Registradas en total.`"
      />
      <FilaMetrica
        etiqueta="Se renueva"
        :valor="quotaCountdown || '—'"
        detalle="A medianoche, hora de Ecuador."
      />
    </div>

    <!-- Consumo diario -->
    <div v-if="porDia.length" class="glass-card p-lg">
      <GraficaBarras :datos="porDia" etiqueta="Consultas por día" />
    </div>

    <!-- Listado -->
    <div class="glass-card overflow-hidden">
      <div class="px-lg py-md border-b border-[var(--border-color)] flex flex-wrap items-center justify-between gap-sm">
        <p class="text-overline uppercase tracking-[0.14em] text-[var(--text-muted)]">Consultas recientes</p>
        <button
          type="button"
          class="inline-flex items-center gap-sm min-h-[2.75rem] px-sm text-caption font-medium text-[var(--text-secondary)] hover:text-[var(--accent-color)] transition-all disabled:opacity-50"
          :disabled="cargando"
          @click="cargar(1)"
        >
          <span v-if="cargando" class="w-3 h-3 border-2 border-t-transparent rounded-full animate-spin border-[var(--accent-color)]"></span>
          <span v-else aria-hidden="true">↻</span>
          Actualizar
        </button>
      </div>

      <p v-if="error" class="px-lg py-lg text-body text-[var(--estado-error)]">{{ error }}</p>

      <EstadoVacio
        v-else-if="!cargando && filas.length === 0"
        compacto
        titulo="Todavía no has consultado nada"
        detalle="Cuando hagas una consulta aparecerá aquí, con su fecha y su resultado."
      />

      <ul v-else class="divide-y divide-[var(--border-color)]">
        <li v-for="(f, i) in filas" :key="f.id ?? i" class="px-lg py-md flex flex-wrap items-baseline gap-x-md gap-y-xs">
          <span class="text-body font-medium text-[var(--text-primary)]">{{ f.etiqueta }}</span>

          <!--
            El estado no se comunica solo con color: lleva su palabra al lado,
            para quien no distinga los tonos.
          -->
          <span
            class="text-caption px-sm py-xs rounded-full border"
            :style="{
              color: f.ok ? 'var(--estado-exito)' : 'var(--estado-error)',
              borderColor: f.ok ? 'var(--estado-exito)' : 'var(--estado-error)'
            }"
          >{{ f.ok ? 'Con resultado' : 'Sin resultado' }}</span>

          <span v-if="f.consulta" class="text-caption text-[var(--text-secondary)] font-mono">{{ f.consulta }}</span>

          <span class="text-caption text-[var(--text-muted)] ml-auto tabular-nums">{{ f.cuando }}</span>
        </li>
      </ul>

      <div v-if="totalPaginas > 1" class="px-lg py-md border-t border-[var(--border-color)] flex items-center justify-between gap-md">
        <button
          type="button" class="btn-secondary"
          :disabled="pagina <= 1 || cargando" @click="cargar(pagina - 1)"
        >Anterior</button>
        <p class="text-caption text-[var(--text-muted)] tabular-nums">Página {{ pagina }} de {{ totalPaginas }}</p>
        <button
          type="button" class="btn-secondary"
          :disabled="pagina >= totalPaginas || cargando" @click="cargar(pagina + 1)"
        >Siguiente</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { authService } from '../../../api/authService';
import { useAuth } from '../../../composables/useAuth';
import FilaMetrica from '../../../ui/components/FilaMetrica.vue';
import GraficaBarras from '../../../ui/components/GraficaBarras.vue';
import type { PuntoDia } from '../../../types/graficas';
import EstadoVacio from '../../../ui/components/EstadoVacio.vue';

const { tokenLimit } = useAuth();

const crudo = ref<any[]>([]);
const pagina = ref(1);
const totalPaginas = ref(1);
const total = ref(0);
const cargando = ref(false);
const error = ref('');

const cuotaSinTope = computed(() => !tokenLimit.value || tokenLimit.value <= 0);

/*
 * El endpoint declara `{}` en el OpenAPI, asi que no se sabe como se llaman
 * sus campos. En vez de adivinar uno y romper si no coincide, se buscan por
 * patron: es lo mismo que ya hubo que hacer con el correo en administracion,
 * donde el esquema tampoco declaraba el campo que si venia.
 */
const primeraClave = (o: any, patron: RegExp): any => {
  if (!o || typeof o !== 'object') return undefined;
  const k = Object.keys(o).find(x => patron.test(x));
  return k ? o[k] : undefined;
};

const ETIQUETAS: Record<string, string> = {
  id_card: 'Cédula', identity: 'Cédula', cedula: 'Cédula',
  fullname: 'Nombre', ruc: 'RUC', license: 'Licencia',
  citation: 'Multas', citations: 'Multas', complaint: 'Denuncias',
  judgement: 'Juicios', vehicles: 'Vehículo', plate: 'Vehículo',
  medical_appointments: 'Citas médicas', demo: 'Demo'
};

const nombreBonito = (v: any) => {
  const s = String(v ?? '').toLowerCase();
  const clave = Object.keys(ETIQUETAS).find(k => s.includes(k));
  return clave ? ETIQUETAS[clave] : (v ? String(v) : 'Consulta');
};

const cuando = (v: any) => {
  const d = new Date(String(v ?? '').replace(' ', 'T'));
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleString('es-EC', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
  });
};

const filas = computed(() => crudo.value.map((r, i) => {
  const tipo = primeraClave(r, /tipo|type|endpoint|ruta|path|consulta|query|servicio/i);
  const fecha = primeraClave(r, /create|fecha|date|time|when/i);
  const estado = primeraClave(r, /status|codigo_http|http|code|exito|success|ok/i);
  const dato = primeraClave(r, /^(ci|cedula|placa|plate|ruc|valor|param)/i);
  // Un 2xx es resultado; cualquier otra cosa, no. Si no viene estado, se
  // asume que hubo resultado: registrar algo que fallo es la excepcion.
  const num = Number(estado);
  const ok = estado === undefined || estado === true || (Number.isFinite(num) && num >= 200 && num < 300);
  return {
    id: r?.id ?? i,
    etiqueta: nombreBonito(tipo),
    consulta: dato ? String(dato) : '',
    cuando: cuando(fecha),
    ok
  };
}));

/** Agrupa por día para la gráfica, sin huecos entre fechas con actividad. */
const porDia = computed<PuntoDia[]>(() => {
  const cuenta = new Map<string, number>();
  crudo.value.forEach(r => {
    const f = primeraClave(r, /create|fecha|date|time|when/i);
    const d = new Date(String(f ?? '').replace(' ', 'T'));
    if (Number.isNaN(d.getTime())) return;
    const clave = d.toISOString().slice(0, 10);
    cuenta.set(clave, (cuenta.get(clave) ?? 0) + 1);
  });
  return [...cuenta.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([fecha, valor]) => ({ fecha, valor }));
});

const deHoy = computed(() => {
  const hoy = new Date().toISOString().slice(0, 10);
  return porDia.value.find(d => d.fecha === hoy)?.valor ?? 0;
});

const estadoCuota = computed<'neutro' | 'aviso' | 'malo'>(() => {
  if (cuotaSinTope.value) return 'neutro';
  const pct = deHoy.value / tokenLimit.value;
  return pct >= 1 ? 'malo' : pct >= 0.8 ? 'aviso' : 'neutro';
});

const quotaCountdown = ref('');
let reloj: ReturnType<typeof setInterval> | undefined;

const cargar = async (p = 1) => {
  cargando.value = true;
  error.value = '';
  try {
    const d = await authService.getHistorial(p, 30);
    // La respuesta puede venir paginada o como lista suelta.
    const items = Array.isArray(d) ? d : (d?.items ?? []);
    crudo.value = items;
    pagina.value = d?.page ?? p;
    totalPaginas.value = d?.totalPages ?? 1;
    total.value = d?.totalItems ?? items.length;
  } catch (e: any) {
    error.value = e?.message || 'No se pudo cargar el historial.';
    crudo.value = [];
  } finally {
    cargando.value = false;
  }
};

onMounted(() => {
  cargar(1);
  // La cuenta atras hasta medianoche de Ecuador, que va sin horario de verano.
  const calcular = () => {
    const ahora = new Date();
    const ec = new Date(ahora.getTime() - 5 * 3600 * 1000);
    const finDia = Date.UTC(ec.getUTCFullYear(), ec.getUTCMonth(), ec.getUTCDate() + 1);
    const restan = finDia - ec.getTime();
    const h = Math.floor(restan / 3600000);
    const m = Math.floor((restan % 3600000) / 60000);
    quotaCountdown.value = h > 0 ? `en ${h} h ${m} min` : `en ${m} min`;
  };
  calcular();
  reloj = setInterval(calcular, 60000);
});

// Sin esto el temporizador sigue vivo al cambiar de seccion: es la misma fuga
// que hubo que arreglar en useAuth.
onUnmounted(() => { if (reloj) clearInterval(reloj); });
</script>
