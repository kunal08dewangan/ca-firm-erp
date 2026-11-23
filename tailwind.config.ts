import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "#E2E8F0",
        input: "#E2E8F0",
        ring: "#2563EB",
        background: "#F7F9FC",
        foreground: "#1E293B",
        primary: {
          DEFAULT: "#17365D", // Corporate Navy Blue
          foreground: "#FFFFFF",
          light: "#1F487E",
          dark: "#0F243E",
        },
        secondary: {
          DEFAULT: "#2563EB", // Royal Blue
          foreground: "#FFFFFF",
          light: "#3B82F6",
          dark: "#1D4ED8",
        },
        muted: {
          DEFAULT: "#F1F5F9",
          foreground: "#64748B",
        },
        accent: {
          DEFAULT: "#F8FAFC",
          foreground: "#0F172A",
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#1E293B",
        },
        success: {
          DEFAULT: "#16A34A",
          foreground: "#FFFFFF",
          light: "#DCFCE7",
        },
        warning: {
          DEFAULT: "#D97706",
          foreground: "#FFFFFF",
          light: "#FEF3C7",
        },
        danger: {
          DEFAULT: "#DC2626",
          foreground: "#FFFFFF",
          light: "#FEE2E2",
        },
      },
      borderRadius: {
        lg: "0.5rem",
        md: "calc(0.5rem - 2px)",
        sm: "calc(0.5rem - 4px)",
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
