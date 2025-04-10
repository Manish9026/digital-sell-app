
/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{html,js,jsx,css}","./node_modules/react-tailwindcss-datepicker/dist/index.esm.{js,ts}"],
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
    plugins: [],
  }