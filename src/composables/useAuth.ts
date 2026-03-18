import { ref, computed } from 'vue';
import axios from 'axios';

const token = ref<string | null>(sessionStorage.getItem('auth_token'));
const user = ref<any>(null);
const userPlan = ref<string>(sessionStorage.getItem('user_plan') || 'FREE');
const planId = ref<string>(sessionStorage.getItem('plan_id') || '');
const userRequests = ref<number>(parseInt(sessionStorage.getItem('user_requests') || '0', 10));
const userId = ref<string>(sessionStorage.getItem('user_id') || '');
const userName = ref<string>(sessionStorage.getItem('user_name') || '');
const tokenLimit = ref<number>(parseInt(sessionStorage.getItem('token_limit') || '20', 10));
const isDark = ref<boolean>(sessionStorage.getItem('theme') !== 'light'); // Default to dark

let inactivityTimer: ReturnType<typeof setTimeout> | null = null;
const INACTIVITY_LIMIT_MS = 10 * 60 * 1000; // 10 minutos

export function useAuth() {
  const setToken = (newToken: string) => {
    token.value = newToken;

    console.log('Token set:', sessionStorage);
    sessionStorage.setItem('auth_token', newToken);
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
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
    delete axios.defaults.headers.common['Authorization'];
    if (inactivityTimer) clearTimeout(inactivityTimer);
  };

  const setUserRecord = (record: { id?: string; plan?: string; number_requests?: number; name?: string; username?: string }) => {
    if (record.id) {
      userId.value = record.id;
      sessionStorage.setItem('user_id', record.id);
    }
    if (record.plan && record.plan.length !== 15) {
      userPlan.value = record.plan;
      sessionStorage.setItem('user_plan', record.plan);
    } else if (record.plan) {
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
      document.documentElement.classList.toggle('light-mode', !isDark.value);
    }
  };

  const updateUserName = (newName: string) => {
    userName.value = newName;
    sessionStorage.setItem('user_name', newName);
  };

  const initializeAuth = () => {
    if (token.value) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;
      setupActivityListeners();
    }
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('light-mode', !isDark.value);
    }
  };

  return {
    token: computed(() => token.value),
    user: computed(() => user.value),
    userPlan: computed(() => userPlan.value),
    planId: computed(() => planId.value),
    userRequests: computed(() => userRequests.value),
    tokenLimit: computed(() => tokenLimit.value),
    userId: computed(() => userId.value),
    userName: computed(() => userName.value),
    isDark: computed(() => isDark.value),
    isAdmin: computed(() => {
      console.log('[DEBUG] isAdmin check:', { planId: planId.value, userPlan: userPlan.value });
      return planId.value === '5rkvp69sbpzz9cv' && userPlan.value.toUpperCase().includes('ADMIN');
    }),
    isAuthenticated: computed(() => !!token.value),
    setToken,
    setUserRecord,
    updateUserRequests,
    setPlanData,
    logout,
    initializeAuth,
    setupActivityListeners,
    toggleTheme,
    updateUserName
  };
}
