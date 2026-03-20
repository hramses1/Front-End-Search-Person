/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        primary: ['Space Grotesk', 'sans-serif'],
      },
      colors: {
        obsidian: {
          light: '#28282e',
          soft: 'rgba(22, 22, 26, 0.4)',
          DEFAULT: '#16161a',
          dark: '#0f0f11'
        },
        smoke: '#8a8a95',
        silver: '#e4e4e9',
        'pale-blue': '#b1c1d3'
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
