/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        cream: "#F7F3ED",
        paper: "#FDFBF7",
        espresso: "#2B2118",
        cocoa: "#5C4A3A",
        clay: "#B85C38",
        sage: "#6B7F5C",
        amber: "#D4A24C",
        line: "#E8E0D5",
        muted: "#9C8E80",
      },
      fontFamily: {
        display: ['Fraunces', 'Noto Serif SC', 'Georgia', 'serif'],
        body: ['DM Sans', 'Noto Sans SC', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        xl: "14px",
      },
      boxShadow: {
        soft: "0 4px 16px rgba(43,33,24,0.05)",
        lift: "0 12px 32px rgba(43,33,24,0.08)",
      },
    },
  },
  plugins: [],
};
