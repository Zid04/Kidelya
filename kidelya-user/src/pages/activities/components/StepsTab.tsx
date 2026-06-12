import { LockBanner } from "./LockBanner"

interface Step {
  text: string
  image: string | null
}

interface Props {
  steps?: Array<Step | string> | null
  canAccess: boolean
  onBuyPack: () => void
  buying: boolean
}

export function StepsTab({ steps, canAccess, onBuyPack, buying }: Props) {
  if (!canAccess) return <LockBanner onBuyPack={onBuyPack} buying={buying} />

  const normalized = (steps ?? []).map((s) =>
    typeof s === "string" ? { text: s, image: null } : s
  )

  return (
    <div className="space-y-4">
      <h2 className="font-black text-[#21164F]">Étapes de l'activité</h2>
      {normalized.length === 0 ? (
        <p className="text-gray-400">Aucune étape renseignée.</p>
      ) : (
        normalized.map((step, i) => (
          <div key={i} className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#21164F] text-sm font-black text-white">
              {i + 1}
            </span>
            <div className="flex-1">
              <p className="text-sm leading-6 text-gray-600">{step.text}</p>
              {step.image && (
                <img src={step.image} alt="" className="mt-3 rounded-xl max-h-52 w-auto object-cover" />
              )}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
