import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        surface: "#fff8f6",
        "surface-dim": "#e9d6cf",
        "surface-container-low": "#fff1eb",
        "surface-container": "#fdeae2",
        "surface-container-high": "#f8e4dd",
        "surface-container-highest": "#f2dfd7",
        "on-surface": "#231915",
        "on-surface-variant": "#56433a",
        primary: "#994109",
        "primary-container": "#b95922",
        "on-primary": "#ffffff",
        secondary: "#85522d",
        "secondary-container": "#ffba8d",
        tertiary: "#00647f",
        "tertiary-container": "#007f9f",
        outline: "#897268",
        "outline-variant": "#dcc1b5",
        "inverse-surface": "#392e29",
        "inverse-primary": "#ffb693",
        error: "#ba1a1a",
        "error-container": "#ffdad6",
        background: "#fff8f6",
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        lg: "1rem",
        xl: "1.5rem",
        full: "9999px",
      },
      spacing: {
        xs: "4px",
        base: "8px",
        sm: "12px",
        md: "24px",
        lg: "48px",
        xl: "80px",
        gutter: "24px",
        margin: "32px",
      },
      fontFamily: {
        serif: ["Cormorant Garamond", "serif"],
        sans: ["Work Sans", "sans-serif"],
        mono: ["DM Mono", "monospace"],
        caps: ["Space Grotesk", "sans-serif"],
      },
      maxWidth: {
        content: "1280px",
      },
    },
  },
};

export default config;
