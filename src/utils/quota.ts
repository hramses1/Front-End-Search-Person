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

/**
 * Próxima medianoche en Ecuador, que es cuando el backend pone a cero la
 * cuota de los planes gratuitos.
 *
 * Ecuador es UTC−5 todo el año y no aplica horario de verano, así que las
 * 00:00 locales son siempre las 05:00 UTC. Se calcula sobre la fecha del país
 * y no la del navegador, para que un usuario fuera de Ecuador vea la cuenta
 * atrás real y no la de su propio huso.
 */
export const proximaRenovacion = (): string => {
  const hoyEc = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Guayaquil',
    year: 'numeric', month: '2-digit', day: '2-digit'
  }).format(new Date());

  const [anio, mes, dia] = hoyEc.split('-').map(Number);
  return new Date(Date.UTC(anio, mes - 1, dia + 1, 5, 0, 0)).toISOString();
};

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
