/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      sans: ["Lato", "sans-serif"],
    },
    colors: {
      bg: "#bcbcbc",
      purple1: "#9F7FFF",
      purple2: "#8055FE",
      orange1: "#EA8247",
      white: "#FFF",
      black: "#000",
      red: "#A00",
      blue1: "#10CCCC",
    },
  },
  plugins: [],
};
