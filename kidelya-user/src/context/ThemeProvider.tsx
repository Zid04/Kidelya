import { createContext, useContext, useEffect, useState } from "react"

export type ThemeId = "kidelya" | "nature" | "ocean" | "sunset"

export type ThemeConfig = {
  id: ThemeId
  name: string
  description: string
  preview: { sidebar: string; accent: string; dot: string }
}

export const THEMES: ThemeConfig[] = [
  {
    id: "kidelya",
    name: "Kidelya",
    description: "Le thème original violet & rose",
    preview: { sidebar: "#2F236D", accent: "#E94E6F", dot: "#FAF9F6" },
  },
  {
    id: "nature",
    name: "Nature",
    description: "Des tons verts apaisants",
    preview: { sidebar: "#1E4A2D", accent: "#6F8D4C", dot: "#F6FAF2" },
  },
  {
    id: "ocean",
    name: "Océan",
    description: "Bleu marine & turquoise",
    preview: { sidebar: "#0D3B6E", accent: "#0094A8", dot: "#F2F8FA" },
  },
  {
    id: "sunset",
    name: "Soleil",
    description: "Violet chaud & orange doré",
    preview: { sidebar: "#7B2D8B", accent: "#E98B2A", dot: "#FDF8F0" },
  },
]

const THEME_VARS: Record<ThemeId, Record<string, string>> = {
  kidelya: {
    "--color-primary":      "#2F236D",
    "--color-primary-2":    "#273068",
    "--color-accent":       "#E94E6F",
    "--color-accent-hover": "#d63f5f",
    "--color-sidebar-bg":   "#FAF9F6",
    "--color-sidebar-text": "#93197D",
    "--color-sidebar-link": "#6F8D4C",
    "--color-sidebar-active-bg": "#f3f4f6",
    "--color-plan-link":    "#0094A8",
  },
  nature: {
    "--color-primary":      "#1E4A2D",
    "--color-primary-2":    "#1E4A2D",
    "--color-accent":       "#6F8D4C",
    "--color-accent-hover": "#5a7a3a",
    "--color-sidebar-bg":   "#F6FAF2",
    "--color-sidebar-text": "#1E4A2D",
    "--color-sidebar-link": "#2D6A4F",
    "--color-sidebar-active-bg": "#e8f5e0",
    "--color-plan-link":    "#2D6A4F",
  },
  ocean: {
    "--color-primary":      "#0D3B6E",
    "--color-primary-2":    "#0D3B6E",
    "--color-accent":       "#0094A8",
    "--color-accent-hover": "#007a8c",
    "--color-sidebar-bg":   "#F2F8FA",
    "--color-sidebar-text": "#0D3B6E",
    "--color-sidebar-link": "#0094A8",
    "--color-sidebar-active-bg": "#daeef2",
    "--color-plan-link":    "#0094A8",
  },
  sunset: {
    "--color-primary":      "#7B2D8B",
    "--color-primary-2":    "#7B2D8B",
    "--color-accent":       "#E98B2A",
    "--color-accent-hover": "#c9751f",
    "--color-sidebar-bg":   "#FDF8F0",
    "--color-sidebar-text": "#7B2D8B",
    "--color-sidebar-link": "#E98B2A",
    "--color-sidebar-active-bg": "#fdecd5",
    "--color-plan-link":    "#E98B2A",
  },
}

function applyTheme(id: ThemeId) {
  const vars = THEME_VARS[id]
  Object.entries(vars).forEach(([key, val]) => {
    document.documentElement.style.setProperty(key, val)
  })
}

type ThemeCtx = {
  theme: ThemeId
  setTheme: (id: ThemeId) => void
}

const ThemeContext = createContext<ThemeCtx>({ theme: "kidelya", setTheme: () => {} })

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>(
    () => (localStorage.getItem("kidelya-theme") as ThemeId) || "kidelya"
  )

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  function setTheme(id: ThemeId) {
    localStorage.setItem("kidelya-theme", id)
    setThemeState(id)
    applyTheme(id)
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
