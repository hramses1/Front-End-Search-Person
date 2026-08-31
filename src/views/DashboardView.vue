<template>
  <div class="dashboard-wrapper font-primary min-h-screen flex overflow-hidden relative selection:bg-[var(--accent-color)]/30">
    <!-- Capas Atmosféricas -->
    <div class="absolute inset-0 pointer-events-none noise-overlay z-0 opacity-20"></div>
    <div class="absolute inset-0 pointer-events-none overflow-hidden z-0">
      <div class="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-[var(--accent-color)]/5 blur-[120px] rounded-full"></div>
      <div class="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-[var(--accent-color)]/3 blur-[100px] rounded-full"></div>
    </div>

    <!-- Botón Hamburguesa Móvil -->
    <button 
      @click="isSidebarOpen = !isSidebarOpen"
      class="lg:hidden fixed top-4 right-4 z-50 p-3 glass-panel rounded-2xl text-[var(--accent-color)] shadow-xl active:scale-90 transition-transform"
    >
      <svg v-if="!isSidebarOpen" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
      <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
    </button>

    <!-- Sidebar -->
    <aside 
      :class="['fixed inset-y-0 left-0 z-40 w-72 transition-all duration-500 lg:relative lg:translate-x-0 flex flex-col h-screen glass-panel', 
      isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0']"
    >
      <div class="p-8 border-b border-[var(--border-color)]">
        <h2 class="text-[14px] leading-tight tracking-[0.15em] font-light mb-1 uppercase" style="color: var(--text-primary);">
          Portal de <br />
          <span class="font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFDD00] via-[#0033A0] to-[#ED1C24]">
            Consulta Ciudadana
          </span>
        </h2>
        <p class="text-[9px] uppercase tracking-[0.3em] opacity-40 mt-1">Panel de Consultas</p>
        <div class="mt-4 flex gap-1">
            <div class="h-1 w-6 rounded-full bg-[#FFDD00]"></div>
            <div class="h-1 w-3 rounded-full bg-[#0033A0]"></div>
            <div class="h-1 w-2 rounded-full bg-[#ED1C24]"></div>
        </div>
      </div>

      <div class="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
        <!-- Admin Section -->
        <div v-if="isAdmin" class="mb-6 px-2">
          <p class="text-[9px] font-black tracking-[0.3em] mb-4 opacity-40 uppercase">ADMINISTRACIÓN</p>
          <button @click="router.push('/admin')" class="w-full flex items-center gap-3 px-5 py-3 rounded-xl border border-amber-500/20 bg-amber-500/5 text-amber-500 hover:bg-amber-500/10 transition-all text-[11px] font-bold tracking-widest">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
            PANEL DE CONTROL
          </button>
        </div>

        <div class="px-2">
          <p class="text-[9px] font-black tracking-[0.3em] mb-4 opacity-40 uppercase">SERVICIOS DISPONIBLES</p>
          <nav class="space-y-1">
            <button 
              v-for="(label, key) in sections" :key="key"
              @click="currentSection = key; isSidebarOpen = false"
              :class="['w-full text-left px-5 py-3 rounded-xl text-[11px] font-bold tracking-widest transition-all duration-300 relative group overflow-hidden border', 
                currentSection === key ? 'bg-[var(--accent-color)] text-[var(--accent-inverse)] border-[var(--border-color)] shadow-sm' : 'text-[var(--text-secondary)] border-transparent hover:bg-[var(--accent-color)]/5 hover:text-[var(--text-primary)]']"
            >
              {{ label }}
            </button>
          </nav>
        </div>
      </div>

      <!-- Stats / Plan -->
      <div class="px-4 pb-4">
        <div class="rounded-xl border border-[var(--border-color)] p-4 bg-white/[0.02]">
            <div class="flex items-center justify-between mb-3">
                <span class="text-[9px] font-black tracking-[0.25em] opacity-40 uppercase">Plan Actual</span>
                <span class="text-[9px] font-mono px-2 py-0.5 rounded-full border border-[var(--accent-color)] text-[var(--accent-color)] bg-[var(--accent-color)]/5 font-black tracking-widest uppercase">
                    {{ planMostrado }}
                </span>
            </div>
            
            <div class="space-y-2">
                <div class="flex justify-between text-[9px] font-bold">
                    <span class="opacity-40 uppercase">Peticiones usadas</span>
                    <span class="text-[var(--accent-color)]">
                        {{ cuotaSinTope ? `${userRequests} · sin límite` : `${userRequests} / ${tokenLimit}` }}
                    </span>
                </div>
                <div v-if="!cuotaSinTope" class="h-1 w-full bg-black/40 rounded-full overflow-hidden">
                    <div class="h-full bg-[var(--accent-color)] transition-all duration-1000" :style="{ width: Math.min((userRequests / tokenLimit * 100), 100) + '%' }"></div>
                </div>
                <p v-if="quotaCountdown" class="text-[8px] tracking-widest uppercase opacity-40 pt-1">
                    Se renueva {{ quotaCountdown }}
                </p>
            </div>
        </div>
      </div>

      <div class="p-6 border-t border-[var(--border-color)]">
        <button @click="handleLogout" class="w-full py-3 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 hover:border-red-500/20 rounded-xl text-red-500 text-[10px] font-bold tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-2 uppercase">
          DESCONECTAR
        </button>

        <!-- Sellos de Seguridad -->
        <div class="mt-4 flex flex-wrap justify-center gap-3 text-[8px] uppercase tracking-widest opacity-40 font-mono text-[var(--text-secondary)]">
            <span class="flex items-center gap-1">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" stroke-width="2.5"></path></svg>
                SSL
            </span>
            <span>·</span>
            <span class="flex items-center gap-1">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" stroke-width="2.5"></path></svg>
                CIFRADO TLS
            </span>
            <span>·</span>
            <span class="flex items-center gap-1">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" stroke-width="2.5"></path></svg>
                DEVZIO © 2026
            </span>
        </div>
      </div>
    </aside>

    <!-- Main -->
    <main class="flex-1 flex flex-col h-screen relative z-10 p-6 sm:p-8 overflow-y-auto custom-scrollbar animate-fade-in">
      <header class="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <p class="text-[9px] font-black tracking-[0.3em] text-[var(--accent-color)] uppercase mb-1">Sección Actual</p>
          <h1 class="text-3xl font-light tracking-tight text-[var(--text-primary)]">
            {{ sections[currentSection] }}
          </h1>
        </div>

        <div class="flex items-center gap-4 self-end md:self-auto">
          <DonationMenu />
          <div class="h-10 w-[0.5px] bg-[var(--border-color)] mx-2 hidden sm:block"></div>
          <div class="flex items-center gap-3">
            <button @click="toggleTheme" class="p-3 glass-panel rounded-2xl hover:bg-white/5 transition-all text-[var(--accent-color)] active:scale-90">
                <svg v-if="isDark" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"></path></svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
            </button>
            <ProfileDropdown :currentSection="currentSection" @update:section="currentSection = $event" @logout="handleLogout" />
          </div>
        </div>
      </header>

      <!-- Content -->
      <div class="flex-1 pb-12">
        <transition 
          mode="out-in"
          enter-active-class="transition duration-500 ease-out"
          enter-from-class="opacity-0 translate-y-4 blur-sm"
          enter-to-class="opacity-100 translate-y-0 blur-0"
          leave-active-class="transition duration-300 ease-in"
          leave-from-class="opacity-100 translate-y-0 blur-0"
          leave-to-class="opacity-0 -translate-y-4 blur-sm"
        >
          <component :is="activeComponent" :key="currentSection" @refresh-stats="refreshUserData" />
        </transition>
      </div>

      <MainFooter />
    </main>

    <!-- Overlay Móvil -->
    <transition enter-active-class="duration-300 ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="duration-200 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div v-if="isSidebarOpen" @click="isSidebarOpen = false" class="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30"></div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, markRaw, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import { authService } from '../api/authService';
import { formatCountdown } from '../utils/quota';

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
const { logout, userName, isDark, toggleTheme, userPlan, userRole, userRequests, tokenLimit, quotaResetAt, isAdmin, userId, setPlanData, setQuota } = useAuth();

const isSidebarOpen = ref(false);

const sections = {
  fullname: 'BÚSQUEDA POR NOMBRE',
  ruc: 'ESTADO RUC',
  identity: 'VERIFICACIÓN DE IDENTIDAD',
  license: 'LICENCIAS ACTIVAS',
  citation: 'INFRACCIONES DE TRÁNSITO',
  complaint: 'REGISTRO DE DENUNCIAS',
  judgement: 'JUICIOS COMO DEMANDANTE',
  vehicles: 'CONSULTA DE VEHÍCULOS',
  profile: 'ACTUALIZAR PERFIL'
};

const currentSection = ref<keyof typeof sections>('identity');

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

    // La cuota manda: el servidor es la autoridad sobre used/limit/reset_at.
    // El contador local es solo indicativo y no debe bloquear consultas.
    try {
        setQuota(await authService.getQuota());
    } catch (e) {
        console.error('No se pudo recuperar la cuota:', e);
    }

    // El plan solo aporta la descripción que se pinta en la barra lateral.
    try {
        const plan = await authService.getUserPlan(userId.value, userRole.value);
        if (plan) setPlanData(plan.planDescription, plan.id);
    } catch (e) {
        console.error('No se pudo recuperar el plan:', e);
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

const quotaCountdown = computed(() => {
    ahora.value; // dependencia explícita: obliga a recalcular en cada tick
    return formatCountdown(quotaResetAt.value);
});

onMounted(() => {
    refreshUserData();
    relojCuota = setInterval(() => { ahora.value = Date.now(); }, 60000);
});

onUnmounted(() => {
    if (relojCuota) clearInterval(relojCuota);
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
