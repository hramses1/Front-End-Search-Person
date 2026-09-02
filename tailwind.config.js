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
       * Una sola familia. La jerarquia la marcan tamano y peso, no un cambio
       * de tipografia. Los tres alias existen por compatibilidad con las
       * clases que ya estaban repartidas por las vistas.
       */
      fontFamily: {
        display: ['Inter', 'Helvetica Neue', 'Arial', 'sans-serif'],
        body: ['Inter', 'Helvetica Neue', 'Arial', 'sans-serif'],
        primary: ['Inter', 'Helvetica Neue', 'Arial', 'sans-serif'],
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
        overline: ['clamp(0.6875rem, 0.67rem + 0.09vw, 0.75rem)', { lineHeight: '1.4' }],   // 11 → 12
        caption:  ['clamp(0.8125rem, 0.79rem + 0.12vw, 0.875rem)', { lineHeight: '1.5' }],  // 13 → 14
        body:     ['clamp(1rem, 0.98rem + 0.1vw, 1.0625rem)',      { lineHeight: '1.6' }],  // 16 → 17
        lead:     ['clamp(1.125rem, 1.05rem + 0.35vw, 1.25rem)',   { lineHeight: '1.5' }],  // 18 → 20
        h4:       ['clamp(1.25rem, 1.09rem + 0.78vw, 1.5625rem)',  { lineHeight: '1.25' }], // 20 → 25
        h3:       ['clamp(1.5rem, 1.28rem + 1.1vw, 1.9375rem)',    { lineHeight: '1.2' }],  // 24 → 31
        h2:       ['clamp(1.75rem, 1.4rem + 1.75vw, 2.4375rem)',   { lineHeight: '1.15' }], // 28 → 39
        h1:       ['clamp(2rem, 1.46rem + 2.7vw, 3.0625rem)',      { lineHeight: '1.1' }],  // 32 → 49
      },

      /**
       * Escala de espaciado: 4, 8, 16, 24, 32, 48, 64.
       * Coinciden con los pasos 1, 2, 4, 6, 8, 12 y 16 de Tailwind, asi que se
       * nombran ademas de forma explicita para poder auditarlos.
       */
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        '2xl': '48px',
        '3xl': '64px',
      },

      /** Un unico radio base para botones, tarjetas, entradas y paneles. */
      borderRadius: {
        base: '16px',
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
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
