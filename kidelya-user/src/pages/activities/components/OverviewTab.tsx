import { LockBanner } from "./LockBanner"
import type { Activity } from "./types"
import { DIFF_COLOR } from "./types"

interface Props {
  activity: Activity
  canAccess: boolean
  materials: string[]
  onBuyPack: () => void
  buying: boolean
}

export function OverviewTab({ activity, canAccess, materials, onBuyPack, buying }: Props) {
  const comps  = activity.competences ?? []
  const themes = activity.themes ?? []

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <div className="flex-1 space-y-6">
        {activity.description && (
          <div className="rounded-2xl bg-[#FFFEFA] p-5 shadow-sm">
            <h2 className="mb-3 font-black text-[#7C67B2]">Description</h2>
            <p className="text-sm leading-7 text-[#273068]">{activity.description}</p>
          </div>
        )}

        <div className="rounded-2xl bg-[#FFFEFA] p-5 shadow-sm">
          <h2 className="mb-4 font-black text-[#7C67B2]">Étapes de l'activité</h2>
          {canAccess ? (() => {
            const steps = (Array.isArray(activity.steps) ? activity.steps : []).map((s) =>
              typeof s === "string" ? { text: s, image: null } : s
            )
            return steps.length === 0 ? (
              <p className="text-sm text-[#273068]">Aucune étape renseignée.</p>
            ) : (
              <ol className="space-y-3">
                {steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#7C67B2] text-xs font-black text-white">
                      {i + 1}
                    </span>
                    <div className="flex-1">
                      <p className="pt-0.5 text-sm leading-6 text-[#273068]">{step.text}</p>
                      {step.image && (
                        <img src={step.image} alt="" className="mt-2 rounded-lg max-h-40 w-auto object-cover" />
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            )
          })() : (
            <LockBanner onBuyPack={onBuyPack} buying={buying} />
          )}
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-full shrink-0 space-y-4 lg:w-[260px]">
        <div className="rounded-2xl bg-[#FFFEFA] p-5 shadow-sm">
          <h3 className="mb-4 font-black text-[#7C67B2]">Informations</h3>
          <ul className="space-y-3 text-sm">
            {activity.agemin != null && activity.agemax != null && (
              <li className="flex justify-between">
                <span className="text-[#273068]">Âge</span>
                <span className="rounded-full bg-[#F1B9C3] px-2.5 py-0.5 text-[10px] font-bold text-[#E94E6F]">{activity.agemin} - {activity.agemax} ans</span>
              </li>
            )}
            {activity.duration && (
              <li className="flex justify-between">
                <span className="text-[#273068]">Durée</span>
                <span className="rounded-full bg-[#D8EAF2] px-2.5 py-0.5 text-[10px] font-bold text-[#7BA7C0]">{activity.duration} min</span>
              </li>
            )}
            {activity.category && (
              <li className="flex justify-between">
                <span className="text-[#273068]">Catégorie</span>
                <span className="rounded-full bg-[#CDC1DC] px-2.5 py-0.5 text-[10px] font-bold text-[#273068]">{activity.category}</span>
              </li>
            )}
            {activity.difficulty && (
              <li className="flex items-center justify-between">
                <span className="text-[#273068]">Difficulté</span>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold capitalize ${DIFF_COLOR[activity.difficulty] ?? "bg-[#D5CDE2] text-[#273068]"}`}>
                  {activity.difficulty}
                </span>
              </li>
            )}
            {activity.season && (
              <li className="flex justify-between">
                <span className="text-[#273068]">Saison</span>
                <span className="font-semibold text-[#273068]">{activity.season}</span>
              </li>
            )}
            {activity.credit_price && (
              <li className="flex justify-between">
                <span className="text-[#273068]">Prix</span>
                <span className="font-bold text-[#E94E6F]">{activity.credit_price} €</span>
              </li>
            )}
          </ul>
        </div>

        <div className="rounded-2xl bg-[#FFFEFA] p-5 shadow-sm">
          <h3 className="mb-3 font-black text-[#7C67B2]">Matériel nécessaire</h3>
          {canAccess ? (
            materials.length === 0 ? (
              <p className="text-xs text-[#273068]">Aucun matériel renseigné.</p>
            ) : (
              <ul className="space-y-2">
                {materials.map((m, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs text-[#273068]">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#E94E6F]" />
                    {m}
                  </li>
                ))}
              </ul>
            )
          ) : (
            <p className="flex items-center gap-1.5 text-xs text-[#273068]">
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              Disponible après achat
            </p>
          )}
        </div>

        {(comps.length > 0 || themes.length > 0) && (
          <div className="rounded-2xl bg-[#FFFEFA] p-5 shadow-sm">
            {comps.length > 0 && (
              <>
                <h3 className="mb-3 font-black text-[#7C67B2]">Compétences</h3>
                <div className="mb-4 flex flex-wrap gap-2">
                  {comps.map((c) => (
                    <span key={c.idcompetence} className="rounded-full bg-[#D5CDE2] px-3 py-1 text-xs font-semibold text-[#273068]">
                      {c.name}
                    </span>
                  ))}
                </div>
              </>
            )}
            {themes.length > 0 && (
              <>
                <h3 className="mb-3 font-black text-[#7C67B2]">Thèmes</h3>
                <div className="flex flex-wrap gap-2">
                  {themes.map((t) => (
                    <span key={t.idtheme} className="rounded-full bg-[#F4BB48]/30 px-3 py-1 text-xs font-semibold text-[#273068]">
                      {t.name}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
