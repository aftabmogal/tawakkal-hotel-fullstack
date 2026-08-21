/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0E211D',
        inkSoft: '#173731',
        ivory: '#F8F4EC',
        ivorySoft: '#EFE8D8',
        brass: '#B8934A',
        brassSoft: '#D9BC84',
        wine: '#5B2333',
        sage: '#7C8F7A',
        stone: '#DDD6C4',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        body: ['"Manrope"', 'sans-serif'],
      },
      borderRadius: {
        arch: '999px 999px 0 0',
      },
      boxShadow: {
        soft: '0 20px 60px -20px rgba(14, 33, 29, 0.35)',
      },
    },
  },
  plugins: [],
}
