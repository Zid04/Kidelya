import type { PackFilterOptions } from "@/types/Pack"

interface Props {
  filterOptions: PackFilterOptions
  selectedAge: string
  selectedTheme: string
  selectedSeason: string
  selectedType: string
  onChange: (field: "age" | "theme" | "season" | "type", value: string) => void
  onReset: () => void
}

export default function PackFilters({
  filterOptions,
  selectedAge,
  selectedTheme,
  selectedSeason,
  selectedType,
  onChange,
  onReset,
}: Props) {
  return (
    <div className="mx-auto my-5 flex w-full max-w-4xl flex-col items-center">
      <div className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[#E8DDD0] bg-white px-16 py-5 shadow-md">
        <div className="rounded-xl border border-[#E8DDD0]">
          <select
            value={selectedAge}
            onChange={(e) => onChange("age", e.target.value)}
            className="h-9 min-w-[90px] bg-transparent px-3 text-sm text-[#4F5F45] outline-none"
          >
            <option value="">Âge</option>
            {filterOptions.age_ranges.map((a) => (
              <option key={a} value={a}>{a.replace(/-/g, " - ")} ans</option>
            ))}
          </select>
        </div>

        <div className="rounded-xl border border-[#E8DDD0]">
          <select
            value={selectedTheme}
            onChange={(e) => onChange("theme", e.target.value)}
            className="h-9 min-w-[100px] bg-transparent px-3 text-sm text-[#4F5F45] outline-none"
          >
            <option value="">Thème</option>
            {filterOptions.themes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className="rounded-xl border border-[#E8DDD0]">
          <select
            value={selectedSeason}
            onChange={(e) => onChange("season", e.target.value)}
            className="h-9 min-w-[100px] bg-transparent px-3 text-sm text-[#4F5F45] outline-none"
          >
            <option value="">Saison</option>
            {filterOptions.seasons.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="rounded-xl border border-[#E8DDD0]">
          <select
            value={selectedType}
            onChange={(e) => onChange("type", e.target.value)}
            className="h-9 min-w-[130px] bg-transparent px-3 text-sm text-[#4F5F45] outline-none"
          >
            <option value="">Type d'activité</option>
            {filterOptions.types.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={onReset}
        className="text-xs font-semibold text-[#E94E6F] hover:underline"
      >
        Réinitialiser les filtres
      </button>
    </div>
  )
}
