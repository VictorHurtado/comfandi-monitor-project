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
          DEFAULT: "#2f64ff",
          canvas: "#f3f7ff",
          surface: "#ffffff",
          border: "#dce8ff",
          muted: "#4f6292",
          focus: "#1f49db",
          disabled: "#93b5ff"
        },
        status: {
          success: "#059669",
          warning: "#d97706",
          danger: "#dc2626"
        }
      },
      fontFamily: {
        outfit: ["var(--font-outfit)", "sans-serif"]
      },
      fontSize: {
        h1: ["2rem", { lineHeight: "2.5rem", fontWeight: "700" }],
        h2: ["1.5rem", { lineHeight: "2rem", fontWeight: "700" }],
        h3: ["1.25rem", { lineHeight: "1.75rem", fontWeight: "600" }],
        body: ["1rem", { lineHeight: "1.5rem", fontWeight: "400" }],
        caption: ["0.75rem", { lineHeight: "1rem", fontWeight: "500" }],
        button: ["0.875rem", { lineHeight: "1.25rem", fontWeight: "600" }]
      },
      borderRadius: {
        card: "1rem",
        input: "0.75rem",
        button: "0.75rem"
      },
      boxShadow: {
        card: "0 8px 30px -12px rgba(26, 50, 136, 0.2)",
        interactive: "0 10px 24px -10px rgba(31, 73, 219, 0.35)"
      }
    }
  },
  plugins: []
};

export default config;
