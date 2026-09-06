/**
 * Genera public/sitemap.xml antes de compilar.
 *
 * El sitemap se mantenía a mano y se quedó desfasado: /contacto llevaba tiempo
 * publicada y no estaba listada, así que el buscador no la veía. Generarlo desde
 * las mismas fuentes que usa la aplicación evita que vuelva a pasar.
 *
 * Las rutas privadas (/dashboard, /admin) no se listan nunca: van marcadas con
 * noIndexar en el router y además bloqueadas en robots.txt.
 */
import { writeFileSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const aqui = dirname(fileURLToPath(import.meta.url));
const raiz = resolve(aqui, '..');
const DOMINIO = 'https://devzio.site';

/*
 * Los slugs se leen del propio catálogo en vez de duplicarlos aquí. Es un
 * fichero TypeScript, así que se extraen con una expresión regular en lugar de
 * importarlo: añadir un compilador solo para esto no compensa, y si el formato
 * cambiara la comprobación de abajo lo detecta.
 */
const fuente = readFileSync(resolve(raiz, 'src/datos/consultas.ts'), 'utf8');
const slugs = [...fuente.matchAll(/^\s*slug:\s*'([a-z0-9-]+)'/gm)].map(m => m[1]);

if (slugs.length === 0) {
  console.error('[sitemap] No se encontró ningún slug en src/datos/consultas.ts.');
  console.error('[sitemap] Si cambió el formato del catálogo, hay que actualizar este script.');
  process.exit(1);
}

const hoy = new Date().toISOString().slice(0, 10);

/** prioridad y frecuencia por tipo de página, no por página suelta. */
const paginas = [
  { ruta: '', prioridad: '1.0', frecuencia: 'weekly' },
  ...slugs.map(slug => ({ ruta: `/${slug}`, prioridad: '0.9', frecuencia: 'weekly' })),
  { ruta: '/auth', prioridad: '0.8', frecuencia: 'monthly' },
  { ruta: '/contacto', prioridad: '0.5', frecuencia: 'monthly' },
  { ruta: '/terminos', prioridad: '0.3', frecuencia: 'yearly' },
  { ruta: '/privacidad', prioridad: '0.3', frecuencia: 'yearly' }
];

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...paginas.map(p => [
    '  <url>',
    `    <loc>${DOMINIO}${p.ruta}</loc>`,
    `    <lastmod>${hoy}</lastmod>`,
    `    <changefreq>${p.frecuencia}</changefreq>`,
    `    <priority>${p.prioridad}</priority>`,
    '  </url>'
  ].join('\n')),
  '</urlset>',
  ''
].join('\n');

writeFileSync(resolve(raiz, 'public/sitemap.xml'), xml, 'utf8');
console.log(`[sitemap] ${paginas.length} URLs (${slugs.length} consultas).`);
