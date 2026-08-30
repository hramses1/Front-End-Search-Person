import { apiClient } from './client';
import {
  buildKey,
  clearCache,
  forgetInFlight,
  readCache,
  readInFlight,
  trackInFlight,
  writeCache
} from './cache';

/**
 * Ejecuta una consulta apoyándose en el cache compartido.
 *
 * Si ya hay una petición idéntica en vuelo se devuelve su promesa en lugar de
 * lanzar otra. Antes se abortaba la anterior, lo que dejaba a su llamador con
 * un CanceledError que las secciones mostraban como si la consulta hubiera
 * fallado.
 */
const fetchWithCache = async (url: string, params: Record<string, any> = {}) => {
  const key = buildKey(url, params);

  const cached = readCache(key);
  if (cached !== undefined) return cached;

  const pending = readInFlight(key);
  if (pending) return pending;

  const request = apiClient
    .get(url, { params })
    .then((response) => {
      if (response.status === 200) {
        writeCache(key, response.data);
      }
      return response.data;
    })
    .finally(() => forgetInFlight(key));

  trackInFlight(key, request);

  return request;
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

  /**
   * Consulta de procesos judiciales.
   *
   * JudgementSection ya llamaba a este método, pero no existía: la pestaña
   * lanzaba un TypeError en cada búsqueda. Pendiente de que el backend exponga
   * /api/main/judgement/ (hasta entonces responderá 404).
   */
  async getJudgement(ci: string) {
    return fetchWithCache('/api/main/judgement/', { ci });
  },

  async getVehiclesByPlate(plate: string) {
    // Limpieza de datos: remover guiones, espacios y asegurar mayúsculas
    const cleanPlate = plate.replace(/[-\s]/g, '').toUpperCase();
    return fetchWithCache('/api/main/vehicles/by-plate/', { plate: cleanPlate });
  },

  clearCache
};
