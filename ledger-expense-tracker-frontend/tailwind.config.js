/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        void: {
          950: "#07070d",
          900: "#0b0a14",
          800: "#12111f",
          700: "#191828",
          600: "#242238",
        },
        violet: {
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
        },
        indigo: {
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
        },
        cyan: {
          400: "#22d3ee",
          500: "#06b6d4",
        },
        income: {
          400: "#4ade80",
          500: "#22c55e",
          glow: "rgba(34,197,94,0.35)",
        },
        expense: {
          400: "#fb7185",
          500: "#f43f5e",
          glow: "rgba(244,63,94,0.35)",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      backgroundImage: {
        "aurora-1": "radial-gradient(circle at 20% 20%, rgba(139,92,246,0.35), transparent 55%)",
        "aurora-2": "radial-gradient(circle at 80% 30%, rgba(99,102,241,0.30), transparent 50%)",
        "aurora-3": "radial-gradient(circle at 50% 90%, rgba(34,211,238,0.20), transparent 55%)",
        "grain": "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E\")",
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(0,0,0,0.45)",
        "glow-violet": "0 0 40px rgba(139,92,246,0.25)",
        "glow-cyan": "0 0 40px rgba(34,211,238,0.2)",
      },
      animation: {
        "drift-slow": "drift 22s ease-in-out infinite",
        "drift-slower": "drift 30s ease-in-out infinite reverse",
        "fade-up": "fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) both",
        shimmer: "shimmer 2.2s linear infinite",
      },
      keyframes: {
        drift: {
          "0%, 100%": { transform: "translate(0,0) scale(1)" },
          "33%": { transform: "translate(3%,-4%) scale(1.05)" },
          "66%": { transform: "translate(-3%,3%) scale(0.97)" },
        },
        fadeUp: {
          from: { opacity: 0, transform: "translateY(16px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};
