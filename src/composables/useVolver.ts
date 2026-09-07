import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from './useAuth';

/**
 * A dónde lleva el botón "volver" de las páginas públicas interiores.
 *
 * Iba fijo a la portada en las seis: quien llegaba desde el panel —por
 * ejemplo, desde el enlace de Ayuda a /contacto— y pulsaba volver, terminaba
 * en la portada en vez de donde estaba. Con sesión activa, "volver" significa
 * el panel; sin ella, la portada. La etiqueta cambia junto con el destino,
 * para no decir una cosa y hacer otra.
 */
export const useVolver = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const rutaVolver = computed(() => (isAuthenticated.value ? '/dashboard' : '/'));
  const etiquetaVolver = computed(() => (isAuthenticated.value ? 'Volver al panel' : 'Volver a la portada'));
  const irAVolver = () => router.push(rutaVolver.value);

  return { rutaVolver, etiquetaVolver, irAVolver };
};
