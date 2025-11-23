/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#F59E0B',      // Oro vibrante (CTA, accenti)
        secondary: '#78350F',    // Terra profondo (testi, titoli)
        background: '#FEF3C7',   // Ambra chiaro (sfondo L1)
        white: '#FFFFFF',        // Sfondo L2
        red: '#DC2626',          // Emergenze
        green: '#10B981',        // Successi
        teal: '#14B8A6',         // Viralità
      },
    },
  },
  plugins: [],
}
