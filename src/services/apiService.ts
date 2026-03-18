import axios from 'axios';
import { useAuth } from '../composables/useAuth';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL as string,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Helper para decodificar datos obfuscados (Base64)
const decodeData = (data: any): any => {
  if (typeof data === 'string' && data.length > 10) {
    try {
      // Intentamos decodificar si parece Base64
      const decoded = atob(data);
      return JSON.parse(decoded);
    } catch {
      return data;
    }
  }
  return data;
};

// Interceptor para inyectar token
apiClient.interceptors.request.use((config) => {
  const { token } = useAuth();
  if (token.value) {
    if (config.headers && typeof config.headers.set === 'function') {
      config.headers.set('Authorization', `Bearer ${token.value}`);
    } else {
      config.headers.Authorization = `Bearer ${token.value}`;
    }
  }
  return config;
});

// AbortController para prevenir spam
const pendingRequests = new Map<string, AbortController>();

// Interceptor Global de Errores (Token Inválido, Expirado, Permisos)
apiClient.interceptors.response.use(
  response => {
    // Si la respuesta viene como un string crudo o dentro de un objeto 'secure_payload'
    if (response.data) {
      if (typeof response.data === 'string') {
        response.data = decodeData(response.data);
      } else if (response.data.payload) {
        response.data = decodeData(response.data.payload);
      }
    }
    return response;
  },
  err => {
    if (err.response && (err.response.status === 401 || err.response.status === 403)) {
      console.warn("Seguridad: Sesión expirada o token inválido.");
      sessionStorage.clear();
      window.location.href = '/auth'; // Hard redirect prevents infinite loops on vue-router sometimes 
    }
    return Promise.reject(err);
  }
);

// Cache en memoria para optimizar velocidad
const cache = new Map<string, { timestamp: number, data: any }>();
const CACHE_TTL = 5 * 60 * 1000; 

const fetchWithCache = async (url: string, params: any = {}) => {
  const key = `${url}:${JSON.stringify(params)}`;
  const cached = cache.get(key);

  if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
    return cached.data;
  }

  // Abortar si ya existe una petición en curso idéntica
  if (pendingRequests.has(key)) {
    pendingRequests.get(key)?.abort();
  }
  
  const controller = new AbortController();
  pendingRequests.set(key, controller);

  try {
    const response = await apiClient.get(url, { 
      params,
      signal: controller.signal
    });

    if (response.status === 200) {
      cache.set(key, { timestamp: Date.now(), data: response.data });
    }

    return response.data;
  } finally {
    pendingRequests.delete(key);
  }
};

export const apiService = {
  async getFullname(name?: string | null, lastname?: string | null) {
    const params: Record<string, string> = {};
    if (name) params.name = name;
    if (lastname) params.lastname = lastname;
    return fetchWithCache('/api/main/fullname/', params);
  },

  async getRuc(ruc: string) {
    return fetchWithCache('/api/main/ruc/', { ruc });
  },

  async getComplaint(ci: string) {
    return fetchWithCache('/api/main/complaint/', { ci });
  },

  async getComplaintsInformation(ci: string) {
    return fetchWithCache('/api/main/complaints_information/', { ci });
  },

  async getIdCard(ci: string) {
    return fetchWithCache('/api/main/id_card/', { ci });
  },

  async getLicense(ci: string) {
    return fetchWithCache('/api/main/license/', { ci });
  },

  async getCitation(ci: string) {
    return fetchWithCache('/api/main/citation/', { ci });
  },

  async getVehiclesByPlate(plate: string) {
    return fetchWithCache('/api/main/vehicles/by-plate/', { plate });
  },

  clearCache() {
    cache.clear();
  }
};
