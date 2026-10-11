import { ref, computed } from 'vue';
import { apiClient } from '../api/client';

/**
 * Estado de fuentes y endpoints (GET /api/status/endpoints/).
 *
 * Singleton de modulo: un solo sondeo compartido por toda la app, aunque
 * varios componentes lo usen. El servidor cachea 60 s, asi que no tiene
 * sentido sondear mas seguido.
 */
export type EstadoEndpoint = 'up' | 'degraded' | 'down';

interface RespuestaEstado {
  sources: Record<string, { name: string; status: 'up' | 'down' }>;
  endpoints: Record<string, { status: EstadoEndpoint; down_sources: string[] }>;
}

const INTERVALO_MS = 60_000;

const datos = ref<RespuestaEstado | null>(null);
let temporizador: ReturnType<typeof setInterval> | undefined;
let usuarios = 0;

const sondear = async () => {
  try {
    const { data } = await apiClient.get<RespuestaEstado>('/api/status/endpoints/');
    datos.value = data;
  } catch {
    // Si el propio sondeo falla no se marca todo como caido: se oculta el
    // indicador y la señal definitiva sigue siendo el 503 de la consulta real.
    datos.value = null;
  }
};

const alVolver = () => {
  if (document.visibilityState === 'visible') sondear();
};

export const useEstadoFuentes = () => {
  const iniciar = () => {
    if (usuarios++ > 0) return;
    sondear();
    temporizador = setInterval(() => {
      if (document.visibilityState === 'visible') sondear();
    }, INTERVALO_MS);
    document.addEventListener('visibilitychange', alVolver);
  };

  const detener = () => {
    if (--usuarios > 0) return;
    clearInterval(temporizador);
    document.removeEventListener('visibilitychange', alVolver);
  };

  /**
   * Peor estado entre las rutas dadas, con los nombres de las fuentes caidas.
   * Una ruta que el backend no reporta (rutas nuevas) cuenta como 'up'.
   */
  const estadoDe = (rutas: string[]) => {
    const orden: EstadoEndpoint[] = ['up', 'degraded', 'down'];
    let peor: EstadoEndpoint = 'up';
    const caidas = new Set<string>();

    for (const ruta of rutas) {
      const e = datos.value?.endpoints[ruta];
      if (!e) continue;
      if (orden.indexOf(e.status) > orden.indexOf(peor)) peor = e.status;
      e.down_sources.forEach((id) => caidas.add(datos.value?.sources[id]?.name ?? id));
    }
    return { estado: peor, fuentesCaidas: [...caidas] };
  };

  return { iniciar, detener, estadoDe, disponible: computed(() => datos.value !== null) };
};
