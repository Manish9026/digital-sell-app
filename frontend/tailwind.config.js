const { themeVariants } = require("tailwindcss-theme-variants");

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['selector','class'], // using themeVariants, not Tailwind's native dark mode
  content: [
    "./index.html",
    "./src/**/*.{html,js,jsx,css}",
    "./node_modules/react-tailwindcss-datepicker/dist/index.esm.{js,ts}",
     "./node_modules/sonner/**/*.{js,ts,jsx,tsx,mjs}",
  ],
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'scale(0.95)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        }
      },
      dropShadow: {
        neon: [
          '0 0 10px #24ecff',
          '0 0 30px #24ecff',
          '0 0 50px #24ecff',
        ],
      },
    }
  },
  plugins: [
    themeVariants({
      themes: {
        light: { selector: '[data-theme="light"]' },
        dark: { selector: '[data-theme="dark"]' },
      },
    }),
  ],
};
