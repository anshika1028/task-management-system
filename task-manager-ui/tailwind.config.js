const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");

module.exports = {
  mode: "jit",
  important: false,
  theme: {
    screens: {
      hd: "668px",
      fhd: "1024px",
      qhd: "1280px",
      qhds: "1440px",
      uhd: "2160px",
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: "var(--primary-color)",
          text: "var(--primary-text-color)",
        },
        gray: {
          DEFAULT: "#a0aec0",
          100: "#f7fafc",
          200: "#edf2f7",
          300: "#e2e8f0",
          400: "#BDCCD4",
          500: "#a0aec0",
          600: "#718096",
          700: "#4a5568",
          800: "#2d3748",
          900: "#1a202c",
        },
        shade: {
          dark: "#21262B",
          light: "#F9FBF9",
        },
        green: {
          DEFAULT: "#21C08E",
          100: "#D3F2E8",
          200: "#A6E6D2",
          300: "#7AD9BB",
          400: "#4DCDA5",
          500: "#21C08E",
          600: "#1A9A72",
          700: "#147355",
          800: "#0D4D39",
          900: "#07261C",
        },
        blue: {
          DEFAULT: "#0273CA",
          50: "#E1F2FF",
          100: "#CCE3F4",
          200: "#86CAFE",
          300: "#49AFFD",
          400: "#0D94FD",
          500: "#0273CA",
          600: "#02599D",
          700: "#013F6F",
          800: "#082740",
          900: "#011422",
        },
        red: {
          DEFAULT: "#DB2E20",
          100: "#EFD5DA",
          200: "#E0ACB5",
          300: "#D08291",
          400: "#C1596C",
          500: "#B12F47",
          600: "#8E2639",
          700: "#6A1C2B",
          800: "#47131C",
          900: "#23090E",
        },
      },
      boxShadow: {
        outline: "0 0 0 3px rgb(33,192,142, 0.5)",
      },
      opacity: {
        5: "0.05",
        10: "0.1",
        12: "0.12",
        15: "0.15",
        90: "0.90",
        95: "0.95",
      },
      borderWidth: {
        1: "1px",
      },
    },
  },

  content: ["./index.html", "./src/**/*.{css,scss,html,ts}"],
};
