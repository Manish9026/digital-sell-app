// ThemeToggleButton.tsx
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
const themeCollection = ["light", "dark"];
// export default function ThemeToggleButton() {
//   const [theme, setTheme] = useState("dark");

  
//   useEffect(() => {
//     const storedTheme = localStorage.getItem("theme");
//     const initialTheme= storedTheme || theme

//     if(!storedTheme) {
//         document.documentElement.classList.add(theme);
//         localStorage.setItem("theme", theme);

//     }else{
//         document.documentElement.className.replace="";
//         document.documentElement.classList.add(theme);
//     }
//     // const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

//     if (theme === "dark") {
//       document.documentElement.classList.add("dark");
//     } else {
//       document.documentElement.classList.remove("dark");
//     }
//   }, [theme]);
  
//   const toggleTheme = () => {
//     const newTheme = theme === "dark" ? "light" : "dark";
//     setTheme(newTheme);
//     localStorage.setItem("theme", newTheme);
  
//     // if (newTheme === "dark") {
//     //   document.documentElement.classList.add("dark");
//     // } else {
//     //   document.documentElement.classList.remove("dark");
//     // }
//   };
  
//   return (
//     <button
//       onClick={toggleTheme}
//       className="p-3 bg-gray-200 dark:bg-gray-800 rounded-full shadow-md transition duration-300 text-black dark:text-white"
//     >
//       <AnimatePresence mode="wait" initial={false}>
//         {theme === "dark" ? (
//           <motion.span
//             key="sun"
//             initial={{ rotate: -90, opacity: 0 }}
//             animate={{ rotate: 0, opacity: 1 }}
//             exit={{ rotate: 90, opacity: 0 }}
//             transition={{ duration: 0.3 }}
//           >
//             <Sun size={24} />
//           </motion.span>
//         ) : (
//           <motion.span
//             key="moon"
//             initial={{ rotate: 90, opacity: 0 }}
//             animate={{ rotate: 0, opacity: 1 }}
//             exit={{ rotate: -90, opacity: 0 }}
//             transition={{ duration: 0.3 }}
//           >
//             <Moon size={24} />
//           </motion.span>
//         )}
//       </AnimatePresence>
//     </button>
//   );
// }

// import { useEffect, useState } from "react";

const themes = ["light", "dark"];

export default function ThemeToggleButton() {
    const [themeIndex, setThemeIndex] = useState(0);
  
    // Load theme from localStorage or fallback to light
    useEffect(() => {
      const saved = localStorage.getItem("theme");
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  
      const initialTheme = saved || (prefersDark ? "dark" : "light");
      const index = themes.indexOf(initialTheme);
  
      setThemeIndex(index >= 0 ? index : 0);
      document.documentElement.setAttribute("data-theme", themes[index >= 0 ? index : 0]);
  
      // if using Tailwind "darkMode: 'class'"
      document.documentElement.classList.toggle("dark", initialTheme === "dark");
    }, []);
  
    const toggleTheme = () => {
      const newIndex = (themeIndex + 1) % themes.length;
      const newTheme = themes[newIndex];
  
      setThemeIndex(newIndex);
      localStorage.setItem("theme", newTheme);
      document.documentElement.setAttribute("data-theme", newTheme);
  
      // toggle Tailwind dark mode class
      document.documentElement.classList.toggle("dark", newTheme === "dark");
    };
  
    return (
      <button
        onClick={toggleTheme}
        className="p-2 rounded-full light:bg-light dark:bg-primary light:text-gray-500 dark:text-white transition"
      >
        <AnimatePresence mode="wait" initial={false}>
          {themes[themeIndex] === "dark" ? (
            <motion.span
              key="sun"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Sun size={24} />
            </motion.span>
          ) : (
            <motion.span
              key="moon"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Moon size={24} />
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    );
  }
