/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "rgb(var(--bg) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        primary: "rgb(var(--primary) / <alpha-value>)",
        accent: "rgb(var(--accent) / <alpha-value>)",
        text: "rgb(var(--text) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)"
      },
      fontFamily: { sans: ["-apple-system", "BlinkMacSystemFont", "SF Pro Display", "Inter", "system-ui", "sans-serif"] },
      boxShadow: { glow: "0 0 40px rgb(var(--primary) / 0.45)" },
      backdropBlur: { xs: "2px" }
    },
  },
  plugins: [
    function({ addUtilities }) {
      addUtilities({
        '.glass': {
          'backdrop-filter': 'blur(16px)',
          'background-color': 'rgba(255, 255, 255, 0.05)',
          'border': '1px solid rgba(255, 255, 255, 0.1)',
        },
        '.glass-strong': {
          'backdrop-filter': 'blur(20px)',
          'background-color': 'rgba(255, 255, 255, 0.1)',
          'border': '1px solid rgba(255, 255, 255, 0.2)',
        }
      });
    }
  ]
};
