import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: "#C9A84C",
          50: "#FBF7EC",
          100: "#F5ECCF",
          200: "#EADC9E",
          300: "#DFC96E",
          400: "#D4B95A",
          500: "#C9A84C",
          600: "#A88A3B",
          700: "#7F682C",
          800: "#56461D",
          900: "#2D240F",
        },
        cream: {
          DEFAULT: "#FAF8F3",
          50: "#FFFEFB",
          100: "#FAF8F3",
          200: "#F2EDE0",
          300: "#E8E0CB",
        },
        charcoal: {
          DEFAULT: "#1C1C1C",
          900: "#0F0F0F",
          800: "#1C1C1C",
          700: "#2A2A2A",
          600: "#3A3A3A",
        },
        forest: {
          DEFAULT: "#1B3A2D",
          900: "#0E2017",
          800: "#143024",
          700: "#1B3A2D",
          600: "#245443",
        },
        warmgrey: {
          DEFAULT: "#8C8C8C",
          400: "#A8A8A8",
          500: "#8C8C8C",
          600: "#6E6E6E",
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui"],
        mono: ["var(--font-dm-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        "display-xl": ["clamp(3rem, 7vw, 6rem)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "display-lg": ["clamp(2.5rem, 5vw, 4.5rem)", { lineHeight: "1.08", letterSpacing: "-0.02em" }],
        "display-md": ["clamp(2rem, 4vw, 3rem)", { lineHeight: "1.15", letterSpacing: "-0.015em" }],
      },
      letterSpacing: {
        "widest-xl": "0.22em",
      },
      maxWidth: {
        "8xl": "88rem",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(28,28,28,0.04), 0 8px 24px rgba(28,28,28,0.06)",
        lift: "0 12px 40px rgba(28,28,28,0.08)",
      },
      transitionTimingFunction: {
        premium: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
