/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        relay: {
          abyss: "#010204",
          mist: "#f7f5ef",
          lime: "#dfff96",
          gold: "#ffc86b",
          emerald: "#78f7bf",
        },
      },
      fontFamily: {
        display: ["var(--font-display)"],
        sans: ["var(--font-body)"],
      },
      boxShadow: {
        "relay-glow": "0 18px 48px rgba(210, 247, 122, 0.2)",
      },
    },
  },
  plugins: [],
};
