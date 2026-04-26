import { createContext, useContext, useMemo, useState, useEffect } from "react";

const Ctx = createContext(null);
export const useTheme = () => useContext(Ctx);

const THEMES = [
  {
    name: "Neon Midnight",
    bg: "4 8 20",
    surface: "12 18 34",
    primary: "78 92 255",
    accent: "173 78 255",
    text: "240 244 255",
    muted: "146 156 181"
  },
  {
    name: "Cyber Punk",
    bg: "0 0 0",
    surface: "20 20 40",
    primary: "255 0 128",
    accent: "0 255 255",
    text: "255 255 255",
    muted: "128 128 128"
  },
  {
    name: "Forest Glow",
    bg: "10 20 10",
    surface: "20 40 20",
    primary: "0 255 128",
    accent: "255 128 0",
    text: "240 255 240",
    muted: "128 160 128"
  }
];

export function ThemeProvider({ children }) {
  const [index, setIndex] = useState(0);
  const current = THEMES[index];
  const cycle = () => setIndex((index + 1) % THEMES.length);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--bg', current.bg);
    root.style.setProperty('--surface', current.surface);
    root.style.setProperty('--primary', current.primary);
    root.style.setProperty('--accent', current.accent);
    root.style.setProperty('--text', current.text);
    root.style.setProperty('--muted', current.muted);
  }, [current]);

  const value = useMemo(() => ({ themes: THEMES, current, index, cycle }), [index]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
