/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0d1117',
        secondary: '#161b22',
        border: '#30363d',
        textPrimary: '#e6edf3',
        textSecondary: '#8b949e',
        accent: '#238636',
      }
    },
  },
  plugins: [],
}
