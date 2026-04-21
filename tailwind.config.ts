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
        serif: ["var(--font-serif)", "ui-serif", "Georgia", "serif"],
        sans: ["var(--font-geist-sans)", "ui-sans-serif", "system-ui", "-apple-system", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      fontSize: {
        "display-xl": ["clamp(3.25rem, 7.5vw, 6.5rem)", { lineHeight: "0.98", letterSpacing: "-0.04em" }],
        "display-lg": ["clamp(2.75rem, 5.5vw, 5rem)", { lineHeight: "1.0", letterSpacing: "-0.035em" }],
        "display-md": ["clamp(2.25rem, 4.2vw, 3.25rem)", { lineHeight: "1.05", letterSpacing: "-0.03em" }],
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
