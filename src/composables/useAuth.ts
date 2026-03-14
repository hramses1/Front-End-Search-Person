import { ref, computed } from 'vue';
import axios from 'axios';

const token = ref<string | null>(sessionStorage.getItem('auth_token'));
const user = ref<any>(null);
const userPlan = ref<string>(sessionStorage.getItem('user_plan') || 'FREE');
const userRequests = ref<number>(parseInt(sessionStorage.getItem('user_requests') || '0', 10));
let inactivityTimer: ReturnType<typeof setTimeout> | null = null;
const INACTIVITY_LIMIT_MS = 10 * 60 * 1000; // 10 minutos

export function useAuth() {
  const setToken = (newToken: string) => {
    token.value = newToken;
    // SECURITY: Use sessionStorage so tokens vanish on tab close.
    sessionStorage.setItem('auth_token', newToken);
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
  };

  const logout = () => {
    token.value = null;
    user.value = null;
    userPlan.value = 'FREE';
    userRequests.value = 0;
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('user_plan');
    sessionStorage.removeItem('user_requests');
    localStorage.removeItem('auth_token'); // Cleanup legacy if exists
    delete axios.defaults.headers.common['Authorization'];
    if (inactivityTimer) clearTimeout(inactivityTimer);
  };

  const setUserRecord = (record: { plan?: string; number_requests?: number }) => {
    if (record.plan) {
      userPlan.value = record.plan;
      sessionStorage.setItem('user_plan', record.plan);
    }
    if (typeof record.number_requests === 'number') {
      userRequests.value = record.number_requests;
      sessionStorage.setItem('user_requests', String(record.number_requests));
    }
  };

  const resetInactivityTimer = () => {
    if (!token.value) return; // Solo actuar si hay sesión abierta
    if (inactivityTimer) clearTimeout(inactivityTimer);
    
    inactivityTimer = setTimeout(() => {
      logout();
      window.location.href = '/auth'; // Hard redirect para forzar el estado global a Login
    }, INACTIVITY_LIMIT_MS);
  };

  const setupActivityListeners = () => {
    window.addEventListener('mousemove', resetInactivityTimer);
    window.addEventListener('keydown', resetInactivityTimer);
    window.addEventListener('click', resetInactivityTimer);
    window.addEventListener('scroll', resetInactivityTimer);
    resetInactivityTimer();
  };

  const initializeAuth = () => {
    if (token.value) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;
      setupActivityListeners();
    }
  };

  return {
    token: computed(() => token.value),
    user: computed(() => user.value),
    userPlan: computed(() => userPlan.value),
    userRequests: computed(() => userRequests.value),
    isAuthenticated: computed(() => !!token.value),
    setToken,
    setUserRecord,
    logout,
    initializeAuth,
    setupActivityListeners
  };
}
