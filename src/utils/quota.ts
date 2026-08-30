/**
 * Utilidades de cuota diaria.
 *
 * La ventana es individual: arranca en la primera consulta de cada usuario y
 * dura 24 horas. No hay reset a medianoche, así que siempre se trabaja con el
 * `reset_at` que devuelve el servidor.
 */

export interface Quota {
  used: number;
  limit: number;
  remaining: number;
  reset_at: string;
}

/** Texto relativo hasta la renovación: "en 4 h 12 min". */
export const formatCountdown = (resetAt?: string | null): string => {
  if (!resetAt) return '';

  const ms = new Date(resetAt).getTime() - Date.now();
  if (!Number.isFinite(ms)) return '';
  if (ms <= 0) return 'en breve';

  const totalMinutes = Math.ceil(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return hours > 0 ? `en ${hours} h ${minutes} min` : `en ${minutes} min`;
};
