/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Elimu Finder brand palette — warm, trustworthy, Kenyan
        brand: {
          50:  "#fff8ed",
          100: "#ffefd4",
          200: "#ffdba8",
          300: "#ffc071",
          400: "#ff9a38",
          500: "#ff7a10", // primary orange (energy, warmth)
          600: "#f05d06",
          700: "#c74308",
          800: "#9e360f",
          900: "#7f2e10",
        },
        earth: {
          50:  "#f6f4ef",
          100: "#e8e3d7",
          200: "#d1c9b3",
          300: "#b5a887",
          400: "#9d8f6a",
          500: "#8a7a58",
          600: "#76664a",
          700: "#60513c",
          800: "#504335",
          900: "#443a2f",
        },
        forest: {
          500: "#2d6a4f",
          600: "#1b4332",
        },
      },
      fontFamily: {
        display: ["'Plus Jakarta Sans'", "sans-serif"],
        body:    ["'DM Sans'", "sans-serif"],
        mono:    ["'JetBrains Mono'", "monospace"],
      },
      borderRadius: {
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};
