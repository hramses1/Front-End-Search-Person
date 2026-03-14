import axios from 'axios';
import { useAuth } from '../composables/useAuth';

const apiClient = axios.create({
  // SECURITY: URL definida en .env, nunca en el código fuente.
  baseURL: import.meta.env.VITE_API_BASE_URL as string,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para inyectar token y debug
apiClient.interceptors.request.use((config) => {
  const { token } = useAuth();
  if (token.value) {
    config.headers.Authorization = `Bearer ${token.value}`;
  }

  // LOG PARA DEBUG
  console.log('[Axios Request]', {
    url: config.baseURL! + config.url,
    method: config.method,
    headers: config.headers,
    params: config.params
  });

  return config;
});

apiClient.interceptors.response.use(
  res => res,
  err => {
    console.error('[Axios Error]', err.response?.status, err.response?.data);
    return Promise.reject(err);
  }
);

// Cache simple en memoria para optimizar respuestas repetidas
const cache = new Map<string, { timestamp: number, data: any }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

const fetchWithCache = async (url: string, params: any = {}) => {
  const key = `${url}:${JSON.stringify(params)}`;
  const cached = cache.get(key);
  
  if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
    console.log('[Cache Hit]', key);
    return cached.data;
  }

  const response = await apiClient.get(url, { params });
  
  // Guardamos solo si la respuesta es exitosa
  if (response.status === 200) {
    cache.set(key, { timestamp: Date.now(), data: response.data });
  }
  
  return response.data;
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
  }
};
