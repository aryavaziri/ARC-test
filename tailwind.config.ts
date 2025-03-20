const defaultTheme = require("tailwindcss/defaultTheme");
import type { Config } from "tailwindcss";
// import { PluginAPI } from "tailwindcss/types";

const config: Config = {
  // mode: "jit",
  // safelist: [
  //   "text-light",
  //   "text-dark",
  //   "text-arya1", // Add any classes that are conditionally applied
  // ],

  content: ["./src/pages/**/*.{js,ts,jsx,tsx,mdx}", "./src/components/**/*.{js,ts,jsx,tsx,mdx}", "./src/frontendComponents/**/*.{js,ts,jsx,tsx,mdx}", "./src/app/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      boxShadow: {
        center: "0 0px 0px -5px rgba(250, 250, 250, 0.3)",
        md: "0 0px 6px -1px",
        xl: "0 0px 20px 0",
        arya: "0 0 40px -4px",
        arya2: "0 0 20px -4px",
      },
      colors: {
        arya1: "#FCD618",
        arya2: "#142EAE",
        success: "#28a745",
        dark: "#171717",
        dark2: "#262626",
        light: "#EEEEEE",
        textlight: "#737373",
        light2: "#ADD8E6",
        transparentWhite: "#FFFFFF1A",
      },
      transitionDelay: {
        400: "400ms",
        600: "600ms",
        800: "800ms",
      },
      scrollbarWidth: {
        thin: "thin",
        none: "none",
      },
    },
  },
  // variants: {
  //   scrollbar: ["rounded"], // Enable variants for scrollbar if needed
  // },
  // plugins: [
  //   function ({ addUtilities }: PluginAPI) {
  //     const newUtilities = {
  //       ".scrollbar-thin": {
  //         "scrollbar-width": "thin",
  //       },
  //       ".scrollbar-none": {
  //         "scrollbar-width": "none",
  //       },
  //     };

  //     addUtilities(newUtilities);
  //   },
  // ],
};
export default config;
