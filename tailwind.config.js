/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Neue Montreal"', "Inter", "Arial", "Helvetica", "sans-serif"],
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "1.5rem",
          lg: "2rem",
          xl: "2.5rem",
          "2xl": "3rem",
        },
      },
    },
  },
  // Keep existing hand-authored CSS authoritative — Tailwind utilities are
  // layered underneath so component-level rules continue to win without !important.
  corePlugins: {
    preflight: false,
  },
  plugins: [],
};
