/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",     // okay if you don't have /app, harmless to include
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
