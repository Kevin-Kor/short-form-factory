import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#8B5CF6", // Violet-500 (Softer Purple)
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#D946EF", // Fuchsia-500 (Vibrant Pink)
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#34D399", // Emerald-400 (Fresh Green)
          foreground: "#000000",
        },
        background: {
          DEFAULT: "#0B0F19", // Deep Dark Blue/Black
          light: "#F8FAFC",
        },
        surface: {
          DEFAULT: "#151B2B", // Slightly lighter dark
          light: "#FFFFFF",
        }
      },
    },
  },
  plugins: [],
};
export default config;
