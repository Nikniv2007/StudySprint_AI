import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: { "2xl": "1280px" },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Brand palette
        navy: {
          DEFAULT: "#0f172a",
          800: "#1e1b4b",
          900: "#0f172a",
        },
        brand: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
        },
        electric: {
          400: "#c084fc",
          500: "#a855f7",
          600: "#9333ea",
        },
        sky: {
          400: "#38bdf8",
          500: "#0ea5e9",
        },
        success: "#22c55e",
        warning: "#f59e0b",
        danger: "#ef4444",
        ai: "#8b5cf6",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "0.9rem",
        "2xl": "1.25rem",
      },
      boxShadow: {
        soft: "0 1px 2px 0 rgb(15 23 42 / 0.04), 0 8px 24px -12px rgb(15 23 42 / 0.12)",
        glow: "0 0 0 1px rgb(99 102 241 / 0.12), 0 20px 48px -20px rgb(99 102 241 / 0.45)",
      },
      backgroundImage: {
        "brand-gradient":
          "linear-gradient(135deg, #4f46e5 0%, #7c3aed 45%, #0ea5e9 100%)",
        "hero-gradient":
          "radial-gradient(1200px 600px at 15% -10%, rgba(124,58,237,0.28), transparent 55%), radial-gradient(1000px 600px at 100% 0%, rgba(14,165,233,0.22), transparent 50%), linear-gradient(180deg, #0b1020 0%, #0f172a 100%)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in": {
          from: { opacity: "0", transform: "translateX(16px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.95)", opacity: "0.7" },
          "70%": { transform: "scale(1.05)", opacity: "0" },
          "100%": { transform: "scale(1.05)", opacity: "0" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.4s ease-out both",
        "slide-in": "slide-in 0.3s ease-out both",
        "pulse-ring": "pulse-ring 2s cubic-bezier(0.4,0,0.6,1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
