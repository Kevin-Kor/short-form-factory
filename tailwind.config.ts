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
        // Apple/Toss Style Palette
        background: "#F2F4F6", // Light gray background (Toss style)
        surface: "#FFFFFF",    // Pure white surface
        primary: "#3182F6",    // Toss Blue
        secondary: "#B1C5D8",  // Soft Blue Gray
        accent: "#333D4B",     // Dark Text (Almost Black)
        muted: "#8B95A1",      // Muted Text (Gray)
        border: "#E5E8EB",     // Light Border
      },
    },
  },
  plugins: [],
};
export default config;
