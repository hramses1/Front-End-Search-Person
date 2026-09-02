<template>
  <div class="dashboard-wrapper font-primary min-h-screen flex overflow-hidden relative selection:bg-[var(--accent-color)]/30">
    <!-- Primer elemento enfocable: permite saltarse la barra lateral. -->
    <a href="#contenido" class="salto-contenido">Saltar al contenido</a>

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

    <!-- Sidebar -->
    <aside 
      :class="['fixed inset-y-0 left-0 z-40 w-64 transition-all duration-base lg:relative lg:translate-x-0 flex flex-col h-screen glass-panel', isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0']"
    >
      <div class="p-lg border-b border-[var(--border-color)]">
        <BrandMark prefijo="Portal de " titulo="Consulta Ciudadana" apilado />
        <p class="text-overline uppercase tracking-[0.14em] text-[var(--text-muted)] mt-sm">Panel de Consultas</p>
      </div>

      <div class="flex-1 overflow-y-auto p-md space-y-md custom-scrollbar">
        <!-- Admin Section -->
        <div v-if="isAdmin" class="mb-md px-xs">
          <p class="text-overline font-black tracking-[0.14em] mb-sm text-[var(--text-muted)] uppercase">Administración</p>
          <button @click="router.push('/admin')" class="w-full flex items-center gap-sm px-md py-sm rounded-base border border-amber-500/20 bg-amber-500/5 text-amber-500 hover:bg-amber-500/10 transition-all text-caption font-bold tracking-wider">
            <svg class="w-3.5 h-3.5 shrink-0" style="color: var(--estado-aviso);" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
            Panel de control
          </button>
        </div>

        <div class="px-xs space-y-md">
          <div v-for="grupo in sectionGroups" :key="grupo.label">
            <p class="text-overline font-black tracking-[0.14em] mb-sm text-[var(--text-muted)] uppercase">{{ grupo.label }}</p>
            <nav class="space-y-xs">
              <button
                v-for="item in grupo.items" :key="item.key"
                @click="currentSection = item.key; isSidebarOpen = false"
                :class="['w-full flex items-center gap-sm text-left px-md py-sm rounded-base text-caption font-bold tracking-wide transition-all duration-base border', currentSection === item.key ? 'bg-[var(--accent-color)] text-[var(--accent-inverse)] border-[var(--border-color)] shadow-sm' : 'text-[var(--text-secondary)] border-transparent hover:bg-[var(--accent-color)]/5 hover:text-[var(--text-primary)]']"
              >
                <svg
                  class="w-3.5 h-3.5 shrink-0"
                  :style="currentSection === item.key ? undefined : { color: COLOR_GRUPO[grupo.label] }"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path v-for="d in item.icon" :key="d" :d="d" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" />
                </svg>
                <span class="truncate">{{ item.label }}</span>
              </button>
            </nav>
          </div>
        </div>
      </div>

      <div class="p-md border-t border-[var(--border-color)]">
        <button @click="handleLogout" class="w-full py-sm bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 hover:border-red-500/20 rounded-base text-red-500 text-overline font-bold tracking-[0.14em] transition-all duration-base flex items-center justify-center gap-sm uppercase">
          DESCONECTAR
        </button>

        <SecuritySeals class="mt-md" />
      </div>
    </aside>

    <!-- Main -->
    <!--
      h-[100dvh] ademas de h-screen: en moviles 100vh incluye la barra de
      direcciones, asi que el contenido queda cortado por abajo. dvh mide el
      alto realmente visible y los navegadores que no lo soportan se quedan
      con h-screen.
    -->
    <main id="contenido" class="flex-1 flex flex-col h-screen h-[100dvh] relative z-10 p-lg sm:p-xl overflow-y-auto custom-scrollbar animate-fade-in">
      <!--
        pr-3xl en movil: el boton de menu va fixed arriba a la derecha y el
        titulo se le metia debajo. En lg desaparece el boton y sobra el hueco.
      -->
      <header class="mb-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-md pr-3xl lg:pr-0">
        <div>
          <p class="text-overline font-black tracking-[0.14em] text-[var(--accent-color)] uppercase mb-xs">Sección Actual</p>
          <h1 class="text-h4 sm:text-h3 font-light tracking-tight text-[var(--text-primary)] text-balance">
            {{ sections[currentSection] }}
          </h1>
        </div>

        <div class="flex flex-wrap items-center justify-end gap-sm w-full md:w-auto md:gap-md self-end md:self-auto">
          <!--
            Plan y cuota vivian en una tarjeta de la barra lateral que ocupaba
            demasiado para lo que dice. Aqui van en una linea, junto al resto
            de controles de cuenta.
          -->
          <div class="flex items-center gap-sm glass-panel py-sm px-md rounded-base">
            <span class="text-overline font-black tracking-[0.14em] uppercase px-sm py-xs rounded-full border border-[var(--accent-color)] text-[var(--accent-color)] bg-[var(--accent-color)]/5">
              {{ planMostrado }}
            </span>
            <div class="flex flex-col leading-none">
              <span class="text-caption font-bold tabular-nums text-[var(--text-primary)]">
                {{ cuotaSinTope ? `${userRequests} consultas` : `${userRequests} / ${tokenLimit}` }}
              </span>
              <span v-if="quotaCountdown" class="text-caption tracking-[0.14em] uppercase text-[var(--text-muted)] mt-xs hidden sm:block">
                Renueva {{ quotaCountdown }}
              </span>
            </div>
          </div>

          <DonationMenu />
          <div class="h-10 w-px bg-[var(--border-color)] mx-sm hidden lg:block"></div>
          <div class="flex items-center gap-md">
            <button @click="toggleTheme" class="p-md glass-panel rounded-base hover:bg-white/5 transition-all text-[var(--accent-color)] active:scale-90">
                <svg v-if="isDark" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"></path></svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
            </button>
            <ProfileDropdown :currentSection="currentSection" @update:section="currentSection = $event" @logout="handleLogout" />
          </div>
        </div>
      </header>

      <!-- Content -->
      <div class="flex-1 pb-2xl">
        <transition 
          mode="out-in"
          enter-active-class="transition duration-base ease-out"
          enter-from-class="opacity-0 translate-y-4 blur-sm"
          enter-to-class="opacity-100 translate-y-0 blur-0"
          leave-active-class="transition duration-base ease-in"
          leave-from-class="opacity-100 translate-y-0 blur-0"
          leave-to-class="opacity-0 -translate-y-4 blur-sm"
        >
          <component :is="activeComponent" :key="currentSection" @refresh-stats="refreshUserData" />
        </transition>
      </div>

      <MainFooter />
    </main>

    <!-- Overlay Móvil -->
    <transition enter-active-class="duration-base ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="duration-200 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div v-if="isSidebarOpen" @click="isSidebarOpen = false" class="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30"></div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, markRaw, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import BrandMark from '../ui/components/BrandMark.vue';
import SecuritySeals from '../ui/components/SecuritySeals.vue';
import { useAuth } from '../composables/useAuth';
import { authService } from '../api/authService';
import { formatCountdown, proximaRenovacion } from '../utils/quota';

// Componentes
import DonationMenu from './dashboard/components/DonationMenu.vue';
import ProfileDropdown from './dashboard/components/ProfileDropdown.vue';
import MainFooter from '../ui/components/MainFooter.vue';

// Secciones
import IdentitySection from './dashboard/sections/IdentitySection.vue';
import RucSection from './dashboard/sections/RucSection.vue';
import FullnameSection from './dashboard/sections/FullnameSection.vue';
import LicenseSection from './dashboard/sections/LicenseSection.vue';
import CitationSection from './dashboard/sections/CitationSection.vue';
import VehiclesSection from './dashboard/sections/VehiclesSection.vue';
import ComplaintSection from './dashboard/sections/ComplaintSection.vue';
import JudgementSection from './dashboard/sections/JudgementSection.vue';
import ProfileSection from './dashboard/sections/ProfileSection.vue';

const router = useRouter();
const { logout, isDark, toggleTheme, userPlan, userRole, userRequests, tokenLimit, isAdmin, userId, setPlanData, setQuota } = useAuth();

const isSidebarOpen = ref(false);

/**
 * Servicios agrupados por dominio.
 *
 * `label` es el texto corto de la barra lateral; `titulo` el encabezado de la
 * vista. Antes era una lista plana de nueve entradas en mayusculas, sin
 * jerarquia: costaba encontrar nada.
 */
/**
 * Color por grupo. Sale de los tokens de estado, ya verificados, y sirve para
 * distinguir dominios de un vistazo. El icono del elemento activo hereda el
 * color del texto para no perder contraste sobre el fondo relleno.
 */
const COLOR_GRUPO: Record<string, string> = {
  Identidad: 'var(--accent-color)',
  Judicial: 'var(--estado-aviso)',
  'Tránsito': 'var(--estado-exito)',
  Tributario: 'var(--estado-error)',
  Cuenta: 'var(--text-secondary)'
};

const sectionGroups = [
  {
    label: 'Identidad',
    items: [
      { key: 'identity', label: 'Buscar por cédula', titulo: 'VERIFICACIÓN DE IDENTIDAD',
        icon: ['M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'] },
      { key: 'fullname', label: 'Buscar por nombre', titulo: 'BÚSQUEDA POR NOMBRE',
        icon: ['M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'] }
    ]
  },
  {
    label: 'Judicial',
    items: [
      { key: 'complaint', label: 'Denuncias', titulo: 'REGISTRO DE DENUNCIAS',
        icon: ['M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'] },
      { key: 'judgement', label: 'Juicios como demandante', titulo: 'JUICIOS COMO DEMANDANTE',
        icon: ['M12 3v18m0-18L6 6m6-3l6 3M4 9l3 8a4 4 0 01-6 0l3-8zm16 0l3 8a4 4 0 01-6 0l3-8z'] }
    ]
  },
  {
    label: 'Tránsito',
    items: [
      { key: 'license', label: 'Licencia', titulo: 'LICENCIAS ACTIVAS',
        icon: ['M3 5a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5z', 'M7 12h4m-2-3a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM15 10h3m-3 4h3'] },
      { key: 'citation', label: 'Multas e infracciones', titulo: 'INFRACCIONES DE TRÁNSITO',
        icon: ['M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'] },
      { key: 'vehicles', label: 'Datos del vehículo', titulo: 'CONSULTA DE VEHÍCULOS',
        icon: ['M5 17a2 2 0 104 0 2 2 0 00-4 0zm10 0a2 2 0 104 0 2 2 0 00-4 0zM7 17h8m4 0h2v-4l-3-5H6L3 13v4h2'] }
    ]
  },
  {
    label: 'Tributario',
    items: [
      { key: 'ruc', label: 'Estado del RUC', titulo: 'ESTADO RUC',
        icon: ['M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'] }
    ]
  },
  {
    label: 'Cuenta',
    items: [
      { key: 'profile', label: 'Mi perfil', titulo: 'ACTUALIZAR PERFIL',
        icon: ['M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'] }
    ]
  }
];

/** Titulo del encabezado por clave de seccion. */
const sections = Object.fromEntries(
  sectionGroups.flatMap(g => g.items.map(i => [i.key, i.titulo]))
) as Record<string, string>;

const currentSection = ref<string>('identity');

const activeComponent = computed(() => {
  const components: any = {
    identity: IdentitySection,
    fullname: FullnameSection,
    ruc: RucSection,
    license: LicenseSection,
    citation: CitationSection,
    vehicles: VehiclesSection,
    complaint: ComplaintSection,
    judgement: JudgementSection,
    profile: ProfileSection
  };
  return markRaw(components[currentSection.value] || IdentitySection);
});

const refreshUserData = async () => {
    if (!userId.value) return;

    let items: any[] = [];
    try {
        items = await authService.getPlanItems(userId.value);
    } catch (e) {
        console.error('[cuota] no se pudieron recuperar las filas de plan:', e);
    }

    // La descripcion y el consumo salen de la misma fila: la que casa con el
    // rol firmado, o la primera. number_requests es del usuario, no de la
    // fila, asi que no hay nada que agregar entre filas.
    const rol = userRole.value?.toUpperCase();
    const filaRol = rol ? items.find(i => i.planDescription?.toUpperCase().includes(rol)) : undefined;
    const fila = filaRol || items[0];
    if (fila) setPlanData(fila.planDescription, fila.id);

    const consumo = typeof fila?.number_requests === 'number' ? fila.number_requests : undefined;

    try {
        const cuota = await authService.getQuota();
        // reset_at sale SIEMPRE de /api/users/quota/, que es el momento en que
        // se renueva. El quota_reset_at de la fila de plan marca el INICIO de
        // la ventana, que ya paso: usarlo dejaba la cuenta atras en "en breve".
        setQuota({
            ...cuota,
            used: consumo ?? cuota.used
        });
    } catch (e) {
        console.error('[cuota] no se pudo recuperar la cuota:', e);
    }
};

// Reloj de baja frecuencia para que la cuenta atrás de la cuota no se congele.
const ahora = ref(Date.now());
let relojCuota: ReturnType<typeof setInterval> | undefined;

// El backend usa un limite centinela enorme para los planes sin tope. Pintarlo
// literal daba "9 / 9999999999" y una barra al 0,00000009 %.
const LIMITE_SIN_TOPE = 1_000_000;
const cuotaSinTope = computed(() => tokenLimit.value >= LIMITE_SIN_TOPE);

// Un administrador puede no tener fila de plan propia: su condicion vive en el
// claim `role` del token y el servidor le da cuota sin tope. En ese caso la
// fila FREE que devuelve get_for_userid no se le esta aplicando, asi que
// mostrarla enganaba. Solo se especializa el caso admin; el resto de usuarios
// siguen viendo la descripcion de su plan.
const planMostrado = computed(() => {
  if (isAdmin.value) return 'ADMIN';
  return userPlan.value || 'FREE';
});

// El contador se reinicia a medianoche para todos los planes, tengan tope o
// no, asi que la cuenta atras se muestra siempre.
const quotaCountdown = computed(() => {
    ahora.value; // dependencia explícita: obliga a recalcular en cada tick
    return formatCountdown(proximaRenovacion());
});

/**
 * Al volver a la pestana se recarga la cuota: puede haber cambiado desde otra
 * sesion, otro dispositivo o el panel de administracion.
 */
const alVolver = () => {
    if (document.visibilityState === 'visible') refreshUserData();
};

onMounted(() => {
    refreshUserData();
    relojCuota = setInterval(() => { ahora.value = Date.now(); }, 60000);
    document.addEventListener('visibilitychange', alVolver);
});

onUnmounted(() => {
    if (relojCuota) clearInterval(relojCuota);
    document.removeEventListener('visibilitychange', alVolver);
});

const handleLogout = () => {
  logout();
  router.push('/auth');
};
</script>

<style scoped>
.noise-overlay {
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.04'/%3E%3C/svg%3E");
}

@keyframes bounce-horizontal {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(3px); }
}
.animate-bounce-horizontal {
  animation: bounce-horizontal 1s infinite;
}
</style>
