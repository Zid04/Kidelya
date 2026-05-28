import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

interface Child {
  idchild: number
  firstname: string
  birthdate: string
  avatar?: string | null
}

interface SubscriptionInfo {
  type: "free" | "monthly" | "annual"
}

export default function ChildrenIndex() {
  const [children, setChildren] = useState<Child[]>([])
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/me/children")
        const json = await res.json()
        setChildren(json.children || [])

        const subRes = await fetch("/api/me/subscription")
        const subJson = await subRes.json()
        setSubscription(subJson.subscription || { type: "free" })
      } catch (e) {
        console.error("Erreur chargement enfants :", e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#6F8D4C]">
        Chargement des enfants…
      </div>
    )
  }

  // 🔒 Limites selon abonnement
  const limit =
    subscription?.type === "free"
      ? 1
      : subscription?.type === "monthly"
      ? 5
      : Infinity

  const canAdd = children.length < limit

  return (
    <div className="min-h-screen bg-[#FFF9F0] px-6 py-10 max-w-5xl mx-auto">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-[#93197D]">
          Mes enfants 🌸
        </h1>

        <Link
          to="/children/create"
          className={`px-4 py-2 rounded-lg font-semibold shadow transition ${
            canAdd
              ? "bg-[#E94E6F] text-white hover:bg-[#d63f5f]"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Ajouter un enfant
        </Link>
      </div>

      {/* BADGE ABONNEMENT */}
      <div className="mb-6">
        {subscription?.type === "free" && (
          <p className="text-[#6F8D4C]">
            Abonnement <strong>Free</strong> — 1 enfant maximum
          </p>
        )}
        {subscription?.type === "monthly" && (
          <p className="text-[#6F8D4C]">
            Abonnement <strong>Mensuel</strong> — 5 enfants maximum
          </p>
        )}
        {subscription?.type === "annual" && (
          <p className="text-[#6F8D4C]">
            Abonnement <strong>Annuel</strong> — Enfants illimités
          </p>
        )}
      </div>

      {/* LISTE DES ENFANTS */}
      {children.length === 0 ? (
        <p className="text-[#6F8D4C]">Aucun enfant enregistré.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {children.map((child) => (
            <div
              key={child.idchild}
              className="bg-white rounded-xl shadow-sm border border-[#FDC600]/40 p-5 flex items-center gap-4"
            >
              {/* Avatar */}
              {child.avatar ? (
                <img
                  src={child.avatar}
                  alt={child.firstname}
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-[#FFF3E0] flex items-center justify-center text-[#93197D] font-bold text-xl">
                  {child.firstname[0]}
                </div>
              )}

              {/* Infos */}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-[#93197D]">
                  {child.firstname}
                </h3>

                <p className="text-sm text-[#6F8D4C]">
                  Né(e) le {new Date(child.birthdate).toLocaleDateString("fr-FR")}
                </p>

                <div className="mt-3 flex gap-3">
                  <Link
                    to={`/children/${child.idchild}`}
                    className="text-[#E94E6F] font-semibold hover:underline text-sm"
                  >
                    Voir →
                  </Link>

                  <Link
                    to={`/children/${child.idchild}/edit`}
                    className="text-[#93197D] font-semibold hover:underline text-sm"
                  >
                    Modifier
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
