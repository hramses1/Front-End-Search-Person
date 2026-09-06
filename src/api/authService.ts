import { apiClient } from './client';
import type { Quota } from '../utils/quota';
import type { UserCreate } from '../types/api';

/** Respuesta de /api/status/. Los nombres son los que devuelve el backend. */
export interface EstadoServicio {
  window_days: number;
  total_queries: number;
  /** Porcentaje de peticiones sin error propio. */
  availability: number;
  /** Porcentaje en el que la fuente oficial respondio. */
  source_availability: number;
  latency_p50_ms: number;
  latency_p95_ms: number;
  our_failures: number;
  source_failures: number;
}

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
   * Metricas publicas del servicio: disponibilidad, latencia mediana y total
   * servido en los ultimos siete dias.
   *
   * Separa lo que falla por nuestra parte de lo que falla en la fuente
   * oficial, que es la distincion honesta: una caida del Registro Civil no es
   * una caida nuestra, y mezclarlas daria una cifra que no significa nada.
   *
   * Va sin Bearer a proposito: es informacion publica.
   */
  async getEstadoServicio(): Promise<EstadoServicio | null> {
    const response = await apiClient.get('/api/status/');
    return response.data ?? null;
  },

  /**
   * Historial de consultas del propio usuario, paginado.
   *
   * `codigo` solo lo acepta un administrador, para ver el de otra persona.
   * Desde el panel nunca se envia: cada usuario ve lo suyo.
   */
  async getHistorial(page = 1, perPage = 30, codigo?: string) {
    const response = await apiClient.get('/api/users/history/', {
      headers: { 'Cache-Control': 'no-cache' },
      params: { page, perPage, ...(codigo ? { codigo } : {}), _t: Date.now() }
    });
    return response.data;
  },

  /** Descarga de todos los datos del usuario. Derecho de portabilidad. */
  async exportarCuenta() {
    const response = await apiClient.get('/api/users/export/');
    return response.data;
  },

  /**
   * Borrado de cuenta. Irreversible.
   *
   * `confirmar` es obligatorio y va explicito: sin el, el backend no procede.
   * La confirmacion de la interfaz es una segunda barrera, no la unica.
   */
  async eliminarCuenta() {
    const response = await apiClient.delete('/api/users/delete/', {
      params: { confirmar: true }
    });
    return response.data;
  },

  /** Conteo real de usuarios, incluidos los que no tienen plan asignado. */
  async getResumenUsuarios() {
    const response = await apiClient.get('/api/plan/users_summary/', {
      headers: { 'Cache-Control': 'no-cache' },
      params: { _t: Date.now() }
    });
    return response.data;
  },

  /** Mensaje de contacto. Publico, limitado por IP en el backend. */
  async enviarContacto(datos: { nombre: string; email: string; asunto?: string; mensaje: string; website?: string }) {
    const response = await apiClient.post('/api/contact', datos);
    return response.data;
  },

  /** Solicitud de bloqueo LOPDP. Publica. */
  async solicitarBloqueo(datos: { tipo: string; valor: string; solicitante_email: string; prueba?: string }) {
    const response = await apiClient.post('/api/lopdp/request', datos);
    return response.data;
  },

  /**
   * Demo publica de cedula: 5 al dia por IP, con los campos enmascarados
   * salvo nombre y cedula. No exige sesion.
   */
  async consultaDemo(ci: string) {
    const response = await apiClient.get('/api/main/demo/id_card/', { params: { ci } });
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
   * Listado completo de usuarios con su plan. Requiere token de admin.
   *
   * El backend topa perPage en 200, asi que con mas usuarios hace falta
   * recorrer las paginas. La primera se pide sola para saber cuantas hay y el
   * resto van en paralelo: son pocas peticiones y el limite por IP es de 120
   * por minuto, de modo que no hay riesgo de rafaga.
   */
  async getAllUsersPlans(perPage = 200, maxPaginas = 25) {
    const pedir = async (page: number) => {
      const r = await apiClient.get('/api/plan/get_all_users_plans/', {
        headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' },
        params: { page, perPage, _t: Date.now() }
      });
      return r.data;
    };

    const primera = await pedir(1);
    const totalPaginas = Math.min(primera?.totalPages ?? 1, maxPaginas);
    if (totalPaginas <= 1) return primera;

    const resto = await Promise.all(
      Array.from({ length: totalPaginas - 1 }, (_, i) => pedir(i + 2))
    );

    return {
      ...primera,
      items: [primera?.items ?? [], ...resto.map(r => r?.items ?? [])].flat(),
      // Se informa de si quedaron paginas fuera por el tope de seguridad.
      paginasOmitidas: Math.max(0, (primera?.totalPages ?? 1) - maxPaginas)
    };
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

  /**
   * Alta de un plan. Requiere token de admin.
   * PlanCreateModel exige descripcion (1-100 caracteres) y cupo diario.
   */
  async createPlan(datos: { description: string; daily_limit: number }) {
    const response = await apiClient.post('/api/plan/create', datos);
    return response.data;
  },

  /**
   * Edicion parcial de un plan: solo viaja lo que cambia.
   */
  async updatePlan(id: string, datos: { description?: string; daily_limit?: number }) {
    const response = await apiClient.patch('/api/plan/patch/', datos, { params: { id } });
    return response.data;
  },

  /**
   * Elimina un plan. Requiere token de admin.
   * El backend responde 409 si quedan usuarios asignados, de modo que no se
   * puede dejar a nadie huerfano por accidente.
   */
  async deletePlan(id: string) {
    const response = await apiClient.delete('/api/plan/delete/', { params: { id } });
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
      /*
       * createData va tipado como objeto libre, no como UserCreate, asi que
       * llega intacto a PocketBase. Por eso NO se mandan aqui plan,
       * number_requests, token ni disable: `plan` es un campo de relacion que
       * espera el id de un registro, y enviarle una cadena como 'free' hace
       * que PocketBase rechace la creacion del usuario. Esos valores los
       * impone el servidor igualmente.
       */
      createData: { emailVisibility: true }
    });
    return response.data;
  }
};
