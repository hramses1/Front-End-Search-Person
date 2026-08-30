import { ref, computed } from 'vue';
import { clearCache } from '../api/cache';
import type { Quota } from '../utils/quota';

// NOTE: Ideally these should be injected or used via useCases
// For now, let's keep them as refs to maintain current functionality
const token = ref<string | null>(sessionStorage.getItem('auth_token'));
const user = ref<any>(null);
const userPlan = ref<string>(sessionStorage.getItem('user_plan') || 'FREE');
const planId = ref<string>(sessionStorage.getItem('plan_id') || '');
const userRequests = ref<number>(parseInt(sessionStorage.getItem('user_requests') || '0', 10));
const userId = ref<string>(sessionStorage.getItem('user_id') || '');
const userName = ref<string>(sessionStorage.getItem('user_name') || '');
const tokenLimit = ref<number>(parseInt(sessionStorage.getItem('token_limit') || '20', 10));
const quotaResetAt = ref<string>(sessionStorage.getItem('quota_reset_at') || '');
const isDark = ref<boolean>(sessionStorage.getItem('theme') !== 'light');

/**
 * Lee el claim `role` del JWT.
 *
 * Solo sirve para decidir qué se pinta. El permiso real lo valida el servidor
 * en cada endpoint: el token está firmado, pero aquí no verificamos la firma.
 */
const readRoleClaim = (jwt: string | null): string => {
  if (!jwt) return '';

  const parts = jwt.split('.');
  if (parts.length !== 3) return '';

  try {
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
    const claims = JSON.parse(atob(padded));
    return typeof claims?.role === 'string' ? claims.role : '';
  } catch {
    return '';
  }
};

let inactivityTimer: ReturnType<typeof setTimeout> | null = null;
const INACTIVITY_LIMIT_MS = 10 * 60 * 1000; // 10 minutos

export function useAuth() {
  const setToken = (newToken: string) => {
    token.value = newToken;
    sessionStorage.setItem('auth_token', newToken);
    // El token lo inyecta el interceptor de `apiClient` en cada petición.
    // Escribir en `axios.defaults` no servía de nada: las instancias creadas
    // con axios.create() copian los defaults al construirse, no en cada uso.
  };

  const logout = () => {
    token.value = null;
    user.value = null;
    userPlan.value = 'FREE';
    planId.value = '';
    userRequests.value = 0;
    userId.value = '';
    userName.value = '';
    tokenLimit.value = 20;
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('user_plan');
    sessionStorage.removeItem('plan_id');
    sessionStorage.removeItem('user_requests');
    sessionStorage.removeItem('user_id');
    sessionStorage.removeItem('user_name');
    sessionStorage.removeItem('token_limit');
    sessionStorage.removeItem('quota_reset_at');
    quotaResetAt.value = '';
    // Los resultados cacheados contienen datos personales y el cache es de
    // módulo: sin esto, el siguiente usuario de la pestaña los vería.
    clearCache();
    if (inactivityTimer) clearTimeout(inactivityTimer);
  };

  const setUserRecord = (record: {
    id?: string;
    plan?: string;
    number_requests?: number;
    name?: string;
    username?: string;
  }) => {
    if (record.id) {
      userId.value = record.id;
      sessionStorage.setItem('user_id', record.id);
    }

    // `plan` es la relación al plan en PocketBase, siempre un ID. La
    // descripción y el límite llegan aparte, por getUserPlan()/getQuota().
    // Ya no hace falta adivinar por longitud: el rol viene del claim del token.
    if (record.plan) {
      planId.value = record.plan;
      sessionStorage.setItem('plan_id', record.plan);
    }

    if (typeof record.number_requests === 'number') {
      userRequests.value = record.number_requests;
      sessionStorage.setItem('user_requests', String(record.number_requests));
    }

    const displayName = record.name || record.username || '';
    if (displayName) {
      userName.value = displayName;
      sessionStorage.setItem('user_name', displayName);
    }
  };

  /**
   * Vuelca la cuota que devuelve el servidor.
   *
   * El servidor es la autoridad: el contador local es solo indicativo y no debe
   * usarse para bloquear consultas.
   */
  const setQuota = (quota: Quota) => {
    userRequests.value = quota.used;
    tokenLimit.value = quota.limit;
    quotaResetAt.value = quota.reset_at || '';
    sessionStorage.setItem('user_requests', String(quota.used));
    sessionStorage.setItem('token_limit', String(quota.limit));
    sessionStorage.setItem('quota_reset_at', quotaResetAt.value);
  };

  const updateUserRequests = (count: number) => {
    userRequests.value = count;
    sessionStorage.setItem('user_requests', String(count));
  };

  const setPlanData = (planDescription: string, limit: number, id?: string) => {
    userPlan.value = planDescription;
    tokenLimit.value = limit;
    sessionStorage.setItem('user_plan', planDescription);
    sessionStorage.setItem('token_limit', String(limit));
    
    if (id) {
      planId.value = id;
      sessionStorage.setItem('plan_id', id);
    }
  };

  const resetInactivityTimer = () => {
    if (!token.value) return;
    if (inactivityTimer) clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
      logout();
      window.location.href = '/auth';
    }, INACTIVITY_LIMIT_MS);
  };

  const setupActivityListeners = () => {
    if (typeof window === 'undefined') return;
    window.addEventListener('mousemove', resetInactivityTimer);
    window.addEventListener('keydown', resetInactivityTimer);
    window.addEventListener('click', resetInactivityTimer);
    window.addEventListener('scroll', resetInactivityTimer);
    resetInactivityTimer();
  };

  const toggleTheme = () => {
    isDark.value = !isDark.value;
    sessionStorage.setItem('theme', isDark.value ? 'dark' : 'light');
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', isDark.value);
    }
  };

  const updateUserName = (newName: string) => {
    userName.value = newName;
    sessionStorage.setItem('user_name', newName);
  };

  const initializeAuth = () => {
    if (token.value) {
      setupActivityListeners();
    }
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', isDark.value);
    }
  };

  return {
    token: computed(() => token.value),
    user: computed(() => user.value),
    userPlan: computed(() => userPlan.value),
    planId: computed(() => planId.value),
    userRequests: computed(() => userRequests.value),
    tokenLimit: computed(() => tokenLimit.value),
    quotaResetAt: computed(() => quotaResetAt.value),
    userId: computed(() => userId.value),
    userName: computed(() => userName.value),
    isDark: computed(() => isDark.value),
    isAdmin: computed(() => {
      // Solo controla lo que se pinta; el backend valida el rol en cada
      // endpoint privilegiado. Ya no depende de un ID de plan hardcodeado ni
      // de sessionStorage: sale del claim firmado del token.
      return readRoleClaim(token.value).toUpperCase() === 'ADMIN';
    }),
    isAuthenticated: computed(() => !!token.value),
    setToken,
    setUserRecord,
    updateUserRequests,
    setQuota,
    setPlanData,
    logout,
    initializeAuth,
    setupActivityListeners,
    toggleTheme,
    updateUserName
  };
}
