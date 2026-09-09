# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Cualquier persona en Ecuador que necesita verificar datos públicos, sean propios o de un tercero, antes de tomar una decisión real: revisar su propia cédula/RUC, comprobar el historial de un vehículo o sus multas antes de comprarlo, buscar a alguien por nombre y apellido, o confirmar si alguien tiene procesos judiciales o denuncias registradas antes de contratarlo o alquilarle algo. No es un producto exclusivamente de autoconsulta: el propio catálogo de la API (búsqueda por nombre, vehículo por placa, citaciones por placa, procesos judiciales) está diseñado para consultar a terceros con la misma facilidad que a uno mismo. Confirmado por el usuario con evidencia del OpenAPI del backend, no por suposición.

## Product Purpose

Reunir en una sola pantalla consultas que hoy están repartidas entre varios portales oficiales ecuatorianos (Registro Civil, SRI, ANT, Función Judicial), evitando repetir captchas y saltar de sitio en sitio. El usuario escribe una cédula, un nombre o una placa y recibe la ficha completa en segundos.

## Positioning

Frente a portales oficiales dispersos y frente a competidores que cobran por consulta (p. ej. ecuadorapi.com), este portal ofrece las mismas fuentes oficiales agregadas en un solo lugar, con una cuota diaria gratuita que se renueva a medianoche (hora de Ecuador) en vez de cobrar por consulta o vender paquetes de saldo.

## Operating Context

- Catálogo de consultas: cédula, RUC, licencia, vehículo por placa, citaciones (por cédula y por placa), procesos judiciales, denuncias, búsqueda por nombre/apellido, historial de consultas propio.
- Flujo típico: demo pública sin registro (3 consultas/día, solo cédula) → registro gratuito → panel (dashboard) con cuota diaria por cuenta, renovada a medianoche hora Ecuador → cada sección de consulta descuenta de esa cuota.
- Páginas públicas de contenido: guías sobre cómo leer documentos ecuatorianos, estado del servicio, novedades, formulario de contacto/soporte, solicitud de bloqueo de información (LOPDP), términos, privacidad.
- Backend FastAPI + PocketBase, ya en producción en devzio.site (API en api.devzio.site). Este trabajo de rediseño ocurre en la rama `develop`, sin tocar lo que corre en producción hasta fusionar.

## Capabilities and Constraints

- Los datos deben venir siempre de las fuentes oficiales reales vía el backend; nunca se inventan ni se completan cifras, entidades o resultados de ejemplo que no vengan de esas fuentes o de datos de muestra explícitamente marcados como tales.
- Cuota diaria por cuenta (varía según plan), visible en la cabecera del panel junto al tiempo para su renovación.
- Cumplimiento WCAG AA ya exigido en todo el sitio (objetivos táctiles de 44px, `:focus-visible`, contraste verificado) — constraint existente a mantener, no a relajar en el rediseño.
- Stack fijo: Vue 3 + `<script setup>` + TypeScript, Vite, Tailwind CSS, vue-router. No se cambia de stack.

## Brand Commitments

- Nombre del producto: "Portal de Consulta Ciudadana". Marca/empresa: "Devzio".
- El componente `BrandMark` (logotipo: texto con degradado bandera + tres barras de colores de la bandera de Ecuador) es intocable — ni sus colores, tamaño o tipografía siguen el sistema de diseño y no deben migrarse ni rediseñarse. Confirmado explícitamente por el usuario; fuera de eso, todo lo demás del diseño visual (paleta, tipografía, layout, componentes, copy no factual) está abierto a cambio.

## Evidence on Hand

- Demo pública en vivo funcionando (`/api/main/demo/id_card/`), sin necesidad de fabricar datos de muestra para mostrarla.
- OpenAPI real del backend (aportado por el usuario) documenta el catálogo completo de endpoints — usar como fuente de verdad sobre qué puede hacer el producto, no inventar funciones que no existen ahí.
- No hay testimonios, casos de estudio ni cifras de uso públicas que se puedan citar; no fabricar ninguno.

## Product Principles

1. Una sola pantalla reemplaza varios portales oficiales: cada decisión de diseño debe reforzar la sensación de "esto ya está resuelto aquí", no la de rellenar un formulario más.
2. El producto sirve tanto para revisar lo propio como para verificar a un tercero antes de una decisión real (contratar, alquilar, comprar) — el diseño no debe asumir que el visitante solo se consulta a sí mismo.
3. Gratis con cuota transparente es la ventaja competitiva real frente a quien cobra por consulta; debe sentirse honesto y visible, no oculto hasta el registro.
4. Dato público, fuente oficial, sin inventar nada: ni en el copy ni en los datos de ejemplo se simulan resultados que parezcan reales.
5. El logotipo (`BrandMark`) es la única pieza de identidad que no se toca; todo lo demás puede y debe cambiar para dejar de sentirse genérico.

## Accessibility & Inclusion

WCAG AA en todo el sitio: 44px mínimo de área táctil, `:focus-visible` visible, contraste verificado en ambos temas (claro/oscuro), navegación completa por teclado. Constraint ya establecida en el proyecto — el rediseño debe mantenerla, no partir de cero.
