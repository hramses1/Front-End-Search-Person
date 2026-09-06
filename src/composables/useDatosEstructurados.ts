import { onMounted, onUnmounted, watch, type Ref } from 'vue';

/**
 * Inyecta JSON-LD en el head y lo retira al salir de la vista.
 *
 * El patrón estaba escrito a mano dentro de LegalView. Al añadir las páginas de
 * consulta hacían falta tres bloques por vista, así que se extrae aquí: si cada
 * vista lo copiaba, era cuestión de tiempo que una se dejara el `remove` y el
 * buscador viera migas de una página que ya no se está viendo.
 */
export const useDatosEstructurados = (construir: () => object | object[] | null) => {
  let script: HTMLScriptElement | null = null;

  const pintar = () => {
    const datos = construir();
    if (!datos) {
      script?.remove();
      script = null;
      return;
    }
    if (!script) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(datos);
  };

  onMounted(pintar);
  onUnmounted(() => {
    script?.remove();
    script = null;
  });

  return { pintar };
};

/** Migas de pan. El primer nivel siempre es la portada. */
export const migas = (ruta: string, nombre: string, intermedio?: { nombre: string; ruta: string }) => {
  const base = 'https://devzio.site';
  const items = [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: `${base}/` }];
  if (intermedio) {
    items.push({ '@type': 'ListItem', position: 2, name: intermedio.nombre, item: `${base}${intermedio.ruta}` });
  }
  items.push({ '@type': 'ListItem', position: items.length + 1, name: nombre, item: `${base}${ruta}` });
  return { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items };
};

/** Preguntas frecuentes de una página concreta. */
export const preguntas = (faq: { p: string; r: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faq.map(f => ({
    '@type': 'Question',
    name: f.p,
    acceptedAnswer: { '@type': 'Answer', text: f.r }
  }))
});

/** Vuelve a pintar cuando cambia la ruta, sin desmontar el componente. */
export const repintarAlCambiar = (fuente: Ref<unknown>, pintar: () => void) => {
  watch(fuente, pintar);
};
