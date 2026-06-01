/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class', // or 'media' based on your preference
  theme: {
    extend: {
      colors: {
        'very-dark-gray': '#1a1a1a', // Custom very dark gray
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "serif"],
        sans: ["var(--font-cinzel)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;