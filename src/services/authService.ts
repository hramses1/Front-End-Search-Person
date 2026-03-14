import axios from 'axios';
import type { UserCreate } from '../types/api';

const apiClient = axios.create({
  // SECURITY: URL definida en .env, nunca en el código fuente.
  baseURL: import.meta.env.VITE_API_BASE_URL as string,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Función para generar un ID aleatorio tipo PocketBase (15 caracteres alfanuméricos)
function generatePocketBaseId() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 15; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export const authService = {
  /**
   * Registra un nuevo usuario aplicando las directivas del contrato.
   */
  async register(userData: Partial<UserCreate>) {
    // Valores por defecto explícitos requeridos
    const payload = {
      id: generatePocketBaseId(), // El contrato exige ID
      ...userData,
      emailVisibility: true,
      disable: false,
      plan: 'cbbhqmwd0n978pi',
      number_requests: 0,
      token: 'not-token'
    };

    // Endpoint para crear usuarios (POST /api/users/create)
    const response = await apiClient.post('/api/users/create', payload);
    return response.data;
  },

  /**
   * Inicia sesión 1: Obtiene el ID llamando a la ruta de auth-with-password.
   */
  async login(payload: { identity: string; password: string }) {
    const response = await apiClient.post('/api/main/auth-with-password/', payload);
    return response.data;
  },

  /**
   * Inicia sesión 2: Obtiene el Token del SRI enviando el ID obtenido.
   */
  async getApiToken(userId: string) {
    const response = await apiClient.get('/api/main/login/?codigo=' + userId);
    return response.data;
  }
};
