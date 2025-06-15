/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        priority: {
          critical: '#ef4444',
          moderate: '#f59e0b',
          optional: '#10b981'
        }
      }
    },
  },
  plugins: [],
}
