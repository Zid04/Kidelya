import type { Activity } from "./types"

interface Props {
  activity: Activity
}

export function InformationsTab({ activity }: Props) {
  const rows = [
    { label: "Titre",      value: activity.title },
    { label: "Catégorie",  value: activity.category },
    { label: "Âge",        value: activity.agemin != null ? `${activity.agemin} - ${activity.agemax} ans` : null },
    { label: "Durée",      value: activity.duration ? `${activity.duration} min` : null },
    { label: "Difficulté", value: activity.difficulty },
    { label: "Saison",     value: activity.season },
    { label: "Lieu",       value: activity.location },
    { label: "Prix",       value: activity.credit_price ? `${activity.credit_price} €` : null },
  ].filter((r) => r.value)

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h2 className="mb-5 font-black text-[#21164F]">Informations détaillées</h2>
      <dl className="grid gap-4 sm:grid-cols-2">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
            <dt className="text-xs font-semibold text-gray-400">{r.label}</dt>
            <dd className="text-sm font-bold text-[#21164F]">{r.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
