/**
 * Cache en memoria compartido por los servicios de API.
 *
 * Vive en su propio módulo para que `useAuth` pueda vaciarlo durante el logout
 * sin necesidad de importar `apiService`: eso crearía una dependencia circular,
 * porque `apiService` necesita a su vez el token que expone `useAuth`.
 *
 * Vaciarlo en el logout no es opcional. El Map es de módulo, así que sobrevive
 * al cambio de usuario dentro de la misma pestaña, y los resultados que guarda
 * son datos personales (cédulas, denuncias, juicios, licencias).
 */

const CACHE_TTL = 5 * 60 * 1000;

interface CacheEntry {
  timestamp: number;
  data: any;
}

/** Resultados ya resueltos, con su marca de tiempo. */
const entries = new Map<string, CacheEntry>();

/** Peticiones en curso, para deduplicar llamadas idénticas simultáneas. */
const inFlight = new Map<string, Promise<any>>();

export const buildKey = (url: string, params: Record<string, any> = {}): string =>
  `${url}:${JSON.stringify(params)}`;

/** Devuelve el valor cacheado, o `undefined` si no existe o ya caducó. */
export const readCache = (key: string): any | undefined => {
  const hit = entries.get(key);
  if (!hit) return undefined;

  if (Date.now() - hit.timestamp >= CACHE_TTL) {
    entries.delete(key);
    return undefined;
  }

  return hit.data;
};

export const writeCache = (key: string, data: any): void => {
  entries.set(key, { timestamp: Date.now(), data });
};

export const readInFlight = (key: string): Promise<any> | undefined => inFlight.get(key);

export const trackInFlight = (key: string, request: Promise<any>): void => {
  inFlight.set(key, request);
};

export const forgetInFlight = (key: string): void => {
  inFlight.delete(key);
};

/** Vacía resultados y peticiones en curso. Se llama en cada logout. */
export const clearCache = (): void => {
  entries.clear();
  inFlight.clear();
};
