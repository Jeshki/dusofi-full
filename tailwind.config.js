/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // or 'media' based on your preference
  theme: {
    extend: {
      colors: {
        'very-dark-gray': '#1a1a1a', // Custom very dark gray
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['"Cinzel"', 'sans-serif'], // You might want to set Cinzel as default sans if used widely
      },
    },
  },
  plugins: [],
}