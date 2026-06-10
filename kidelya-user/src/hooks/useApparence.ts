import { useSyncExternalStore } from "react"

export type ResolvedAppearance = "light" | "dark"
export type Appearance = ResolvedAppearance | "system"

export type UseAppearanceReturn = {
  readonly appearance: Appearance
  readonly resolvedAppearance: ResolvedAppearance
  readonly updateAppearance: (mode: Appearance) => void
}

const listeners = new Set<() => void>()
let currentAppearance: Appearance = "system"

const prefersDark = (): boolean => {
  if (typeof window === "undefined") return false
  return window.matchMedia("(prefers-color-scheme: dark)").matches
}

const setCookie = (name: string, value: string, days = 365): void => {
  if (typeof document === "undefined") return
  const maxAge = days * 24 * 60 * 60
  document.cookie = `${name}=${value};path=/;max-age=${maxAge};SameSite=Lax`
}

const getStoredAppearance = (): Appearance => {
  if (typeof window === "undefined") return "system"
  return (localStorage.getItem("appearance") as Appearance) || "system"
}

export const isDarkMode = (appearance: Appearance): boolean =>
  appearance === "dark" || (appearance === "system" && prefersDark())

// ── Variables CSS pour chaque mode ──────────────────────────────
const DARK_VARS: Record<string, string> = {
  "--app-bg":          "#0f0f1a",
  "--app-card":        "#1a1a2e",
  "--app-subtle":      "#1e2a45",
  "--app-text":        "#e2e8f0",
  "--app-muted":       "#94a3b8",
  "--app-border":      "#2d3748",
  "--app-input-bg":    "#1e2a45",
  "--app-warm-bg":     "rgba(30, 42, 69, 0.85)",
  "--app-muted-bg":    "rgba(30, 42, 69, 0.65)",
  "--app-img-filter":    "brightness(0.3) saturate(0.7)",
  "--app-img-opacity":   "0.3",
  "--app-dark-overlay":  "0.65",
}

const LIGHT_VARS: Record<string, string> = {
  "--app-bg":          "#ffffff",
  "--app-card":        "#ffffff",
  "--app-subtle":      "#f9fafb",
  "--app-text":        "#21164F",
  "--app-muted":       "#6b7280",
  "--app-border":      "#f3f4f6",
  "--app-input-bg":    "#ffffff",
  "--app-warm-bg":     "rgba(255, 243, 224, 0.55)",
  "--app-muted-bg":    "rgba(39, 48, 104, 0.08)",
  "--app-img-filter":    "brightness(1) saturate(1)",
  "--app-img-opacity":   "1",
  "--app-dark-overlay":  "0",
}

const applyTheme = (appearance: Appearance): void => {
  if (typeof document === "undefined") return
  const isDark = isDarkMode(appearance)

  document.documentElement.classList.toggle("dark", isDark)
  document.documentElement.style.colorScheme = isDark ? "dark" : "light"

  const vars = isDark ? DARK_VARS : LIGHT_VARS
  Object.entries(vars).forEach(([key, val]) => {
    document.documentElement.style.setProperty(key, val)
  })
}

const subscribe = (callback: () => void) => {
  listeners.add(callback)
  return () => listeners.delete(callback)
}

const notify = (): void => listeners.forEach((listener) => listener())

const mediaQuery = (): MediaQueryList | null => {
  if (typeof window === "undefined") return null
  return window.matchMedia("(prefers-color-scheme: dark)")
}

const handleSystemThemeChange = (): void => applyTheme(currentAppearance)

export function initializeTheme(): void {
  if (typeof window === "undefined") return
  if (!localStorage.getItem("appearance")) {
    localStorage.setItem("appearance", "system")
    setCookie("appearance", "system")
  }
  currentAppearance = getStoredAppearance()
  applyTheme(currentAppearance)
  mediaQuery()?.addEventListener("change", handleSystemThemeChange)
}

export function useAppearance(): UseAppearanceReturn {
  const appearance: Appearance = useSyncExternalStore(
    subscribe,
    () => currentAppearance,
    () => "system"
  )

  const resolvedAppearance: ResolvedAppearance = isDarkMode(appearance) ? "dark" : "light"

  const updateAppearance = (mode: Appearance): void => {
    currentAppearance = mode
    localStorage.setItem("appearance", mode)
    setCookie("appearance", mode)
    applyTheme(mode)
    notify()
  }

  return { appearance, resolvedAppearance, updateAppearance } as const
}
