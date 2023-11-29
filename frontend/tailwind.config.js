/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    colors: {
      "primary": "#5B12D2",
      "black": "#000000",
      "white": "#FFFFFF",
      "accent-one": "#8933BD",
      "accent-two": "#AD00FF",
      "gray": "#5C6272",
      "background-gray": "#121213",
    }
  },
  plugins: [],
}