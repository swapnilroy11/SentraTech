/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'st-surface': 'var(--st-surface)',
        'st-primary': 'var(--st-primary)',
      }
    },
  },
  plugins: [
    require('tailwindcss-animate'),
  ],
}