import { mtConfig } from "@material-tailwind/react";
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@material-tailwind/react/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        "dark-primary": "#101011",
        "dark-second": "#1B1B1B",
        "gray-line": "#2A2A2C",
        "textG": "#9A9AA0",
        "gray-input": "#2D2D2D",
      }
    },
  },
  plugins: [require("tailwind-scrollbar"),mtConfig],
}

