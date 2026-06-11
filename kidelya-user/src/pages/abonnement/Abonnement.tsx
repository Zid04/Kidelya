import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "@/api/axios"
import { useAuth } from "@/context/useAuth"
import type { SubscriptionPlan } from "@/types/Subscription"
import AbonnementHero from "./AbonnementHero"
import AbonnementFAQ from "./AbonnementFAQ"
import PlanCard from "./PlanCard"
import ComparisonTable from "./ComparisonTable"

const PLAN_ORDER: Record<SubscriptionPlan["name"], number> = { Free: 1, Monthly: 2, Annual: 3 }

export default function AbonnementPage() {
  const [plans, setPlans]               = useState<SubscriptionPlan[]>([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState<string | null>(null)
  const [loadingPlanId, setLoadingPlanId] = useState<number | null>(null)
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    api.get("/subscriptions/plans")
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data?.data || []
        setPlans(
          data
            .filter((p: SubscriptionPlan) => p.is_active)
            .sort((a: SubscriptionPlan, b: SubscriptionPlan) => PLAN_ORDER[a.name] - PLAN_ORDER[b.name])
        )
      })
      .catch(() => setError("Impossible de charger les formules. Veuillez réessayer."))
      .finally(() => setLoading(false))
  }, [])

  const handleSelect = async (plan: SubscriptionPlan) => {
    if (plan.name === "Free") { navigate("/register"); return }
    if (!user) {
      navigate("/login", { state: { redirectAfter: "/abonnements", planId: plan.idplan } })
      return
    }
    try {
      setLoadingPlanId(plan.idplan)
      const res = await api.post("/stripe/subscription/checkout", { plan_id: plan.idplan })
      window.open(res.data.url, "_self")
    } catch {
      setError("Impossible de lancer le paiement. Veuillez réessayer.")
    } finally {
      setLoadingPlanId(null)
    }
  }

  return (
    <div className="min-h-screen bg-white text-[#273068]">
      <AbonnementHero/>

      <main className="mx-auto max-w-6xl px-6 pb-16">
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">
            {error}
          </div>
        )}

        {loading ? (
          <div className="py-16 text-center text-[#6F8D4C]">Chargement des formules...</div>
        ) : plans.length === 0 && !error ? (
          <p className="mx-auto max-w-2xl py-16 text-center text-[#6F8D4C]">
            Les formules sont momentanément indisponibles.
          </p>
        ) : (
          <div className="mx-auto flex max-w-5xl flex-wrap items-stretch justify-center gap-6">
            {plans.map((plan) => (
              <PlanCard key={plan.idplan} plan={plan} isLoading={loadingPlanId === plan.idplan} onSelect={handleSelect}/>
            ))}
          </div>
        )}

        <p className="mt-10 text-center text-xs text-black">
          Paiement 100% sécurisé. Annulez quand vous voulez. Sans engagement.
        </p>

        <ComparisonTable/>
        <AbonnementFAQ/>
      </main>
    </div>
  )
}
