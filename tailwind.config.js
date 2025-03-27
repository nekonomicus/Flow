// flowchart-app/tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Make sure it scans your source files
  ],
  theme: {
    extend: {
      colors: {
        'outcome-fill': '#E0FFE0', // Light green for outcome nodes
        'outcome-border': '#006400', // Dark green for outcome node borders
      },
    },
  },
  plugins: [],
}
