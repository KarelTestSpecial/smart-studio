/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./{src,components}/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: '#0f172a',
          slate: '#1e293b',
          blue: '#06b6d4',
          orange: '#f97316',
          green: '#10b981',
          purple: '#8b5cf6',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}