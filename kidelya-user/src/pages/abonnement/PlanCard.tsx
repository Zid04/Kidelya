import type { SubscriptionPlan } from "@/types/Subscription"
import { formatPrice } from "@/utils/media"

// Labels affichés pour chaque formule
const PLAN_LABELS: Record<SubscriptionPlan["name"], string> = {
  Free: "Gratuit",
  Monthly: "Abonnement mensuel",
  Annual: "Abonnement annuel",
}

// Fonctionnalités incluses par formule (texte statique)
const PLAN_FEATURES: Record<SubscriptionPlan["name"], string[]> = {
  Free: [
    "Accès limité à une sélection d'activités",
    "2 enfants",
    "Fonctionnalités de base",
  ],
  Monthly: [
    "Accès illimité à tous les packs",
    "Jusqu'à 5 enfants",
    "Planification avec calendrier",
    "Enregistrements favoris",
    "Mises à jour régulières",
  ],
  Annual: [
    "Tout ce qui est inclus en mensuel",
    "Jusqu'à 5 enfants",
    "Planification avec calendrier",
    "Enregistrements favoris",
    "Mises à jour régulières",
    "2 mois offerts",
  ],
}

function CheckIcon({ active }: { active: boolean }) {
  return (
    <span
      className="mt-[2px] inline-flex h-[14px] w-[14px] items-center justify-center rounded-full"
      style={{ backgroundColor: active ? "#E94E6F" : "#273068" }}
    >
      <svg viewBox="0 0 16 16" className="h-[10px] w-[10px]" fill="none">
        <path d="M3.5 8.5L6.5 11.5L12.5 5.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  )
}

interface Props {
  plan: SubscriptionPlan
  isLoading: boolean
  onSelect: (plan: SubscriptionPlan) => void
}

export default function PlanCard({ plan, isLoading, onSelect }: Props) {
  const isFree = Number(plan.price) === 0
  const isPopular = plan.name === "Monthly"

  return (
    <article
      className={`flex w-full max-w-[250px] flex-col overflow-hidden rounded-2xl sm:w-[250px] ${
        isPopular ? "shadow-xl md:-translate-y-5 backdrop-blur-sm" : "shadow-md backdrop-blur-sm"
      }`}
    >
      {isPopular && (
        <div className="bg-[#E94E6F] py-1.5 text-center text-xs font-bold text-white">
          Populaire
        </div>
      )}

      <div className="flex min-h-[430px] flex-1 flex-col p-6">
        <h2 className="text-xl font-semibold" style={{ color: isPopular ? "#E94E6F" : "#273068" }}>
          {PLAN_LABELS[plan.name]}
        </h2>

        <div className="mt-3 flex items-baseline justify-center gap-1">
          {isFree ? (
            <>
              <span className="text-[40px] font-semibold leading-none text-[#273068]">0</span>
              <span className="text-[25px] font-semibold text-[#273068]">€</span>
            </>
          ) : (
            <span className="text-[26px] font-semibold leading-none" style={{ color: isPopular ? "#E94E6F" : "#273068" }}>
              {formatPrice(plan.price)}
            </span>
          )}
          <span className="ml-1 text-[11px] font-light" style={{ color: isPopular ? "#E94E6F" : "#273068" }}>
            {plan.interval === "year" ? "/an" : plan.interval === "month" ? "/mois" : ""}
          </span>
        </div>

        <ul className="mt-5 space-y-2 text-left">
          {PLAN_FEATURES[plan.name].map((feature) => (
            <li key={feature} className="flex items-start gap-[11px]">
              <CheckIcon active={isPopular} />
              <span className="text-[11px] font-light leading-[19px] text-black">{feature}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-5">
          <button
            type="button"
            onClick={() => onSelect(plan)}
            disabled={isLoading}
            className={`w-full rounded-[9px] px-4 py-2.5 text-sm font-medium transition ${
              isFree
                ? "border border-[#273068] bg-transparent text-[#273068] hover:bg-[#f6f6f6]"
                : "bg-[#E94E6F] text-white hover:bg-[#d63f5f]"
            } disabled:cursor-not-allowed disabled:opacity-50`}
          >
            {isLoading ? "Chargement..." : isFree ? "Commencer gratuitement" : "Choisir cette formule"}
          </button>
        </div>
      </div>
    </article>
  )
}
