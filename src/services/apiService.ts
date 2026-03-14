import axios from 'axios';
import { useAuth } from '../composables/useAuth';
import { CLIENT_RENEG_LIMIT } from 'tls';

const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/',
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

export const apiService = {
  async getFullname(name?: string | null, lastname?: string | null) {
    const params: Record<string, string> = {};
    if (name) params.name = name;
    if (lastname) params.lastname = lastname;
    const response = await apiClient.get('/api/main/fullname/', { params });
    return response.data;
  },

  async getRuc(ruc: string) {
    const response = await apiClient.get('/api/main/ruc/', { params: { ruc } });
    return response.data;
  },

  async getComplaint(ci: string) {
    const response = await apiClient.get('/api/main/complaint/', { params: { ci } });
    return response.data;
  },

  async getComplaintsInformation(ci: string) {
    const response = await apiClient.get('/api/main/complaints_information/', { params: { ci } });
    return response.data;
  },

  async getIdCard(ci: string) {
    const response = await apiClient.get('/api/main/id_card/', { params: { ci } });
    return response.data;
  },

  async getLicense(ci: string) {
    const response = await apiClient.get('/api/main/license/', { params: { ci } });
    return response.data;
  },

  async getCitation(ci: string) {
    const response = await apiClient.get('/api/main/citation/', { params: { ci } });
    return response.data;
  },

  async getVehiclesByPlate(plate: string) {
    const response = await apiClient.get('/api/main/vehicles/by-plate/', { params: { plate } });
    return response.data;
  }
};
