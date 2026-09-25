<template>
  <div class="p-lg space-y-2xl">

    <!-- Serie diaria -->
    <section class="space-y-lg">
      <div class="flex flex-wrap items-center justify-between gap-md">
        <h3 class="text-body font-semibold">Altas y peticiones por día</h3>
        <div class="flex items-center gap-sm">
          <button
            v-for="d in OPCIONES_DIAS" :key="d"
            type="button" class="chip"
            :aria-pressed="diasElegidos === d"
            @click="diasElegidos = d; fetchDiario()"
          >{{ d }} días</button>
        </div>
      </div>

      <p v-if="errorDiario" class="rounded-base border border-amber-500/20 bg-amber-500/5 px-md py-md text-caption leading-relaxed text-amber-500">
        {{ errorDiario }}
      </p>
      <p v-else-if="diario && !diario.sample_complete" class="rounded-base border border-amber-500/20 bg-amber-500/5 px-md py-md text-caption leading-relaxed text-amber-500">
        La ventana de peticiones se cortó por volumen de tráfico: las cifras de este periodo son parciales.
      </p>

      <div v-if="cargandoDiario" class="flex items-center gap-sm text-caption text-[var(--text-muted)]">
        <span class="w-3 h-3 border-2 border-t-transparent rounded-full animate-spin border-[var(--accent-color)]"></span>
        Cargando…
      </div>

      <div v-else-if="diario" class="grid grid-cols-1 lg:grid-cols-2 gap-lg">
        <div class="hoja-panel p-lg rounded-base">
          <GraficaBarras :datos="nuevosUsuariosPorDia" etiqueta="Usuarios nuevos por día" />
        </div>
        <div class="hoja-panel p-lg rounded-base">
          <GraficaBarras :datos="peticionesPorDia" etiqueta="Peticiones totales por día (todo el tráfico)" />
        </div>
      </div>
    </section>

    <!-- Ranking por tipo de consulta, sumado en todo el periodo -->
    <section v-if="rankingPorTipo.length" class="space-y-md">
      <h3 class="text-body font-semibold">Consultas por tipo, en los últimos {{ diario?.window_days ?? diasElegidos }} días</h3>
      <div class="space-y-sm">
        <div v-for="r in rankingPorTipo" :key="r.tipo" class="space-y-xs">
          <div class="flex items-baseline justify-between gap-md text-caption">
            <span class="text-[var(--text-secondary)]">{{ r.tipo }}</span>
            <span class="tabular-nums font-medium">{{ r.cantidad }}</span>
          </div>
          <div class="h-2 rounded-full bg-[var(--border-color)] overflow-hidden">
            <div class="h-full bg-[var(--accent-color)]" :style="{ width: (r.cantidad / rankingPorTipo[0].cantidad * 100) + '%' }"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Tabla de usuarios con actividad agregada -->
    <section class="space-y-md">
      <div class="flex items-center justify-between gap-md">
        <h3 class="text-body font-semibold">Usuarios y actividad</h3>
        <p class="text-caption text-[var(--text-muted)]">
          {{ plural(estadisticasUsuarios.totalItems, 'usuario') }}
        </p>
      </div>

      <p v-if="errorEstadisticasUsuarios" class="rounded-base border border-amber-500/20 bg-amber-500/5 px-md py-md text-caption leading-relaxed text-amber-500">
        {{ errorEstadisticasUsuarios }}
      </p>
      <p v-else-if="!estadisticasUsuarios.sampleComplete" class="rounded-base border border-amber-500/20 bg-amber-500/5 px-md py-md text-caption leading-relaxed text-amber-500">
        El total de peticiones y la última actividad son parciales: la ventana de historial se cortó por volumen de tráfico.
      </p>

      <EstadoVacio
        v-if="!cargandoEstadisticasUsuarios && estadisticasUsuarios.items.length === 0 && !errorEstadisticasUsuarios"
        compacto
        titulo="No hay usuarios"
        detalle="Cuando alguien cree una cuenta aparecerá aquí."
      />

      <div v-else class="hoja-card overflow-hidden">
        <div class="hidden md:block overflow-x-auto custom-scrollbar">
          <table class="w-full text-left border-collapse border-b border-[var(--border-color)]">
            <thead>
              <tr class="border-b border-[var(--border-color)] bg-black/5">
                <th class="px-lg py-md text-caption font-black uppercase tracking-[0.14em] text-[var(--text-muted)]">Usuario</th>
                <th class="px-lg py-md text-caption font-black uppercase tracking-[0.14em] text-[var(--text-muted)]">Plan</th>
                <th class="px-lg py-md text-caption font-black uppercase tracking-[0.14em] text-[var(--text-muted)]">Estado</th>
                <th class="px-lg py-md text-caption font-black uppercase tracking-[0.14em] text-[var(--text-muted)]">Peticiones</th>
                <th class="px-lg py-md text-caption font-black uppercase tracking-[0.14em] text-[var(--text-muted)]">Última actividad</th>
                <th class="px-lg py-md text-caption font-black uppercase tracking-[0.14em] text-[var(--text-muted)]">Registro</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[var(--border-color)]">
              <tr v-for="u in estadisticasUsuarios.items" :key="u.id" class="hover:bg-white/[0.02] transition-colors">
                <td class="px-lg py-md">
                  <div class="flex flex-col min-w-0">
                    <span class="text-body font-bold text-[var(--text-primary)] truncate">{{ u.username || u.name || u.id }}</span>
                    <span v-if="u.email" class="text-caption text-[var(--text-secondary)] truncate">{{ u.email }}</span>
                  </div>
                </td>
                <td class="px-lg py-md">
                  <span class="text-caption font-medium px-md py-xs rounded-base border border-[var(--border-color)]">
                    {{ descripcionPlan(u.plan) }}
                  </span>
                </td>
                <td class="px-lg py-md">
                  <div class="flex items-center gap-sm">
                    <span class="text-caption font-medium px-sm py-xs rounded-base border" :style="estiloEstadoUsuario(!!u.disable)">
                      {{ u.disable ? 'Deshabilitado' : 'Activo' }}
                    </span>
                    <button
                      type="button"
                      class="inline-flex items-center justify-center min-h-[2.75rem] px-sm text-caption font-medium text-[var(--accent-color)] hover:underline disabled:opacity-50 disabled:no-underline"
                      :disabled="cambiandoEstadoId === u.id"
                      @click="alternarEstadoUsuario(u)"
                    >
                      {{ cambiandoEstadoId === u.id ? '…' : (u.disable ? 'Activar' : 'Desactivar') }}
                    </button>
                  </div>
                </td>
                <td class="px-lg py-md text-body font-black tabular-nums">{{ u.total_requests ?? 0 }}</td>
                <td class="px-lg py-md text-caption text-[var(--text-secondary)] tabular-nums">{{ fechaCorta(u.last_activity) }}</td>
                <td class="px-lg py-md text-caption text-[var(--text-secondary)] tabular-nums">{{ fechaCorta(u.created) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="md:hidden divide-y divide-[var(--border-color)]">
          <article v-for="u in estadisticasUsuarios.items" :key="u.id" class="p-lg space-y-sm">
            <div class="min-w-0">
              <p class="text-body font-bold truncate">{{ u.username || u.name || u.id }}</p>
              <p v-if="u.email" class="text-caption text-[var(--text-secondary)] truncate">{{ u.email }}</p>
            </div>
            <div class="flex flex-wrap items-center gap-sm text-caption text-[var(--text-secondary)]">
              <span class="px-sm py-xs rounded-base border border-[var(--border-color)]">{{ descripcionPlan(u.plan) }}</span>
              <span class="px-sm py-xs rounded-base border" :style="estiloEstadoUsuario(!!u.disable)">
                {{ u.disable ? 'Deshabilitado' : 'Activo' }}
              </span>
              <span>{{ u.total_requests ?? 0 }} peticiones</span>
              <span>Última: {{ fechaCorta(u.last_activity) }}</span>
            </div>
            <button
              type="button" class="btn-secondary w-full"
              :disabled="cambiandoEstadoId === u.id"
              @click="alternarEstadoUsuario(u)"
            >
              {{ cambiandoEstadoId === u.id ? 'Cambiando…' : (u.disable ? 'Activar' : 'Desactivar') }}
            </button>
          </article>
        </div>

        <div v-if="estadisticasUsuarios.totalPages > 1" class="px-lg py-md border-t border-[var(--border-color)] flex items-center justify-center gap-md">
          <button type="button" class="btn-secondary" :disabled="estadisticasUsuarios.page <= 1 || cargandoEstadisticasUsuarios" @click="fetchEstadisticasUsuarios(estadisticasUsuarios.page - 1)">Anterior</button>
          <p class="text-caption text-[var(--text-muted)]">Página {{ estadisticasUsuarios.page }} de {{ estadisticasUsuarios.totalPages }}</p>
          <button type="button" class="btn-secondary" :disabled="estadisticasUsuarios.page >= estadisticasUsuarios.totalPages || cargandoEstadisticasUsuarios" @click="fetchEstadisticasUsuarios(estadisticasUsuarios.page + 1)">Siguiente</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
/**
 * Pestaña "Estadísticas" del panel admin: serie diaria (altas/peticiones),
 * ranking de consultas por tipo y la tabla de usuarios con su actividad
 * agregada. Vive aparte de AdminView.vue -antes todo esto estaba inline en
 * la vista- porque es una funcionalidad independiente con su propio estado
 * de carga, sus propios dos endpoints y su propia paginacion.
 */
import { ref, computed, reactive } from 'vue';
import { authService } from '../../api/authService';
import { plural } from '../../utils/plural';
import GraficaBarras from '../../ui/components/GraficaBarras.vue';
import EstadoVacio from '../../ui/components/EstadoVacio.vue';
import type { PuntoDia } from '../../types/graficas';

/** Catalogo de planes, cargado por AdminView: aqui solo se resuelve el nombre. */
const props = defineProps<{ planes: any[] }>();

/* ─── Serie diaria ──────────────────────────────────────────── */
const OPCIONES_DIAS = [7, 30, 60, 90] as const;
const diasElegidos = ref<number>(30);

const diario = ref<{
  window_days: number;
  sample_complete: boolean;
  dias: { fecha: string; nuevos_usuarios: number; peticiones_totales: number; peticiones_por_tipo: Record<string, number> }[];
} | null>(null);
const cargandoDiario = ref(false);
const errorDiario = ref('');

const fetchDiario = async () => {
  cargandoDiario.value = true;
  errorDiario.value = '';
  try {
    diario.value = await authService.getAdminDaily(diasElegidos.value);
  } catch (error: any) {
    diario.value = null;
    errorDiario.value = error?.message || 'No se pudo cargar la serie diaria.';
    console.error('[admin] fallo al cargar estadisticas diarias:', {
      status: error?.response?.status, body: error?.response?.data
    });
  } finally {
    cargandoDiario.value = false;
  }
};

const nuevosUsuariosPorDia = computed<PuntoDia[]>(() =>
  (diario.value?.dias ?? []).map((d) => ({ fecha: d.fecha, valor: d.nuevos_usuarios }))
);
const peticionesPorDia = computed<PuntoDia[]>(() =>
  (diario.value?.dias ?? []).map((d) => ({ fecha: d.fecha, valor: d.peticiones_totales }))
);

/** Suma cada tipo de consulta a lo largo de todos los dias del periodo, de mayor a menor. */
const rankingPorTipo = computed(() => {
  const totales = new Map<string, number>();
  for (const d of diario.value?.dias ?? []) {
    for (const [tipo, cantidad] of Object.entries(d.peticiones_por_tipo ?? {})) {
      totales.set(tipo, (totales.get(tipo) ?? 0) + cantidad);
    }
  }
  return [...totales.entries()]
    .map(([tipo, cantidad]) => ({ tipo, cantidad }))
    .filter((r) => r.cantidad > 0)
    .sort((a, b) => b.cantidad - a.cantidad);
});

/* ─── Tabla de usuarios ─────────────────────────────────────── */
const estadisticasUsuarios = reactive({
  items: [] as any[],
  page: 1,
  perPage: 50,
  totalItems: 0,
  totalPages: 1,
  sampleComplete: true
});
const cargandoEstadisticasUsuarios = ref(false);
const errorEstadisticasUsuarios = ref('');

const fetchEstadisticasUsuarios = async (page = 1) => {
  cargandoEstadisticasUsuarios.value = true;
  errorEstadisticasUsuarios.value = '';
  try {
    const data = await authService.getAdminUsers(page, estadisticasUsuarios.perPage);
    estadisticasUsuarios.items = data?.items ?? [];
    estadisticasUsuarios.page = data?.page ?? page;
    estadisticasUsuarios.totalItems = data?.totalItems ?? estadisticasUsuarios.items.length;
    estadisticasUsuarios.totalPages = data?.totalPages ?? 1;
    estadisticasUsuarios.sampleComplete = data?.sample_complete !== false;
  } catch (error: any) {
    estadisticasUsuarios.items = [];
    errorEstadisticasUsuarios.value = error?.message || 'No se pudo cargar la tabla de usuarios.';
    console.error('[admin] fallo al cargar estadisticas de usuarios:', {
      status: error?.response?.status, body: error?.response?.data
    });
  } finally {
    cargandoEstadisticasUsuarios.value = false;
  }
};

/** El plan llega como id; se resuelve contra el catalogo que ya carga AdminView. */
const descripcionPlan = (planId: string): string =>
  props.planes.find((pl: any) => pl.id === planId)?.description || planId || 'SIN PLAN';

const estiloEstadoUsuario = (deshabilitado: boolean) => {
  const color = deshabilitado ? 'var(--estado-error)' : 'var(--estado-exito)';
  return { color, borderColor: `color-mix(in srgb, ${color} 30%, transparent)` };
};

/** Activa o desactiva un usuario, releyendo la pagina actual para reflejar el cambio. */
const cambiandoEstadoId = ref<string | null>(null);

const alternarEstadoUsuario = async (u: any) => {
  const nuevoDisable = !u.disable;
  const nombre = u.username || u.name || u.id;
  const confirmado = confirm(
    nuevoDisable ? `¿Deshabilitar a ${nombre}? No podrá iniciar sesión.` : `¿Reactivar a ${nombre}?`
  );
  if (!confirmado) return;

  cambiandoEstadoId.value = u.id;
  errorEstadisticasUsuarios.value = '';
  try {
    await authService.patchUser(u.id, { disable: nuevoDisable });
    await fetchEstadisticasUsuarios(estadisticasUsuarios.page);
  } catch (error: any) {
    errorEstadisticasUsuarios.value = error?.message || 'No se pudo cambiar el estado del usuario.';
    console.error('[admin] fallo al cambiar estado de usuario:', {
      status: error?.response?.status, body: error?.response?.data
    });
  } finally {
    cambiandoEstadoId.value = null;
  }
};

/** Fecha legible; PocketBase entrega ISO o "YYYY-MM-DD HH:mm:ss.SSSZ". */
const fechaCorta = (v: string) => {
  const d = new Date(String(v).replace(' ', 'T'));
  return Number.isNaN(d.getTime())
    ? '—'
    : d.toLocaleDateString('es-EC', { day: '2-digit', month: 'short', year: 'numeric' });
};

/** AdminView llama a esto desde su boton "Refrescar" compartido entre pestañas. */
const refrescar = () => {
  fetchDiario();
  fetchEstadisticasUsuarios(estadisticasUsuarios.page);
};

/** Carga perezosa: AdminView monta este componente solo cuando se abre la pestaña. */
fetchDiario();
fetchEstadisticasUsuarios(1);

defineExpose({ refrescar });
</script>
