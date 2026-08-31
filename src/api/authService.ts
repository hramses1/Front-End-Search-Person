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

  /**
   * Datos de un usuario.
   *
   * Actualmente sin uso: el panel de administracion dejo de necesitarlo cuando
   * get_all_users_plans empezo a devolver la cuota de cada usuario. Se mantiene
   * por ser el mapeo directo de un endpoint publicado.
   */
  async getUserData(userId: string) {
    const response = await apiClient.get('/api/users/get/', { params: { codigo: userId } });
    return response.data;
  },


  /**
   * Cuota diaria del usuario autenticado. Consultarla no la consume.
   *
   * Va sin cache de forma explicita: es un GET que cambia con cada consulta,
   * y tanto el navegador como el edge pueden reutilizar la respuesta anterior
   * por heuristica, devolviendo un contador viejo.
   */
  async getQuota(): Promise<Quota> {
    const response = await apiClient.get('/api/users/quota/', {
      headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' },
      params: { _t: Date.now() }
    });
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
  /**
   * Plan del usuario: descripción y límite diario.
   *
   * get_for_userid devuelve una LISTA paginada: un usuario puede tener varias
   * filas de plan. Quedarse con items[0] a ciegas mostraba "FREE" a un admin,
   * porque la fila de ADMIN venía después. Se elige la que casa con el rol
   * firmado en el token; si ninguna casa, la primera.
   *
   * El rol lo decide el servidor: aquí solo se usa para escoger qué etiqueta
   * pintar, nunca para conceder permisos.
   */
  async getUserPlan(userId: string, preferRole?: string) {
    const response = await apiClient.get('/api/plan/get_for_userid/', { params: { userid: userId } });
    const items = response.data?.items || [];

    if (items.length === 0) return null;

    if (preferRole) {
      const rol = preferRole.toUpperCase();
      const coincide = items.find((p: any) => p.planDescription?.toUpperCase().includes(rol));
      if (coincide) return coincide;
    }

    return items[0];
  },

  /**
   * Listado de usuarios con su plan. Requiere token de admin.
   *
   * Devuelve PlanUsersPaginatedResponseForUser: además de `items` trae `page`,
   * `perPage`, `totalPages` y `totalItems`. El panel no tiene paginación, así
   * que pide una página amplia y avisa si aun así se queda corta.
   */
  async getAllUsersPlans(perPage = 200) {
    const response = await apiClient.get('/api/plan/get_all_users_plans/', {
      headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' },
      params: { page: 1, perPage, _t: Date.now() }
    });
    return response.data;
  },

  /**
   * Catalogo de planes. Requiere token de admin.
   *
   * Devuelve ResponsePlanUsersModel: { id, description, daily_limit }. Estos
   * `id` son los unicos valores validos para el campo `plan` de un usuario; no
   * confundir con el `id` de una fila de plan_users, que es otra cosa.
   */
  async getPlans() {
    const response = await apiClient.get('/api/plan/get/');
    return response.data;
  },

  /**
   * Filas de plan del usuario, sin filtrar.
   *
   * get_for_userid devuelve una lista y un usuario puede tener varias filas.
   * number_requests es una propiedad del USUARIO, no de la fila, asi que todas
   * deberian traer el mismo valor; cuando no coinciden, quedarse con la
   * primera daba un numero distinto al del panel de administracion.
   */
  async getPlanItems(userId: string) {
    const response = await apiClient.get('/api/plan/get_for_userid/', {
      headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' },
      params: { userid: userId, _t: Date.now() }
    });
    return (response.data?.items || []) as any[];
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
