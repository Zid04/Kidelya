import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import api from "@/api/axios"
import { formatPrice } from "@/utils/media"
import { useAuth } from "@/hooks/useAuth"
import NavFooter from "@/components/NavFooter"
import heroAbonnement from "@/assets/photo-hero-abonnement.png"

type SubscriptionPlan = {
  idplan: number
  name: "Free" | "Monthly" | "Annual"
  price: number | string
  interval: "none" | "month" | "year"
  interval_count: number
  has_all_packs: boolean
  has_planning: boolean
  is_active: boolean
}

const planLabels: Record<SubscriptionPlan["name"], string> = {
  Free: "Gratuit",
  Monthly: "Abonnement mensuel",
  Annual: "Abonnement annuel",
}

const order: Record<SubscriptionPlan["name"], number> = {
  Free: 1,
  Monthly: 2,
  Annual: 3,
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
      className="mt-[2px] inline-flex h-[14px] w-[14px] items-center justify-center rounded-full"
      style={{ backgroundColor: active ? "#E94E6F" : "#273068" }}
    >
      <svg viewBox="0 0 16 16" className="h-[10px] w-[10px]" fill="none">
        <path
          d="M3.5 8.5L6.5 11.5L12.5 5.5"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  )
}

function HeroInfoIcon({ type }: { type: "lock" | "spark" | "heart" }) {
  if (type === "lock") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#273068]" fill="none">
        <rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.8" />
        <path d="M8 10V7a4 4 0 118 0v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    )
  }
  if (type === "spark") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#273068]" fill="none">
        <path d="M12 3l1.8 4.5L18 9.3l-4.2 1.7L12 15.5 10.2 11 6 9.3l4.2-1.8L12 3z" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#273068]" fill="none">
      <path d="M12 20s-7-4.4-7-9.2A4.3 4.3 0 019.3 6c1.2 0 2.2.5 2.7 1.4.5-.9 1.5-1.4 2.7-1.4A4.3 4.3 0 0119 10.8C19 15.6 12 20 12 20z" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  )
}

function FeatureRowIcon({ kind }: { kind: "packs" | "kids" | "calendar" | "star" | "update" }) {
  const base = "h-4 w-4 text-[#273068]"
  if (kind === "packs") {
    return (
      <svg viewBox="0 0 20 20" className={base} fill="none">
        <rect x="2.5" y="5" width="15" height="11.5" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M2.5 8h15" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    )
  }
  if (kind === "kids") {
    return (
      <svg viewBox="0 0 20 20" className={base} fill="none">
        <circle cx="7" cy="6.5" r="2.2" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="13" cy="7.2" r="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M3.5 15c0-2.8 2-4.5 3.5-4.5S10.5 12.2 10.5 15" stroke="currentColor" strokeWidth="1.5" />
        <path d="M10.5 15c0-2.3 1.7-3.8 3.2-3.8s2.8 1.5 2.8 3.8" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    )
  }
  if (kind === "calendar") {
    return (
      <svg viewBox="0 0 20 20" className={base} fill="none">
        <rect x="3" y="4.5" width="14" height="12.5" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M3 8h14M6.2 3v3M13.8 3v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    )
  }
  if (kind === "star") {
    return (
      <svg viewBox="0 0 20 20" className={base} fill="none">
        <path d="M10 3.2l1.8 3.7 4.1.6-3 2.9.7 4.1-3.6-1.9-3.6 1.9.7-4.1-3-2.9 4.1-.6L10 3.2z" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 20 20" className={base} fill="none">
      <path d="M10 3.5a6.5 6.5 0 016.1 4.2M10 16.5a6.5 6.5 0 01-6.1-4.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M16 3.8v4h-4M4 16.2v-4h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function CellIcon({ ok }: { ok: boolean }) {
  return ok ? (
    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#E94E6F] text-white text-xs font-bold">
      ✓
    </span>
  ) : (
    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#D7D7D7] text-white text-xs font-bold">
      –
    </span>
  )
}

export default function AbonnementPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingPlanId, setLoadingPlanId] = useState<number | null>(null)
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    const fetchPlans = async () => {
      setLoading(true)
      try {
        const res = await api.get("/subscriptions/plans")
        const data = Array.isArray(res.data) ? res.data : res.data?.data || []
        const activePlans = data
          .filter((plan: SubscriptionPlan) => plan.is_active)
          .sort((a: SubscriptionPlan, b: SubscriptionPlan) => order[a.name] - order[b.name])
        setPlans(activePlans)
      } catch (e) {
        console.error(e)
        setPlans([])
      } finally {
        setLoading(false)
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
      navigate("/login", { state: { redirectAfter: "/abonnements", planId: plan.idplan } })
      return
    }

    try {
      setLoadingPlanId(plan.idplan)
      const res = await api.post("/stripe/subscription/checkout", { plan_id: plan.idplan })
      window.open(res.data.url, "_self")
    } catch (err) {
      console.error("Erreur création session Stripe :", err)
    } finally {
      setLoadingPlanId(null)
    }
  }

  return (
    <>
      <div className="min-h-screen bg-[#FFF9F0] text-[#273068]">
        <section className="mx-auto max-w-6xl px-6 pb-6 pt-14">
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_1fr]">
            <div className="text-center lg:text-left">
              <h1 className="text-3xl font-extrabold leading-tight md:text-[40px]">
                Choisissez la formule qui vous convient
              </h1>
              <div className="mx-auto mt-3 h-[3px] w-12 rounded-full bg-[#E94E6F] lg:mx-0" />
              <p className="mt-4 max-w-xl text-sm leading-6 text-[#4F5F45]">
                Accédez à encore plus d'activités créatives avec les abonnements Kidelya.
              </p>

              <div className="mt-6 flex flex-wrap gap-5 text-left">
                <div className="flex items-center gap-2 text-xs text-[#273068]">
                  <HeroInfoIcon type="lock" />
                  <span>Sécurisé et privé</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#273068]">
                  <HeroInfoIcon type="spark" />
                  <span>Sans engagement</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#273068]">
                  <HeroInfoIcon type="heart" />
                  <span>Contenus mis à jour</span>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-[18px] bg-transparent p-0">
              <img
                src={heroAbonnement}
                alt="Illustration abonnement"
                className="h-[220px] w-full rounded-[12px] object-cover md:h-[260px]"
              />
            </div>
          </div>
        </section>

        <main className="mx-auto max-w-6xl px-6 pb-16">
          {loading ? (
            <div className="py-16 text-center text-[#6F8D4C]">Chargement des formules...</div>
          ) : plans.length === 0 ? (
            <p className="mx-auto max-w-2xl py-16 text-center text-[#6F8D4C]">
              Les formules sont momentanément indisponibles.
            </p>
          ) : (
            <div className="mx-auto flex max-w-5xl flex-wrap items-stretch justify-center gap-6">
              {plans.map((plan) => {
                const isFree = Number(plan.price) === 0
                const isPopular = plan.name === "Monthly"
                const isLoading = loadingPlanId === plan.idplan

                return (
                  <article
                    key={plan.idplan}
                    className={`flex w-full max-w-[250px] flex-col overflow-hidden rounded-2xl bg-white shadow-md sm:w-[250px] ${
                      isPopular ? "border border-[#E94E6F] shadow-xl md:-translate-y-5" : "border border-[#F1D9B5]"
                    }`}
                  >
                    {isPopular && (
                      <div className="bg-[#E94E6F] py-1.5 text-center text-xs font-bold text-white">
                        Populaire
                      </div>
                    )}

                    <div className="flex min-h-[430px] flex-1 flex-col p-6">
                      <h2 className="text-xl font-semibold" style={{ color: isPopular ? "#E94E6F" : "#273068" }}>
                        {planLabels[plan.name]}
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
                        {features[plan.name].map((feature) => (
                          <li key={feature} className="flex items-start gap-[11px]">
                            <CheckIcon active={isPopular} />
                            <span className="text-[11px] font-light leading-[19px] text-black">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-auto pt-5">
                        <button
                          type="button"
                          onClick={() => handleSelect(plan)}
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
              })}
            </div>
          )}

          <p className="mt-10 text-center text-xs text-black">
            Paiement 100% sécurisé. Annulez quand vous voulez. Sans engagement.
          </p>

          <section className="mt-14">
            <h3 className="mb-5 text-center text-xl font-semibold text-[#273068]">
              Comparez nos formules
            </h3>

            <div className="overflow-x-auto rounded-xl border border-[#F1D9B5] bg-white">
              <table className="w-full min-w-[860px] border-collapse text-sm">
                <thead>
                  <tr className="bg-[#FFF3E0] text-[#273068]">
                    <th className="p-3 text-left font-semibold">
                      Fonctionnalités
                      <p className="mt-1 text-[11px] font-normal text-[#6F8D4C]">Ce qui est inclus dans chaque formule</p>
                    </th>
                    <th className="p-3 text-center font-semibold">
                      Gratuit
                      <p className="mt-1 text-[11px] font-normal text-[#6F8D4C]">Découverte</p>
                    </th>
                    <th className="p-3 text-center font-semibold">
                      Mensuel
                      <p className="mt-1 text-[11px] font-normal text-[#6F8D4C]">Le plus choisi</p>
                    </th>
                    <th className="p-3 text-center font-semibold">
                      Annuel
                      <p className="mt-1 text-[11px] font-normal text-[#6F8D4C]">Économique</p>
                    </th>
                  </tr>
                </thead>

                <tbody className="text-[#4F5F45]">
                  <tr className="border-t border-[#F1D9B5]/60">
                    <td className="p-3">
                      <div className="flex items-center gap-2 text-[#273068]">
                        <FeatureRowIcon kind="packs" />
                        <span>Accès aux packs</span>
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <CellIcon ok={false} />
                        <span>Limité</span>
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <CellIcon ok={true} />
                        <span>Illimité</span>
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <CellIcon ok={true} />
                        <span>Illimité</span>
                      </div>
                    </td>
                  </tr>

                  <tr className="border-t border-[#F1D9B5]/60">
                    <td className="p-3">
                      <div className="flex items-center gap-2 text-[#273068]">
                        <FeatureRowIcon kind="kids" />
                        <span>Nombre d'enfants</span>
                      </div>
                    </td>
                    <td className="p-3 text-center">1 enfant</td>
                    <td className="p-3 text-center">10 enfants</td>
                    <td className="p-3 text-center">Illimité</td>
                  </tr>

                  <tr className="border-t border-[#F1D9B5]/60">
                    <td className="p-3">
                      <div className="flex items-center gap-2 text-[#273068]">
                        <FeatureRowIcon kind="calendar" />
                        <span>Planification calendrier</span>
                      </div>
                    </td>
                    <td className="p-3 text-center"><CellIcon ok={false} /></td>
                    <td className="p-3 text-center"><CellIcon ok={true} /></td>
                    <td className="p-3 text-center"><CellIcon ok={true} /></td>
                  </tr>

                  <tr className="border-t border-[#F1D9B5]/60">
                    <td className="p-3">
                      <div className="flex items-center gap-2 text-[#273068]">
                        <FeatureRowIcon kind="star" />
                        <span>Enregistrements favoris</span>
                      </div>
                    </td>
                    <td className="p-3 text-center"><CellIcon ok={false} /></td>
                    <td className="p-3 text-center"><CellIcon ok={true} /></td>
                    <td className="p-3 text-center"><CellIcon ok={true} /></td>
                  </tr>

                  <tr className="border-t border-[#F1D9B5]/60">
                    <td className="p-3">
                      <div className="flex items-center gap-2 text-[#273068]">
                        <FeatureRowIcon kind="update" />
                        <span>Mises à jour régulières</span>
                      </div>
                    </td>
                    <td className="p-3 text-center"><CellIcon ok={false} /></td>
                    <td className="p-3 text-center"><CellIcon ok={true} /></td>
                    <td className="p-3 text-center"><CellIcon ok={true} /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="mt-14">
            <h3 className="mb-5 text-center text-xl font-semibold text-[#273068]">
              Questions fréquentes
            </h3>

            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-4">
                {[
                  ["Puis-je annuler mon abonnement à tout moment ?", "Oui. L'accès reste actif jusqu'à la fin de la période en cours."],
                  ["Puis-je changer de formule plus tard ?", "Oui, vous pouvez changer de formule à tout moment."],
                  ["Les formules payantes couvrent-elles plusieurs enfants ?", "Oui, les offres payantes permettent la gestion de plusieurs profils."],
                ].map(([question, answer]) => (
                  <details key={question} className="rounded-xl border border-[#F1D9B5] bg-white p-4 text-sm text-[#4F5F45]">
                    <summary className="cursor-pointer font-semibold text-[#273068]">{question}</summary>
                    <p className="mt-2">{answer}</p>
                  </details>
                ))}
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-3">
                {[
                  ["lock", "Annulation facile", "Gérez votre formule en un clic."],
                  ["spark", "Paiement sécurisé", "Transactions protégées en permanence."],
                  ["heart", "Support réactif", "Notre équipe vous répond rapidement."],
                ].map(([icon, title, text]) => (
                  <div
                    key={String(title)}
                    className="rounded-xl border border-[#F1D9B5] bg-transparent px-4 py-3"
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="mb-2 text-[#273068]">
                        <HeroInfoIcon type={icon as "lock" | "spark" | "heart"} />
                      </div>
                      <p className="text-sm font-semibold text-[#273068]">{title}</p>
                      <p className="mt-1 text-xs text-[#4F5F45]">{text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <p className="mt-6 text-center text-xs text-[#6F8D4C]">
              Une question ?{" "}
              <Link to="/contact" className="font-semibold text-[#E94E6F]">
                Contactez-nous
              </Link>
            </p>
          </section>
        </main>
      </div>

      <NavFooter />
    </>
  )
}