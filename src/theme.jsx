import { createContext, useContext, useEffect, useState } from "react";

// Theme provider — persists to localStorage, defaults to the OS setting on
// first visit, and reflects the choice via data-theme on <html>.
const ThemeCtx = createContext({ theme: "light", toggle: () => {}, setTheme: () => {} });

function initialTheme() {
  try {
    const stored = localStorage.getItem("pk-theme");
    if (stored === "light" || stored === "dark") return stored;
  } catch (e) {
    /* localStorage unavailable */
  }
  if (typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }
  return "light";
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(initialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("pk-theme", theme);
    } catch (e) {
      /* ignore */
    }
  }, [theme]);

  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return <ThemeCtx.Provider value={{ theme, toggle, setTheme }}>{children}</ThemeCtx.Provider>;
}

export function useTheme() {
  return useContext(ThemeCtx);
}
