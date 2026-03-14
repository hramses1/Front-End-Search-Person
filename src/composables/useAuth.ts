import { ref, computed } from 'vue';
import axios from 'axios';

const token = ref<string | null>(sessionStorage.getItem('auth_token'));
const user = ref<any>(null);
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
    sessionStorage.removeItem('auth_token');
    localStorage.removeItem('auth_token'); // Cleanup legacy if exists
    delete axios.defaults.headers.common['Authorization'];
    if (inactivityTimer) clearTimeout(inactivityTimer);
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
    isAuthenticated: computed(() => !!token.value),
    setToken,
    logout,
    initializeAuth,
    setupActivityListeners
  };
}
