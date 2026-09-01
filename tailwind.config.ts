import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "var(--color-paper)",
        ink: "var(--color-ink)",
        accent: "var(--color-accent)",
        stamp: "var(--color-stamp)",
        muted: "var(--color-muted)",
      },
      fontFamily: {
        sans: ["var(--font-inter)"],
        serif: ["var(--font-fraunces)"],
      },
    },
  },
  plugins: [],
};
export default config;
