
const { themeVariants, prefersLight, prefersDark } = require("tailwindcss-theme-variants");
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['selector'],
    content: ["./index.html", "./src/**/*.{html,js,jsx,css}","./node_modules/react-tailwindcss-datepicker/dist/index.esm.{js,ts}"],
    // corePlugins: {
    //   preflight: true, // keep or remove if you want browser resets
    // },
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
          }
        }
      }
      ,
      plugins: [
        themeVariants({
          themes: {
            light: {
              selector: ".light-theme",
            },
            dark: {
              selector: ".dark-theme",
            },
          },
        }),
      ],
  }