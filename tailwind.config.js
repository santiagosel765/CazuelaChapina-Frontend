/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        'chapina-red': '#d7261e',
        'chapina-blue': '#0037a8',
        'chapina-yellow': '#ffc20f'
      }
    },
  },
  plugins: [],
}
