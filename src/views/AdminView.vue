<template>
  <div class="dashboard-wrapper font-primary min-h-screen flex overflow-hidden relative selection:bg-[var(--accent-color)]/30">
    <!-- Capas Atmosféricas -->
    <div class="absolute inset-0 pointer-events-none noise-overlay z-0 text-[var(--text-muted)]"></div>
    <div class="absolute inset-0 pointer-events-none overflow-hidden z-0">
      <div class="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-[var(--accent-color)]/5 blur-[120px] rounded-full"></div>
      <div class="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-[var(--accent-color)]/3 blur-[100px] rounded-full"></div>
    </div>

    <!-- Botón Hamburguesa Móvil -->
    <button 
      @click="isSidebarOpen = !isSidebarOpen"
      class="lg:hidden fixed top-4 right-4 z-50 p-md glass-panel rounded-base text-[var(--accent-color)] shadow-xl active:scale-90 transition-transform"
    >
      <svg v-if="!isSidebarOpen" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
      <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
    </button>
    
    <!-- Overlay Móvil -->
    <transition enter-active-class="duration-base ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="duration-200 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div v-if="isSidebarOpen" @click="isSidebarOpen = false" class="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30"></div>
    </transition>
    
    <!-- Sidebar -->
    <aside 
      :class="['fixed inset-y-0 left-0 z-40 w-72 transition-all duration-base lg:relative lg:translate-x-0 flex flex-col h-screen glass-panel', isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0']"
    >
      <div class="p-lg border-b border-[var(--border-color)]">
        <BrandMark prefijo="Portal " titulo="Administración" apilado />
      </div>

      <div class="flex-1 overflow-y-auto p-md space-y-md custom-scrollbar">
        <p class="text-overline font-bold tracking-[0.14em] mb-md text-[var(--text-muted)] uppercase px-sm">Navegación</p>
        <button 
          @click="router.push('/dashboard')"
          class="w-full flex items-center justify-between px-lg py-md rounded-base text-body font-bold tracking-[0.14em] text-[var(--text-secondary)] hover:bg-white/5 hover:translate-x-1 transition-all"
        >
          <span>← VOLVER AL PANEL</span>
        </button>
      </div>

      <div class="p-md border-t border-[var(--border-color)] bg-black/10">
        <button @click="handleLogout" class="w-full py-sm text-red-400 hover:bg-red-500/5 text-overline font-bold tracking-[0.14em] rounded-base border border-red-500/10 hover:border-red-500/20 transition-all uppercase mb-md">
          Cerrar Sesión Admin
        </button>

        <SecuritySeals class="mt-md" />
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col h-screen relative z-10 p-lg sm:p-xl overflow-y-auto custom-scrollbar animate-fade-in">
      <header class="mb-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-md">
        <div>
          <p class="text-overline font-black tracking-[0.14em] text-[var(--accent-color)] uppercase mb-xs">Panel de Control</p>
          <h1 class="text-h3 font-light tracking-tight text-[var(--text-primary)] uppercase">Gestión de Usuarios</h1>
        </div>
        
        <div class="flex items-center gap-md">
            <div class="flex flex-col items-end">
                <span class="text-body font-bold tracking-[0.14em] text-[var(--text-primary)]">{{ userName }}</span>
                <span class="text-caption font-black tracking-[0.14em] text-[var(--accent-color)] opacity-80">ADMINISTRADOR</span>
            </div>
            <div class="w-9 h-9 rounded-base bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-body font-black text-white shadow-lg shadow-amber-500/20">
                {{ userName.substring(0, 2).toUpperCase() }}
            </div>
        </div>
      </header>

      <!-- Users Table -->
      <div class="flex-1">
          <div class="glass-card overflow-hidden">
            <div class="px-lg py-md border-b border-[var(--border-color)] flex justify-between items-center bg-[var(--surface-color)]/50">
              <h3 class="text-overline font-black tracking-[0.14em] uppercase text-[var(--text-secondary)]">Usuarios del Sistema</h3>
              <button @click="fetchUsers" :disabled="isLoading" class="flex items-center gap-sm text-caption font-bold tracking-[0.14em] uppercase hover:text-[var(--accent-color)] transition-all disabled:text-[var(--text-muted)]">
                <span v-if="isLoading" class="w-3 h-3 border-2 border-t-transparent rounded-full animate-spin border-[var(--accent-color)]"></span>
                <span v-else>↻</span>
                Refrescar
              </button>
            </div>

            <p
              v-if="loadError"
              class="mb-md rounded-base border border-amber-500/20 bg-amber-500/5 px-md py-md text-caption leading-relaxed tracking-wide text-amber-500"
            >
              {{ loadError }}
            </p>

            <!-- Filtros. Se aplican en cliente: el listado llega entero. -->
            <div class="px-lg pb-lg space-y-md border-b border-[var(--border-color)]">
              <div class="flex flex-col lg:flex-row lg:items-end gap-md">
                <div class="relative input-container flex-1 min-w-0">
                  <input
                    v-model="buscaUsuario"
                    id="busca_usuario" type="search" placeholder=" "
                    class="custom-input peer"
                  />
                  <label for="busca_usuario">Buscar usuario o ID</label>
                </div>

                <div class="relative input-container w-full lg:w-48">
                  <input
                    v-model.number="minPeticiones"
                    id="min_peticiones" type="number" min="0" placeholder=" "
                    class="custom-input peer"
                  />
                  <label for="min_peticiones">Peticiones desde</label>
                </div>

                <div class="relative input-container w-full lg:w-40">
                  <input v-model="desde" id="f_desde" type="date" placeholder=" " class="custom-input peer" />
                  <label for="f_desde">Registrado desde</label>
                </div>

                <div class="relative input-container w-full lg:w-40">
                  <input v-model="hasta" id="f_hasta" type="date" placeholder=" " class="custom-input peer" />
                  <label for="f_hasta">Hasta</label>
                </div>
              </div>

              <div class="flex flex-wrap items-center gap-xs">
                <span class="text-overline uppercase tracking-[0.14em] text-[var(--text-muted)] mr-sm">Orden</span>
                <div class="flex flex-wrap gap-xs">
                  <button
                    v-for="o in ordenes" :key="o.valor"
                    type="button" class="chip"
                    :aria-pressed="orden === o.valor"
                    @click="orden = o.valor"
                  >{{ o.texto }}</button>
                </div>
              </div>

              <div v-if="planesEnUso.length > 1" class="flex flex-wrap items-center gap-xs">
                <span class="text-overline uppercase tracking-[0.14em] text-[var(--text-muted)] mr-sm">Plan</span>
                <button
                  v-for="pl in planesEnUso" :key="pl"
                  type="button" class="chip"
                  :aria-pressed="filtroPlan === pl"
                  @click="filtroPlan = filtroPlan === pl ? '' : pl"
                >{{ pl }}</button>
              </div>

              <div class="flex items-center justify-between gap-md">
                <p class="text-overline uppercase tracking-[0.14em] text-[var(--text-muted)]">
                  {{ usuariosFiltrados.length }} de {{ users.length }} usuarios
                </p>
                <button v-if="hayFiltros" type="button" class="btn-tertiary" @click="limpiarFiltros">
                  Quitar filtros
                </button>
              </div>
            </div>

            <div class="overflow-x-auto custom-scrollbar">
              <table class="w-full text-left border-collapse border-b border-[var(--border-color)]">
                <thead>
                  <tr class="border-b border-[var(--border-color)] bg-black/5">
                    <th class="px-lg py-md text-caption font-black uppercase tracking-[0.14em] text-[var(--text-muted)]">Usuario</th>
                    <th class="px-lg py-md text-caption font-black uppercase tracking-[0.14em] text-[var(--text-muted)]">Plan</th>
                    <th class="px-lg py-md text-caption font-black uppercase tracking-[0.14em] text-[var(--text-muted)]">Peticiones</th>
                    <th class="px-lg py-md text-caption font-black uppercase tracking-[0.14em] text-[var(--text-muted)]">Registro</th>
                    <th class="px-lg py-md text-caption font-black uppercase tracking-[0.14em] text-[var(--text-muted)] text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-[var(--border-color)]">
                  <tr v-if="!isLoading && usuariosFiltrados.length === 0">
                    <td colspan="5" class="px-lg py-2xl text-center text-body text-[var(--text-muted)]">
                      {{ users.length === 0 ? 'No hay usuarios que mostrar.' : 'Ningún usuario coincide con los filtros.' }}
                    </td>
                  </tr>
                  <tr v-for="userItem in usuariosFiltrados" :key="userItem.userId" class="hover:bg-white/[0.02] transition-colors group">
                    <td class="px-lg py-md">
                      <div class="flex flex-col">
                        <span class="text-body font-bold text-[var(--text-primary)]">{{ userItem.userName }}</span>
                        <span class="text-caption font-mono text-[var(--text-muted)] tracking-tighter">{{ userItem.userId }}</span>
                      </div>
                    </td>
                    <td class="px-lg py-md">
                      <span class="inline-block text-caption font-black px-md py-xs rounded-base border border-[var(--border-color)] tracking-[0.14em] uppercase" :style="{ color: userItem.planDescription?.includes('ADMIN') ? 'var(--accent-color)' : 'var(--text-secondary)' }">
                        {{ userItem.planDescription || 'SIN PLAN' }}
                      </span>
                    </td>
                    <td class="px-lg py-md">
                      <div class="flex items-center gap-md">
                        <div class="flex flex-col min-w-[60px]">
                            <span
                              class="text-body font-black tabular-nums"
                              :style="{ color: userItem.consumoDesconocido ? 'var(--text-secondary)' : (!sinTope(userItem.limite) && (userItem.number_requests ?? 0) >= userItem.limite ? '#ef4444' : 'var(--text-primary)') }"
                              :title="userItem.consumoDesconocido ? 'No se pudo leer el consumo de este usuario' : ''"
                            >
                            {{ userItem.consumoDesconocido ? '—' : (userItem.number_requests ?? 0) }}
                            </span>
                            <span class="text-caption font-bold text-[var(--text-muted)] tracking-[0.14em]">{{ userItem.consumoDesconocido ? 'SIN DATO' : (sinTope(userItem.limite) ? 'SIN LÍMITE' : `/ ${userItem.limite}`) }}</span>
                        </div>
                        <div v-if="!sinTope(userItem.limite) && !userItem.consumoDesconocido" class="hidden sm:block flex-1 h-1 bg-black/20 rounded-full overflow-hidden max-w-[80px]">
                            <div class="h-full bg-[var(--accent-color)] text-[var(--text-secondary)]" :style="{ width: Math.min(((userItem.number_requests ?? 0) / userItem.limite * 100), 100) + '%' }"></div>
                        </div>
                      </div>
                    </td>
                    <td class="px-lg py-md">
                      <span v-if="userItem.registro" class="text-caption text-[var(--text-secondary)] tabular-nums" :title="userItem.registro">
                        {{ fechaCorta(userItem.registro) }}
                      </span>
                      <span v-else class="text-caption text-[var(--text-muted)]">—</span>
                    </td>
                    <td class="px-lg py-md text-right">
                      <div class="flex justify-end gap-sm">
                        <button 
                          @click="openEditModal(userItem)"
                          class="px-md py-sm rounded-base text-caption font-black tracking-[0.14em] border border-[var(--border-color)] hover:border-[var(--accent-color)] hover:text-[var(--accent-color)] transition-all uppercase"
                        >
                          Editar
                        </button>
                        <button 
                          @click="resetRequests(userItem)"
                          :disabled="userItem.number_requests === 0 || isResetting === userItem.userId"
                          class="px-md py-sm rounded-base text-caption font-black tracking-[0.14em] border border-red-500/20 text-red-500/60 hover:text-red-500 hover:border-red-500/50 transition-all uppercase disabled:text-[var(--text-muted)]"
                        >
                          <span v-if="isResetting === userItem.userId">...</span>
                          <span v-else>Reset</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
      </div>

      <!-- Footer en Admin -->
      <MainFooter />

      <!-- Edit Modal -->
      <transition 
        enter-active-class="duration-base ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100"
        leave-active-class="duration-200 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0"
      >
        <div v-if="showModal" class="fixed inset-0 z-[100] flex items-center justify-center p-lg bg-black/60 backdrop-blur-md">
          <div class="w-full max-w-md glass-card p-xl relative animate-fade-in shadow-2xl">
            <h3 class="text-lead font-bold tracking-tight mb-xl flex items-center gap-md">
                <span class="w-2 h-8 bg-[var(--accent-color)] rounded-full"></span>
                EDITAR USUARIO
            </h3>
            
            <form @submit.prevent="saveUserChanges" class="space-y-xl">
              <div class="relative group input-container">
                <input v-model="editForm.userName" type="text" id="edit_username" placeholder=" " class="custom-input peer" required />
                <label for="edit_username">Nombre de Usuario (Ej: Juan_12)</label>
              </div>

              <!--
                Selector propio en vez de <select>: el desplegable nativo lo
                pinta el sistema operativo y no hay forma de que case con el
                resto de la interfaz. Reutiliza el lenguaje de ProfileDropdown.
              -->
              <div class="space-y-sm">
                <p class="text-caption font-black text-[var(--text-muted)] uppercase tracking-[0.14em]">Plan asignado</p>

                <div class="relative">
                  <button
                    type="button"
                    @click="planAbierto = !planAbierto"
                    class="w-full flex items-center justify-between gap-md glass-panel py-md px-md rounded-base hover:bg-white/5 transition-all active:scale-[0.99] text-left"
                  >
                    <span class="flex flex-col min-w-0">
                      <span
                        class="text-body font-bold tracking-[0.14em] uppercase truncate"
                        :class="planSeleccionado ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'"
                      >
                        {{ planSeleccionado?.description || 'Selecciona un plan' }}
                      </span>
                      <span v-if="planSeleccionado" class="text-caption font-black tracking-[0.14em] text-[var(--text-muted)] uppercase">
                        {{ planSeleccionado.daily_limit ? `${planSeleccionado.daily_limit} consultas/día` : 'Sin límite' }}
                      </span>
                    </span>
                    <svg
                      class="w-4 h-4 shrink-0 text-[var(--text-secondary)] transition-transform duration-base"
                      :class="planAbierto ? 'rotate-180 text-[var(--accent-color)]' : ''"
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  <!-- Captura los clics fuera para cerrar el panel -->
                  <div v-if="planAbierto" class="fixed inset-0 z-[105]" @click="planAbierto = false"></div>

                  <transition
                    enter-active-class="transition duration-200 ease-out"
                    enter-from-class="transform scale-95 opacity-0 -translate-y-1"
                    enter-to-class="transform scale-100 opacity-100 translate-y-0"
                    leave-active-class="transition duration-150 ease-in"
                    leave-from-class="transform scale-100 opacity-100 translate-y-0"
                    leave-to-class="transform scale-95 opacity-0 -translate-y-1"
                  >
                    <div
                      v-if="planAbierto"
                      class="absolute left-0 right-0 top-full mt-sm z-[110] p-sm rounded-base border shadow-2xl bg-[var(--surface-color)] border-[var(--border-color)] max-h-56 overflow-y-auto custom-scrollbar"
                    >
                      <button
                        v-for="pl in planes"
                        :key="pl.id"
                        type="button"
                        @click="elegirPlan(pl)"
                        class="w-full flex items-center justify-between gap-md px-md py-md rounded-base hover:bg-[var(--accent-color)]/10 hover:text-[var(--accent-color)] transition-all text-left"
                        :class="pl.id === editForm.plan ? 'bg-[var(--accent-color)]/10 text-[var(--accent-color)]' : ''"
                      >
                        <span class="text-caption font-bold uppercase tracking-wider truncate">{{ pl.description }}</span>
                        <span class="text-caption font-black tracking-[0.14em] text-[var(--text-muted)] shrink-0">
                          {{ pl.daily_limit ? `${pl.daily_limit}/día` : 'SIN TOPE' }}
                        </span>
                      </button>

                      <p v-if="!planes.length" class="px-md py-md text-caption tracking-wide text-amber-500">
                        No se pudo cargar el catálogo de planes; revisa la consola.
                      </p>
                    </div>
                  </transition>
                </div>
              </div>

              <div class="relative group input-container">
                <input v-model="editForm.number_requests" type="number" id="edit_requests" placeholder=" " class="custom-input peer" required min="0" />
                <label for="edit_requests">Peticiones consumidas</label>
                <p class="text-overline text-[var(--text-muted)] mt-xs leading-relaxed">
                  Número de consultas del usuario. Ponerlo a cero le devuelve el cupo.
                </p>
              </div>

              <p
                v-if="modalError"
                class="rounded-base border border-red-500/20 bg-red-500/5 px-md py-md text-caption leading-relaxed tracking-wide text-red-400"
              >
                {{ modalError }}
              </p>

              <div class="flex gap-md pt-md">
                <button 
                  type="button" 
                  @click="showModal = false"
                  class="flex-1 py-md rounded-base text-caption font-black tracking-[0.14em] border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-white/5 transition-all uppercase"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  class="flex-1 py-md btn-primary text-caption font-black tracking-[0.14em] uppercase"
                  :disabled="isSaving"
                >
                  {{ isSaving ? 'Guardando...' : 'Confirmar Cambios' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </transition>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import BrandMark from '../ui/components/BrandMark.vue';
import SecuritySeals from '../ui/components/SecuritySeals.vue';
import { useAuth } from '../composables/useAuth';
import { authService } from '../api/authService';
import MainFooter from '../ui/components/MainFooter.vue';

const router = useRouter();
const { logout, userName, isAdmin } = useAuth();

const isSidebarOpen = ref(false);
const users = ref<any[]>([]);
const isLoading = ref(false);
const showModal = ref(false);
const modalError = ref('');
const planes = ref<any[]>([]);
const planAbierto = ref(false);

const planSeleccionado = computed(() =>
  planes.value.find((pl: any) => pl.id === editForm.plan) || null
);

const elegirPlan = (pl: any) => {
  editForm.plan = pl.id;
  planAbierto.value = false;
};
const isSaving = ref(false);
const isResetting = ref<string | null>(null);
const loadError = ref('');

/* ─── Filtros de la tabla ─────────────────────────────────────
   Se aplican en el cliente: el listado ya viene entero en una sola
   peticion, asi que filtrar en servidor no ahorraria nada.
   ───────────────────────────────────────────────────────────── */
const buscaUsuario = ref('');
const filtroPlan = ref('');
const minPeticiones = ref<number | null>(null);
const orden = ref<'nombre' | 'mas' | 'menos' | 'nuevos' | 'antiguos'>('nombre');
const desde = ref('');
const hasta = ref('');

/** Fecha legible; PocketBase entrega ISO o "YYYY-MM-DD HH:mm:ss.SSSZ". */
const fechaCorta = (v: string) => {
  const d = new Date(String(v).replace(' ', 'T'));
  return Number.isNaN(d.getTime())
    ? '—'
    : d.toLocaleDateString('es-EC', { day: '2-digit', month: 'short', year: 'numeric' });
};

/** Solo la parte de fecha, para comparar contra los input type=date. */
const soloFecha = (v: any) => {
  const d = new Date(String(v ?? '').replace(' ', 'T'));
  return Number.isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 10);
};

const ordenes = [
  { valor: 'nombre' as const, texto: 'A-Z' },
  { valor: 'mas' as const, texto: 'Más peticiones' },
  { valor: 'menos' as const, texto: 'Menos peticiones' },
  { valor: 'nuevos' as const, texto: 'Más recientes' },
  { valor: 'antiguos' as const, texto: 'Más antiguos' }
];

const normaliza = (t: any) => String(t ?? '')
  .toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();

/** Planes presentes en el listado, para ofrecer solo los que existen. */
const planesEnUso = computed(() => {
  const vistos = new Set<string>();
  for (const u of users.value) if (u.planDescription) vistos.add(u.planDescription);
  return [...vistos].sort();
});

const usuariosFiltrados = computed(() => {
  let lista = [...users.value];

  const q = normaliza(buscaUsuario.value);
  if (q) {
    lista = lista.filter(u =>
      normaliza(u.userName).includes(q) || normaliza(u.userId).includes(q)
    );
  }

  if (filtroPlan.value) {
    lista = lista.filter(u => u.planDescription === filtroPlan.value);
  }

  if (minPeticiones.value !== null && minPeticiones.value >= 0) {
    lista = lista.filter(u => (u.number_requests ?? 0) >= minPeticiones.value!);
  }

  if (desde.value) {
    lista = lista.filter(u => u.registro && soloFecha(u.registro) >= desde.value);
  }
  if (hasta.value) {
    lista = lista.filter(u => u.registro && soloFecha(u.registro) <= hasta.value);
  }

  if (orden.value === 'nuevos' || orden.value === 'antiguos') {
    const signo = orden.value === 'nuevos' ? -1 : 1;
    lista.sort((a, b) => signo * (soloFecha(a.registro).localeCompare(soloFecha(b.registro))));
  } else if (orden.value === 'mas') {
    lista.sort((a, b) => (b.number_requests ?? 0) - (a.number_requests ?? 0));
  } else if (orden.value === 'menos') {
    lista.sort((a, b) => (a.number_requests ?? 0) - (b.number_requests ?? 0));
  } else {
    lista.sort((a, b) => normaliza(a.userName).localeCompare(normaliza(b.userName)));
  }

  return lista;
});

const hayFiltros = computed(() =>
  !!buscaUsuario.value || !!filtroPlan.value || minPeticiones.value !== null
  || !!desde.value || !!hasta.value
);

const limpiarFiltros = () => {
  buscaUsuario.value = '';
  filtroPlan.value = '';
  minPeticiones.value = null;
  desde.value = '';
  hasta.value = '';
};

// Los planes sin tope usan un limite centinela enorme; pintarlo literal daba
// "9 / 9999999999" con la barra al 0,00000009 %.
const LIMITE_SIN_TOPE = 1_000_000;
const sinTope = (limite?: number) => (limite ?? 0) >= LIMITE_SIN_TOPE;


const editForm = reactive({
  userId: '',
  userName: '',
  plan: '',
  number_requests: 0
});

onMounted(() => {
  if (!isAdmin.value) {
    router.push('/dashboard');
    return;
  }
  fetchUsers();
  fetchPlanes();
});

/**
 * Catalogo de planes para el desplegable de edicion.
 *
 * El listado de usuarios solo trae `planDescription`, no el id del plan, asi
 * que hace falta el catalogo para saber que valor enviar en el PATCH.
 */
const fetchPlanes = async () => {
  try {
    const data = await authService.getPlans();
    planes.value = data.items || [];
  } catch (error) {
    console.error('[admin] no se pudo cargar el catalogo de planes:', error);
  }
};

const fetchUsers = async () => {
  isLoading.value = true;
  loadError.value = '';
  try {
    const data = await authService.getAllUsersPlans();

    // El listado ya trae la cuota de cada usuario, asi que basta una peticion.
    // Antes habia que pedir el consumo uno a uno contra users/get/: 36 llamadas
    // para 35 usuarios, con fallos por limite por IP y por permisos.
    users.value = (data.items || []).map((u: any) => ({
      ...u,
      // El contador que manda es number_requests, que es el que el backend
      // valida y reinicia. Si el listado todavia no lo incluye se cae a
      // quota.used para no dejar la columna vacia.
      number_requests: u.number_requests ?? u.quota?.used ?? 0,
      // La fila avisa si el dato viene del respaldo y no del campo real.
      consumoDeRespaldo: u.number_requests === undefined,
      // daily_limit es el cupo del plan tal cual; quota.limit y token_duration
      // quedan de respaldo por si alguna fila viniera sin el.
      limite: u.daily_limit ?? u.quota?.limit ?? u.token_duration,
      registro: u.create_at ?? null,
      // quota es nullable: si no viene, no inventamos un cero.
      consumoDesconocido: !u.quota
    }));

    // El panel no pagina: si el backend reporta mas de una pagina, se avisa
    // en vez de dejar creer que estan todos los usuarios.
    if ((data.totalPages ?? 1) > 1) {
      loadError.value = `Mostrando ${users.value.length} de ${data.totalItems} usuarios: hay ${data.totalPages} páginas y este panel solo carga la primera.`;
    }
  } catch (error: any) {
    // Se avisa de forma explícita en vez de mostrar una tabla vacía, que
    // se leería como "no hay usuarios".
    users.value = [];
    loadError.value = error?.message || 'No se pudo cargar el listado de usuarios.';
    console.error('Error fetching users:', error);
  } finally {
    isLoading.value = false;
  }
};

const handleLogout = () => {
  logout();
  router.push('/auth');
};

const openEditModal = (userItem: any) => {
  editForm.userId = userItem.userId;
  editForm.userName = userItem.userName;
  // OJO: userItem.id es el id de la fila de plan_users, NO el del plan. Enviarlo
  // como `plan` hacia que el backend rechazara el PATCH con invalid_input. Se
  // resuelve el plan real casando la descripcion contra el catalogo.
  editForm.plan = planes.value.find(
    (pl: any) => pl.description === userItem.planDescription
  )?.id || '';
  // El consumo viene en el listado; ya no hace falta una peticion por usuario.
  editForm.number_requests = userItem.number_requests ?? 0;
  modalError.value = '';
  planAbierto.value = false;
  showModal.value = true;
};

const resetRequests = async (userItem: any) => {
  if (!confirm(`¿Reiniciar peticiones para ${userItem.userName}?`)) return;
  isResetting.value = userItem.userId;
  try {
    await authService.patchUser(userItem.userId, { number_requests: 0 });
    const idx = users.value.findIndex(u => u.userId === userItem.userId);
    if (idx !== -1) {
      // Tras reiniciar, el consumo pasa a ser conocido: cero de verdad.
      users.value[idx] = { ...users.value[idx], number_requests: 0, consumoDesconocido: false };
    }
  } catch (error) {
    console.error('Error al resetear peticiones:', error);
  } finally {
    isResetting.value = null;
  }
};

const saveUserChanges = async () => {
  if (!editForm.plan) {
    // El selector propio no participa en la validacion nativa del formulario.
    modalError.value = 'Selecciona un plan antes de guardar.';
    return;
  }

  isSaving.value = true;
  modalError.value = '';
  try {
    // Un unico PATCH con todos los campos. Antes eran dos llamadas seguidas al
    // mismo endpoint, asi que si la segunda fallaba el usuario quedaba a medio
    // actualizar sin que nadie se enterase.
    await authService.updateUser(editForm.userId, {
      username: editForm.userName,
      number_requests: Number(editForm.number_requests),
      plan: editForm.plan
    });

    showModal.value = false;

    // Se espera de verdad al refresco: antes se lanzaba sin await, asi que el
    // modal se cerraba y no habia forma de saber si el listado llegaba a
    // actualizarse ni si fallaba.
    await fetchUsers();

    // El listado y el registro de usuario son colecciones distintas. Si tras
    // recargar sigue apareciendo el valor anterior, el dato se guardo pero el
    // listado no lo refleja: se avisa en vez de dejar una pantalla que
    // contradice a la base.
    const fila = users.value.find((u: any) => u.userId === editForm.userId);
    if (fila && fila.userName !== editForm.userName) {
      console.warn('[admin] el listado no refleja el cambio recien guardado', {
        userId: editForm.userId,
        enviado: editForm.userName,
        devuelto: fila.userName
      });
      loadError.value = 'El cambio se guardó correctamente, pero el listado sigue devolviendo los datos anteriores. Vuelve a cargar en unos segundos.';
    }
  } catch (error: any) {
    // El interceptor ya deja en `message` un texto presentable y, cuando el
    // backend rechaza campos concretos, la lista en `invalidFields`.
    const campos = error?.invalidFields?.length
      ? ` Campos rechazados: ${error.invalidFields.join(', ')}.`
      : '';
    modalError.value = `${error?.message || 'No se pudo actualizar el usuario.'}${campos}`;
    console.error('[admin] fallo al actualizar usuario:', {
      userId: editForm.userId,
      status: error?.response?.status,
      body: error?.response?.data
    });
  } finally {
    isSaving.value = false;
  }
};
</script>

<style scoped>
.noise-overlay {
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.04'/%3E%3C/svg%3E");
}
</style>
