/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        content: "0 0px 10vw 0px rgba(0, 0, 0,  0.55)",
        question: "0 0px 1vw 0px rgba(0, 0, 0,  0.3)",
      },
    },
    fontFamily: {
      sans: ["Lato", "sans-serif"],
    },
    colors: {
      bg: "#bcbcbc",
      white: "#FFF",
      black: "#000",
      dark: "#313233",
      mauve: "#B99095",
      salmon: "#FCB5AC",
      mint: "#B5E5CF",
      tealGreen: "#3D5B59",
    },
  },
  plugins: [],
};
