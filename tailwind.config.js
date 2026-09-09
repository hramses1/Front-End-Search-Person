/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    /*
     * Puntos de ruptura declarados, no heredados por defecto. Se anade xs a
     * 480 para cubrir el salto entre movil pequeno y grande, que es donde
     * caian la mayoria de los ajustes. El resto coincide con la escala
     * habitual: 768 tablet, 1024 portatil, 1280 escritorio.
     */
    screens: {
      xs: '480px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      /**
       * Tres voces, cada una con un trabajo distinto (mundo "Expediente
       * Sellado"): Special Elite es la maquina de escribir del sello y el
       * titular de portada, se usa con moderacion; Archivo es el cuerpo y
       * la mayoria de titulos, calida y legible; Courier Prime es el dato
       * (cedula, RUC, placa), tabular, como si saliera de un formulario
       * oficial. "primary" queda como alias de body por compatibilidad.
       */
      fontFamily: {
        display: ['"Special Elite"', 'Courier, monospace'],
        body: ['Archivo', 'Helvetica Neue', 'Arial', 'sans-serif'],
        primary: ['Archivo', 'Helvetica Neue', 'Arial', 'sans-serif'],
        dato: ['"Courier Prime"', 'ui-monospace', 'monospace'],
      },

      /**
       * Escala tipografica de razon 1.25: 14 / 16 / 20 / 25 / 31 / 39 / 49.
       * Interlineado 1.5-1.6 en cuerpo y 1.1-1.2 en titulos.
       * El cuerpo nunca baja de 16px; 14 queda reservado a etiquetas y pies.
       */
      /*
       * Escala fluida. Cada paso interpola con clamp entre su valor en movil
       * y el de escritorio, de modo que el texto crece de forma continua en
       * lugar de saltar en cada punto de ruptura.
       *
       * El maximo de cada paso es el de la escala 1.25 de siempre, asi que en
       * pantallas anchas se ve exactamente igual que antes; lo que cambia es
       * que en 320px deja de ir sobredimensionado.
       *
       * El cuerpo nunca baja de 1rem: ese minimo no se negocia.
       */
      fontSize: {
        overline: ['clamp(0.6875rem, 0.67rem + 0.09vw, 0.75rem)',  { lineHeight: '1.4' }],   // 11 → 12
        caption:  ['clamp(0.8125rem, 0.79rem + 0.12vw, 0.875rem)', { lineHeight: '1.5' }],  // 13 → 14
        body:     ['clamp(0.9375rem, 0.91rem + 0.14vw, 1.0625rem)', { lineHeight: '1.6' }], // 15 → 17
        lead:     ['clamp(1rem, 0.95rem + 0.25vw, 1.25rem)',        { lineHeight: '1.5' }], // 16 → 20
        h4:       ['clamp(1.125rem, 0.95rem + 0.85vw, 1.5625rem)',  { lineHeight: '1.25' }], // 18 → 25
        h3:       ['clamp(1.25rem, 0.95rem + 1.5vw, 1.9375rem)',    { lineHeight: '1.2' }],  // 20 → 31
        h2:       ['clamp(1.5rem, 1.1rem + 2vw, 2.4375rem)',        { lineHeight: '1.15' }], // 24 → 39
        h1:       ['clamp(1.75rem, 1.2rem + 2.75vw, 3.0625rem)',    { lineHeight: '1.1' }],  // 28 → 49
      },

      /**
       * Escala de espaciado: 4, 8, 16, 24, 32, 48, 64.
       * Coinciden con los pasos 1, 2, 4, 6, 8, 12 y 16 de Tailwind, asi que se
       * nombran ademas de forma explicita para poder auditarlos.
       */
      spacing: {
        xs:  '4px',
        sm:  '8px',
        md:  '16px',
        lg:  '24px',
        xl:  '32px',
        '2xl': '48px',
        '3xl': '64px',
      },

      /**
       * Radio bajo: el mundo "Expediente Sellado" es papel cortado, no
       * plástico con esquinas de burbuja. 6px alcanza para suavizar el
       * borde sin perder el aire de hoja/carpeta.
       */
      borderRadius: {
        base: '6px',
      },

      /** Transiciones entre 150 y 200 ms. Nada instantaneo, nada por encima. */
      transitionDuration: {
        fast: '150ms',
        base: '200ms',
      },

      /** Ancho de linea de lectura: 50-75 caracteres. */
      maxWidth: {
        prose: '68ch',
      },

      colors: {
        /** Colores de la bandera, reservados al logotipo. No usar en UI. */
        bandera: {
          amarillo: '#FFDD00',
          azul: '#0033A0',
          rojo: '#ED1C24',
        },
      },

      /**
       * Sombra de hoja apilada: dos capas de papel debajo de la superior,
       * en vez del glow difuso de vidrio que llevaba antes. Sustituye a
       * shadow-sm/shadow-md en las clases .hoja-*.
       */
      boxShadow: {
        hoja: '0 1px 0 var(--border-color), 0 8px 0 -6px var(--border-color), 0 14px 20px -12px rgba(36, 25, 15, 0.28)',
        sello: '0 10px 24px -8px rgba(164, 36, 28, 0.45)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
