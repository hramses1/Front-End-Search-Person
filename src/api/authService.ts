import { apiClient } from './client';
import type { Quota } from '../utils/quota';
import type { UserCreate } from '../types/api';

export const authService = {
  /**
   * Registra un nuevo usuario.
   *
   * OJO con la asimetría: el servidor IGNORA los valores de `plan`,
   * `number_requests`, `token` y `disable`, pero el modelo UserCreate los
   * declara obligatorios, así que deben viajar igualmente. Omitirlos devuelve
   * 422 con la lista completa en detail.fields.
   *
   * El `id` sí es opcional y lo genera el servidor: por eso desapareció
   * `generatePocketBaseId()`.
   */
  async register(userData: Partial<UserCreate>) {
    const response = await apiClient.post('/api/users/create', {
      plan: 'free',
      number_requests: 0,
      token: '',
      ...userData,
      emailVisibility: true,
      disable: false
    });
    return response.data;
  },

  /**
   * Autenticación con contraseña.
   *
   * La respuesta trae DOS tokens: `token` es el de PocketBase y `access_token`
   * es el Bearer que acepta nuestra API. Mandar el de PocketBase da 401 en
   * todos los endpoints.
   */
  async login(payload: { identity: string; password: string }) {
    const response = await apiClient.post('/api/main/auth-with-password/', payload);
    return response.data;
  },

  /**
   * Renueva el token del usuario autenticado.
   *
   * Exige Bearer válido y ya no descuenta cuota. Con tokens de 60 minutos y
   * cierre por inactividad a los 10, en la práctica no hace falta llamarlo.
   */
  async renewToken(userId: string) {
    const response = await apiClient.get('/api/main/login/', { params: { codigo: userId } });
    return response.data;
  },

  /** Datos del usuario autenticado. */
  async getUserData(userId: string) {
    const response = await apiClient.get('/api/users/get/', { params: { codigo: userId } });
    return response.data;
  },

  /** Cuota diaria del usuario autenticado. Consultarla no la consume. */
  async getQuota(): Promise<Quota> {
    const response = await apiClient.get('/api/users/quota/');
    return response.data;
  },

  /**
   * Actualiza el usuario autenticado.
   *
   * Solo admite `username`, `name`, `emailVisibility` y contraseñas. Enviar
   * `plan`, `number_requests`, `token` o `disable` devuelve 403 con la lista de
   * campos rechazados en `detail.fields`.
   */
  async updateUser(userId: string, data: any) {
    const response = await apiClient.patch('/api/users/patch/', data, {
      params: { codigo: userId }
    });
    return response.data;
  },

  /**
   * Alias de `updateUser` para las escrituras del panel de administración.
   * Requiere que el token lleve el claim de admin.
   */
  async patchUser(userId: string, data: any) {
    return this.updateUser(userId, data);
  },

  /**
   * Plan del usuario: descripción y límite diario.
   *
   * Ya no busca el plan de ADMIN por ID. El rol viaja como claim `role` firmado
   * en el JWT y se resuelve en el servidor.
   */
  async getUserPlan(userId: string) {
    const response = await apiClient.get('/api/plan/get_for_userid/', { params: { userid: userId } });
    const items = response.data?.items || [];
    return items.length > 0 ? items[0] : null;
  },

  /**
   * Listado de usuarios con su plan, para el panel de administración.
   *
   * PENDIENTE: el backend eliminó /api/plan/get_all_users_plans/ al cerrar A1
   * y no publicó reemplazo, así que hoy responde 404. Se mantiene la llamada
   * para no borrar AdminView hasta decidir si se reexpone con guard de admin.
   */
  async getAllUsersPlans() {
    const response = await apiClient.get('/api/plan/get_all_users_plans/', {
      headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' },
      params: { _t: Date.now() }
    });
    return response.data;
  },

  /** Métodos de autenticación disponibles (ej. Google OAuth2). */
  async getAuthMethods() {
    const response = await apiClient.get('/api/main/auth-methods/');
    return response.data;
  },

  /**
   * Inicia sesión o registra vía OAuth2. Devuelve la misma forma que
   * `login()`, `access_token` incluido.
   */
  async authWithOAuth2(provider: string, code: string, codeVerifier: string, redirectUrl: string) {
    const response = await apiClient.post('/api/main/auth-with-oauth2/', {
      provider,
      code,
      codeVerifier,
      redirectUrl,
      // createData acaba pasando por el mismo modelo, así que lleva los
      // campos obligatorios aunque el servidor imponga sus propios valores.
      createData: {
        emailVisibility: true,
        disable: false,
        plan: 'free',
        number_requests: 0,
        token: ''
      }
    });
    return response.data;
  }
};
