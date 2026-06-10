import { Sun, Moon, Monitor } from "lucide-react"
import { useAppearance } from "@/hooks/useApparence"
import { useTheme, THEMES } from "@/context/ThemeProvider"
import type { ThemeId } from "@/context/ThemeProvider"
import Heading from "@/components/Heading"

export default function AppearanceSettingsPage() {
  const { appearance, updateAppearance } = useAppearance()
  const { theme, setTheme } = useTheme()

  const modes = [
    { value: "light" as const,  icon: Sun,     label: "Clair" },
    { value: "dark"  as const,  icon: Moon,    label: "Sombre" },
    { value: "system" as const, icon: Monitor, label: "Système" },
  ]

  return (
    <div className="space-y-10 max-w-2xl">
      <Heading
        variant="small"
        title="Apparence"
        description="Personnalisez l'affichage de votre espace Kidelya"
      />

      {/* ── Mode clair / sombre ── */}
      <section>
        <h2 className="mb-1 text-sm font-bold text-[#2F236D]">Mode d'affichage</h2>
        <p className="mb-4 text-xs text-gray-400">Choisissez entre le mode clair, sombre ou selon votre système.</p>
        <div className="inline-flex gap-1 rounded-xl border border-gray-200 bg-gray-50 p-1">
          {modes.map(({ value, icon: Icon, label }) => (
            <button
              key={value}
              onClick={() => updateAppearance(value)}
              className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                appearance === value
                  ? "bg-white text-[var(--color-accent)] shadow-sm"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>
      </section>

      {/* ── Thème de couleurs ── */}
      <section>
        <h2 className="mb-1 text-sm font-bold text-[#2F236D]">Thème de couleurs</h2>
        <p className="mb-4 text-xs text-gray-400">Choisissez la palette qui vous ressemble. S'applique à la navigation et aux éléments principaux.</p>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {THEMES.map((t) => {
            const isActive = theme === t.id
            return (
              <button
                key={t.id}
                onClick={() => setTheme(t.id as ThemeId)}
                className={`group relative flex flex-col overflow-hidden rounded-2xl border-2 transition-all ${
                  isActive
                    ? "border-[var(--color-accent)] shadow-md"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {/* Preview */}
                <div
                  className="h-14 w-full"
                  style={{ backgroundColor: t.preview.sidebar }}
                >
                  <div className="flex h-full flex-col justify-end p-2 gap-1">
                    <div className="h-1.5 w-10 rounded-full opacity-40" style={{ backgroundColor: t.preview.dot }} />
                    <div className="h-1.5 w-7 rounded-full opacity-40" style={{ backgroundColor: t.preview.dot }} />
                    <div className="h-1.5 w-8 rounded-full opacity-40" style={{ backgroundColor: t.preview.dot }} />
                  </div>
                </div>
                <div
                  className="h-2 w-full"
                  style={{ backgroundColor: t.preview.accent }}
                />
                <div className="flex items-center justify-between bg-white px-3 py-2">
                  <div>
                    <p className="text-left text-xs font-black text-[#21164F]">{t.name}</p>
                    <p className="text-left text-[10px] leading-3 text-gray-400">{t.description}</p>
                  </div>
                  {isActive && (
                    <div
                      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                      style={{ backgroundColor: t.preview.accent }}
                    >
                      <svg viewBox="0 0 24 24" className="h-3 w-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </section>
    </div>
  )
}
