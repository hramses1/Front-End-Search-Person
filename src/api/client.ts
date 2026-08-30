import axios from 'axios';
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuth } from '../composables/useAuth';
import { formatCountdown } from '../utils/quota';

/**
 * Cliente HTTP único de la aplicación.
 *
 * Antes existían dos instancias de axios independientes: la de `apiService`,
 * con interceptor de token, y la de `authService`, sin él. Las llamadas de
 * `authService` (datos de usuario, planes, panel de administración) salían por
 * tanto sin cabecera `Authorization`. Unificarlas evita que vuelvan a divergir.
 */

/**
 * Rutas públicas del proceso de autenticación.
 *
 * Un error aquí significa "credenciales incorrectas", no "sesión caducada": si
 * forzáramos el logout y la redirección, `AuthView` perdería el mensaje de
 * error y el usuario vería una recarga de página sin explicación.
 *
 * `/api/main/login/` ya NO entra en esta lista: dejó de emitir tokens y ahora
 * solo renueva el propio, exigiendo Bearer. Un 401 ahí sí es sesión muerta.
 */
const PUBLIC_AUTH_PATHS = [
  '/api/main/auth-with-password/',
  '/api/main/auth-with-oauth2/',
  '/api/main/auth-methods/',
  '/api/users/create'
];

const isPublicAuthPath = (url?: string): boolean =>
  !!url && PUBLIC_AUTH_PATHS.some((path) => url.startsWith(path));

export const apiClient = axios.create({
  // SECURITY: la URL vive en .env, nunca en el código fuente.
  baseURL: import.meta.env.VITE_API_BASE_URL as string,
  headers: {
    'Content-Type': 'application/json'
  }
});

/* -------------------------------------------------------------------------- */
/* Request: inyección del token                                               */
/* -------------------------------------------------------------------------- */

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const { token } = useAuth();

  if (token.value && config.headers) {
    if (typeof config.headers.set === 'function') {
      config.headers.set('Authorization', `Bearer ${token.value}`);
    } else {
      (config.headers as Record<string, unknown>).Authorization = `Bearer ${token.value}`;
    }
  }

  return config;
});

/* -------------------------------------------------------------------------- */
/* Response: payloads ofuscados                                               */
/* -------------------------------------------------------------------------- */

const BASE64_PATTERN = /^[A-Za-z0-9+/]+={0,2}$/;

/**
 * Decodifica un payload ofuscado en Base64.
 *
 * Se aplican tres filtros antes de aceptar el resultado (longitud múltiplo de
 * cuatro, alfabeto Base64 estricto y que lo decodificado sea un objeto o un
 * array) para no transformar por accidente un dato legítimo que casualmente
 * fuese Base64 válido.
 */
const decodeSecurePayload = (value: unknown): unknown => {
  if (typeof value !== 'string') return value;
  if (value.length < 12 || value.length % 4 !== 0) return value;
  if (!BASE64_PATTERN.test(value)) return value;

  try {
    const parsed = JSON.parse(atob(value));
    return parsed && typeof parsed === 'object' ? parsed : value;
  } catch {
    return value;
  }
};

/* -------------------------------------------------------------------------- */
/* Response: normalización de errores                                         */
/* -------------------------------------------------------------------------- */

/**
 * Códigos de error estables del backend.
 *
 * Ramifica siempre por este código, nunca por el texto de `message`: el texto
 * puede cambiar, el código no.
 */
export type ApiErrorCode =
  | 'quota_exceeded'
  | 'rate_limited'
  | 'not_found'
  | 'invalid_input'
  | 'source_unavailable'
  | 'unauthorized'
  | 'forbidden'
  | 'internal_error';

export interface ApiErrorBody {
  error?: ApiErrorCode | string;
  message?: string;
  detail?: any;
}

/** AxiosError enriquecido por el interceptor. */
export interface ApiError extends AxiosError<ApiErrorBody> {
  /** Código estable devuelto por el backend, si lo hay. */
  apiCode?: ApiErrorCode | string;
  /** Momento de renovación de la cuota. Solo en `quota_exceeded`. */
  quotaResetAt?: string;
}

const CODE_MESSAGES: Record<string, string> = {
  rate_limited: 'Demasiadas peticiones. Espera un momento e intenta de nuevo.',
  not_found: 'Sin resultados para esta búsqueda.',
  invalid_input: 'Revisa los datos ingresados.',
  source_unavailable: 'La fuente oficial no responde. No se descontó la consulta.',
  unauthorized: 'Tu sesión expiró. Vuelve a iniciar sesión.',
  forbidden: 'No tienes permiso para realizar esta operación.',
  internal_error: 'Ocurrió un error inesperado. Intenta de nuevo en unos minutos.'
};

/** Respaldo por código HTTP, para respuestas que no traigan `error`. */
const STATUS_MESSAGES: Record<number, string> = {
  400: 'La consulta no es válida. Revisa los datos ingresados.',
  401: 'Tu sesión expiró. Vuelve a iniciar sesión.',
  403: 'No tienes permiso para realizar esta operación.',
  404: 'Sin resultados para esta búsqueda.',
  422: 'Los datos enviados no tienen el formato esperado.',
  429: 'Demasiadas peticiones. Espera un momento e intenta de nuevo.',
  500: 'Ocurrió un error inesperado. Intenta de nuevo en unos minutos.',
  502: 'La fuente oficial no responde. No se descontó la consulta.',
  503: 'La fuente oficial no responde. No se descontó la consulta.',
  504: 'La fuente oficial tardó demasiado en responder.'
};

/**
 * Traduce el error del backend a algo mostrable y deja el código accesible.
 *
 * Las secciones del dashboard pintan `err.message` directamente, así que sin
 * esto el usuario leería "Request failed with status code 429". `err.response`
 * se conserva intacto para quien necesite el detalle completo.
 */
const normalizeError = (err: ApiError): void => {
  if (!err.response) {
    err.message = 'No se pudo contactar con el servidor. Revisa tu conexión.';
    return;
  }

  const body = err.response.data as ApiErrorBody | undefined;
  const code = body?.error;

  err.apiCode = code;

  // quota_exceeded y rate_limited comparten el 429 pero significan cosas
  // distintas: uno es la cuota diaria del usuario, el otro el límite por IP.
  if (code === 'quota_exceeded') {
    const resetAt = body?.detail?.reset_at as string | undefined;
    err.quotaResetAt = resetAt;

    const cuando = formatCountdown(resetAt);
    err.message = cuando
      ? `Agotaste tus consultas del día. Se renuevan ${cuando}.`
      : 'Agotaste tus consultas del día.';
    return;
  }

  if (code && CODE_MESSAGES[code]) {
    err.message = CODE_MESSAGES[code];
    return;
  }

  // Mensaje propio del backend, si trae uno pensado para el usuario.
  if (typeof body?.message === 'string' && body.message.trim()) {
    err.message = body.message;
    return;
  }

  const status = err.response.status;
  if (STATUS_MESSAGES[status]) {
    err.message = STATUS_MESSAGES[status];
  }
};

apiClient.interceptors.response.use(
  (response) => {
    if (response.data) {
      if (typeof response.data === 'string') {
        response.data = decodeSecurePayload(response.data);
      } else if (typeof response.data.payload === 'string') {
        const decoded = decodeSecurePayload(response.data.payload);
        // Solo sustituimos la respuesta si el campo era de verdad un payload
        // ofuscado. Antes se reemplazaba siempre, lo que habría cambiado la
        // forma de cualquier respuesta que tuviera un campo llamado `payload`
        // (las de authService ahora también pasan por aquí).
        if (decoded !== response.data.payload) {
          response.data = decoded;
        }
      }
    }
    return response;
  },
  (err: ApiError) => {
    const status = err.response?.status;

    // Solo el 401 implica sesión inválida (token caducado o corrupto). Un 403
    // es "sin permiso sobre este recurso" y cerrar la sesión ahí expulsaba al
    // usuario sin motivo.
    if (status === 401 && !isPublicAuthPath(err.config?.url)) {
      const { logout, isAuthenticated } = useAuth();

      if (isAuthenticated.value) {
        // logout() limpia la sesión, el cache de resultados y el temporizador
        // de inactividad. Antes se hacía sessionStorage.clear(), que además
        // borraba el tema y las claves PKCE del flujo de OAuth.
        logout();
        window.location.href = '/auth';
      }
    }

    if (!isPublicAuthPath(err.config?.url)) {
      normalizeError(err);
    }

    return Promise.reject(err);
  }
);

export default apiClient;
