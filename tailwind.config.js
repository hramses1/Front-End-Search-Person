/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
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
      fontSize: {
        // Paso inferior de la misma razon 1.25 (14 / 1.25). Reservado a
        // rotulos en mayusculas y sobretitulos. Nunca para cuerpo de texto.
        overline: ['0.75rem', { lineHeight: '1.4' }],   // 12
        caption: ['0.875rem', { lineHeight: '1.5' }],   // 14
        body:    ['1rem',     { lineHeight: '1.6' }],   // 16
        lead:    ['1.25rem',  { lineHeight: '1.5' }],   // 20
        h4:      ['1.5625rem', { lineHeight: '1.2' }],  // 25
        h3:      ['1.9375rem', { lineHeight: '1.2' }],  // 31
        h2:      ['2.4375rem', { lineHeight: '1.15' }], // 39
        h1:      ['3.0625rem', { lineHeight: '1.1' }],  // 49
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
