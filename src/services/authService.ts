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
   * Inicia sesión 2: Obtiene el Token del Portal de consulta ciudadana enviando el ID obtenido.
   */
  async getApiToken(userId: string) {
    const response = await apiClient.get('/api/main/login/?codigo=' + userId);
    return response.data;
  },

  /**
   * Obtiene los datos actuales del usuario (incluyendo number_requests actualizado).
   */
  async getUserData(userId: string) {
    const response = await apiClient.get('/api/users/get/', { params: { codigo: userId } });
    return response.data;
  },

  /**
   * Obtiene todos los usuarios con sus planes (Solo Admin).
   */
  async getAllUsersPlans() {
    const response = await apiClient.get('/api/plan/get_all_users_plans/');
    return response.data;
  },

  /**
   * Actualiza los datos de un usuario (Solo Admin).
   */
  async patchUser(userId: string, data: any) {
    const response = await apiClient.patch(`/api/users/patch?codigo=${userId}`, data);
    return response.data;
  },

  /**
   * Obtiene la descripción del plan del usuario. Si hay varios, prioriza el de mayor nivel (ADMIN).
   */
  async getUserPlan(userId: string) {
    const response = await apiClient.get('/api/plan/get_for_userid/', { params: { userid: userId } });
    const items = response.data?.items || [];
    
    if (items.length === 0) return null;
    
    // Priorizar plan ADMIN si existe en la lista
    const adminPlan = items.find((p: any) => 
      p.planDescription?.toUpperCase().includes('ADMIN') && 
      p.id === '5rkvp69sbpzz9cv'
    );
    
    return adminPlan || items[0];
  },

  /**
   * Obtiene los métodos de autenticación disponibles (Ej: Google OAuth2)
   */
  async getAuthMethods() {
    const response = await apiClient.get('/api/main/auth-methods/');
    return response.data;
  },

  /**
   * Inicia sesión o registra un usuario procesando el código de retorno de OAuth2 (Google)
   */
  async authWithOAuth2(provider: string, code: string, codeVerifier: string, redirectUrl: string) {
    const payload = {
      provider,
      code,
      codeVerifier,
      redirectUrl,
      createData: {
        id: generatePocketBaseId(),
        emailVisibility: true,
        disable: false,
        plan: 'cbbhqmwd0n978pi', // Plan Free por defecto si es usuario nuevo
        number_requests: 0,
        token: 'not-token'
      }
    };
    
    const response = await apiClient.post('/api/main/auth-with-oauth2/', payload);
    return response.data;
  },

  /**
   * Obtiene el token oficial del sistema llamando al Login Endpoint principal usando el ID de PocketBase
   */
  async getSystemToken(codigo: string) {
    const response = await apiClient.get('/api/main/login/', { params: { codigo } });
    return response.data;
  },

  /**
   * Actualiza datos específicos del usuario en PocketBase (Ej: Username)
   */
  async updateUser(userId: string, data: any) {
    const response = await apiClient.patch('/api/users/patch/', data, {
      params: { codigo: userId }
    });
    return response.data;
  }
};
