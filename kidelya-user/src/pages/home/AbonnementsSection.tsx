import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "@/api/axios"
import { formatPrice } from "@/utils/media"
import { useAuth } from "@/context/useAuth"
import fleurs03 from "@/assets/FLEURS_03-1Abonnement.png"
import fleurs04 from "@/assets/FLEURS_04-2Abonnement.png"

export type SubscriptionPlan = {
  idplan: number
  name: "Free" | "Monthly" | "Annual"
  price: number | string
  interval: "none" | "month" | "year"
  interval_count: number
  has_all_packs: boolean
  has_planning: boolean
  is_active: boolean
}

const order: Record<SubscriptionPlan["name"], number> = {
  Free: 1,
  Monthly: 2,
  Annual: 3,
}

const labels: Record<SubscriptionPlan["name"], string> = {
  Free: "Gratuit",
  Monthly: "Abonnement mensuel",
  Annual: "Abonnement annuel",
}

const features: Record<SubscriptionPlan["name"], string[]> = {
  Free: [
    "Accès limité à une sélection d'activités",
    "1 enfant",
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
      className="mt-[2px] inline-flex h-[14px] w-[14px] shrink-0 items-center justify-center rounded-full"
      style={{ backgroundColor: active ? "#E94E6F" : "#273068" }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 16 16" className="h-[10px] w-[10px]" fill="none">
        <path
          d="M3.5 8.5L6.5 11.5L12.5 5.5"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  )
}

export default function AbonnementsSection() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [loadingPlanId, setLoadingPlanId] = useState<number | null>(null)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await api.get("/subscriptions/plans")
        const activePlans: SubscriptionPlan[] = Array.isArray(res.data)
          ? res.data.filter((p: SubscriptionPlan) => p.is_active)
          : []
        setPlans(activePlans.sort((a, b) => order[a.name] - order[b.name]))
      } catch {
        setPlans([])
      }
    }
    fetchPlans()
  }, [])

  const handleSelect = async (plan: SubscriptionPlan) => {
    if (plan.name === "Free") {
      navigate("/register")
      return
    }
    if (!user) {
      navigate("/login", { state: { redirectAfter: "/", planId: plan.idplan } })
      return
    }
    try {
      setLoadingPlanId(plan.idplan)
      const res = await api.post("/stripe/subscription/checkout", {
        plan_id: plan.idplan,
      })
      window.open(res.data.url, "_self")
    } catch {
      setCheckoutError("Erreur lors de la création de la session de paiement. Veuillez réessayer.")
    } finally {
      setLoadingPlanId(null)
    }
  }

  return (
    <section className="relative overflow-hidden bg-transparent py-16 md:py-20">

      {/* Fleur gauche */}
      <img
        src={fleurs03}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 w-[80px] object-contain sm:w-[120px] lg:w-[200px]"
      />

      {/* Fleur droite */}
      <img
        src={fleurs04}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-0 w-[80px] object-contain sm:w-[120px] lg:w-[200px]"
      />

      <div className="relative mx-auto max-w-7xl px-6">

        {/* Titre centré */}
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-[#273068] md:text-3xl">
            Choisissez la formule qui vous convient
          </h2>
          <div className="mx-auto mb-3 mt-3 h-0.5 w-10 bg-[#E94E6F]" />
          <p className="text-sm text-black">
            Accédez à encore plus d'activités grâce à nos abonnements
          </p>
        </div>

        {checkoutError && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-600 text-center">{checkoutError}</div>
        )}

        {plans.length === 0 ? (
          <p className="mx-auto max-w-2xl text-center text-[#6F8D4C]">
            Les formules sont momentanément indisponibles.
          </p>
        ) : (
          <div className="mx-auto flex max-w-5xl flex-wrap items-end justify-center gap-6">
            {plans.map((plan) => {
              const isMonthly = plan.name === "Monthly"
              const isFree = Number(plan.price) === 0
              const isLoading = loadingPlanId === plan.idplan

              return (
                <article
                  key={plan.idplan}
                  className={`flex w-full max-w-[241px] flex-col overflow-hidden rounded-2xl bg-white shadow-md sm:w-[241px] ${
                    isMonthly
                      ? "-translate-y-6 border border-[#E94E6F] shadow-xl"
                      : "border border-[#FDC600]/30"
                  }`}
                >
                  {isMonthly && (
                    <div className="w-full bg-[#E94E6F] py-1.5 text-center text-xs font-bold text-white">
                      Populaire
                    </div>
                  )}

                  <div className="flex flex-1 flex-col p-6">
                    <h3
                      className="mb-4 text-xl font-semibold leading-tight"
                      style={{ color: isMonthly ? "#E94E6F" : "#273068" }}
                    >
                      {labels[plan.name]}
                    </h3>

                    <div className="mb-1 flex items-baseline justify-center gap-1">
                      {isFree ? (
                        <>
                          <span className="text-[41px] font-semibold leading-none text-[#273068]">
                            0
                          </span>
                          <span className="text-[26px] font-semibold text-[#273068]">
                            €
                          </span>
                        </>
                      ) : (
                        <span
                          className="text-[26px] font-semibold leading-none"
                          style={{ color: isMonthly ? "#E94E6F" : "#273068" }}
                        >
                          {formatPrice(plan.price)}
                        </span>
                      )}
                      <span
                        className="ml-1 text-[11px] font-light"
                        style={{ color: isMonthly ? "#E94E6F" : "#273068" }}
                      >
                        {plan.interval === "year" ? "/an" : "/mois"}
                      </span>
                    </div>

                    <ul className="mb-6 mt-5 space-y-2 text-left">
                      {features[plan.name].map((feature) => (
                        <li key={feature} className="flex items-start gap-[11px]">
                          <CheckIcon active={isMonthly} />
                          <span className="text-[11px] font-light leading-[19px] text-black">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-auto">
                      <button
                        type="button"
                        onClick={() => handleSelect(plan)}
                        disabled={isLoading}
                        className={`w-full rounded-[9px] px-3 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
                          isMonthly
                            ? "bg-[#E94E6F] text-white hover:bg-[#d63f5f]"
                            : "border border-[#273068] bg-transparent text-[#273068] hover:bg-[#f5f5f5]"
                        }`}
                      >
                        {isLoading
                          ? "Chargement..."
                          : isFree
                          ? "Commencer"
                          : "Choisir cette formule"}
                      </button>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}

        <p className="mt-10 text-center text-xs text-black">
          Annulez quand vous voulez. Sans engagement.
        </p>
      </div>
    </section>
  )
}