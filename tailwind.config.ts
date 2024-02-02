import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
    colors: {
      ...colors,
      primary: {
        100: "#d6d3da",
        200: "#adaab0",
        300: "#858389",
        400: "#605e63",
        500: "#3D3B40",
        800: "#222222",
      },
      secondary: {
        500: "#00c9a4",
        600: "#00a17e",
        700: "#007a5a",
        800: "#005539",
        900: "#00321a",
      },
      light: {
        100: "#ffffff",
        200: "#f2f2f2",
        300: "#e6e6e6",
        400: "#d9d9d9",
        500: "#cccccc",
        600: "#bfbfbf",
        700: "#b3b3b3",
        800: "#a6a6a6",
        900: "#999999",
      },
      danger: {
        100: "#ffe6e6",
        200: "#ffcccc",
        300: "#ffb3b3",
        400: "#ff9999",
        500: "#ff0505",
        600: "#ff6666",
        700: "#ff4d4d",
        800: "#ff3333",
        900: "#ff1a1a",
      },
    },
  },
  plugins: [],
};
export default config;
