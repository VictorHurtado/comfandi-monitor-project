import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f3f7ff",
          100: "#dce8ff",
          200: "#bfd4ff",
          300: "#93b5ff",
          400: "#5b89ff",
          500: "#2f64ff",
          600: "#1f49db",
          700: "#1938ad",
          800: "#1a3288",
          900: "#1b2f6f",
          DEFAULT: "#2f64ff"
        }
      },
      fontFamily: {
        outfit: ["var(--font-outfit)", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
