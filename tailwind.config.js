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
  safelist: [
    // Safelist dynamic priority classes to prevent purging
    'border-red-500',
    'border-yellow-500', 
    'border-green-500',
    'bg-red-500',
    'bg-yellow-500',
    'bg-green-500',
    'bg-opacity-10',
    'hover:border-red-600',
    'hover:border-yellow-600',
    'hover:border-green-600',
    // Priority background classes
    'bg-priority-critical',
    'bg-priority-moderate', 
    'bg-priority-optional',
    // Additional border variants
    'border-priority-critical',
    'border-priority-moderate',
    'border-priority-optional'
  ]
}
