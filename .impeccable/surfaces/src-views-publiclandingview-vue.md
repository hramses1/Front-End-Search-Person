---
version: 1
slug: "src-views-publiclandingview-vue"
primary_target: "src/views/PublicLandingView.vue"
related_targets: []
---

## Scope

Rediseño de identidad visual completa del sitio ("Portal de Consulta Ciudadana"), ancla en la portada pública (Persuade). El resto de superficies (panel/dashboard y secciones de consulta = Operate; guías, estado, legal = Read) hereda este mismo mundo visual, adaptado al registro de cada modo.

## Audiencia, tarea, prueba, restricciones

Cualquier ecuatoriano verificando datos públicos propios o de un tercero (cédula, RUC, licencia, vehículo, citaciones, procesos judiciales, denuncias) antes de una decisión real. La portada debe probar que resolver esto aquí se siente serio y cuidado, no burocrático ni genérico de SaaS. Restricción dura: `BrandMark` (logotipo) intocable, WCAG AA en todo el sitio.

## Direction contract

THESIS: Cada consulta es una pestaña de expediente que se abre y un sello que cae en el instante en que el dato queda verificado — no un dashboard con tarjetas de sombra genéricas.

OWN-WORLD: Fondo papel kraft/manila cálido (#C9A66B sobre #FBF6EC), tinta carbón para texto, rojo sello (#A4241C) como único acento saturado reservado a "verificado"/acción principal. Tipografía: titulares en Special Elite (máquina de escribir, usado con moderación, solo en momentos de sello/verificación), cuerpo en Archivo (grotesca cálida, legible), datos (cédula, RUC, placas) en Courier Prime tabular. Navegación como pestañas de carpeta rotuladas; tarjetas de resultado con borde de "hoja" y sombra de papel apilado, nunca `box-shadow` de tarjeta SaaS genérica.

STORY: El visitante entiende que esto reemplaza ir a varias ventanillas oficiales; cree que el dato que recibe es tan válido como uno sellado en persona; actúa probando la demo o registrándose.

FIRST VIEWPORT: Cabecera con logotipo (BrandMark intacto) y acceso. Titular + CTA a la izquierda (mitad superior). A la derecha, la demo en vivo dibujada como una hoja de expediente: al escribir la cédula, los campos se llenan fila por fila y, al responder, un sello rojo cae en seco sobre la hoja marcando "verificado". Debajo, franja de confianza (fuentes oficiales) y catálogo de consultas como pestañas de carpeta.

FORM: Expediente Sellado — challenger competitivo de origen "pop-culture-shelf-spy-dossier-title-sequence", elegido por el usuario en la ronda de dirección (seed key a00c7561, index asignado 4 no elegido; ganó el challenger). Se retira del original todo el marco de vigilancia/espionaje (mira de francotirador, tramas de halftone de vigilancia): se conserva únicamente el mecanismo de sello-que-cae como confirmación y la estructura de carpeta con pestañas.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.

## Sin resolver

- Tratamiento exacto del sello-animación en pantallas táctiles (sin hover).
- Cómo se traduce la pestaña de carpeta en el sidebar del dashboard existente (ya tiene estructura de rail vertical, reskinnable).
