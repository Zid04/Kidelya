import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

interface PurchasedActivity {
  idactivities: number
  title: string
  photourl?: string | null
  agemin?: number | null
  agemax?: number | null
  duration?: number | null
}

interface PurchasedPack {
  idpack: number
  title: string
  illustration?: string | null
  activities_count: number
}

interface PurchasesResponse {
  activities: PurchasedActivity[]
  packs: PurchasedPack[]
  has_subscription: boolean
}

export default function MesAchats() {
  const [data, setData] = useState<PurchasesResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/me/purchases")
        const json = await res.json()
        setData(json.data || json)
      } catch (e) {
        console.error("Erreur chargement achats :", e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#6F8D4C]">
        Chargement de vos achats…
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#6F8D4C]">
        Impossible de charger vos achats.
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FFF9F0] px-6 py-10 max-w-6xl mx-auto">

      {/* TITRE */}
      <h1 className="text-3xl font-bold text-[#93197D] mb-4">
        Mes achats 🌸
      </h1>

      {/* LIEN HISTORIQUE */}
      <div className="mb-10">
        <Link
          to="/historique-achats"
          className="px-4 py-2 bg-white border border-[#E94E6F] text-[#E94E6F] rounded-lg font-semibold hover:bg-[#FFF5F7]"
        >
          Voir l’historique d’achat →
        </Link>
      </div>

      {/* ABONNEMENT */}
      {data.has_subscription && (
        <div className="bg-white border border-[#FDC600]/40 rounded-xl p-6 mb-10 shadow-sm">
          <h2 className="text-xl font-semibold text-[#93197D] mb-2">
            Abonnement actif 🌼
          </h2>
          <p className="text-[#6F8D4C] mb-4">
            Vous avez accès à toutes les activités.
          </p>
          <Link
            to="/bibliotheque"
            className="px-4 py-2 bg-[#E94E6F] text-white rounded-lg font-semibold"
          >
            Explorer les activités
          </Link>
        </div>
      )}

      {/* ACTIVITÉS ACHETÉES */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-[#93197D] mb-4">
          Activités achetées
        </h2>

        {data.activities.length === 0 ? (
          <p className="text-[#6F8D4C]">Aucune activité achetée.</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {data.activities.map((a) => (
              <div
                key={a.idactivities}
                className="bg-white rounded-xl shadow-sm border border-[#FDC600]/40 p-4"
              >
                {a.photourl && (
                  <img
                    src={a.photourl}
                    alt={a.title}
                    className="rounded-lg mb-3 w-full h-40 object-cover"
                  />
                )}

                <h3 className="text-[#93197D] font-semibold text-lg mb-1">
                  {a.title}
                </h3>

                <p className="text-xs text-[#6F8D4C] mb-3">
                  {a.agemin}-{a.agemax} ans • {a.duration} min
                </p>

                <Link
                  to={`/activites/${a.idactivities}`}
                  className="text-[#E94E6F] font-semibold hover:underline"
                >
                  Voir l’activité →
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* PACKS ACHETÉS */}
      <section>
        <h2 className="text-2xl font-semibold text-[#93197D] mb-4">
          Packs achetés
        </h2>

        {data.packs.length === 0 ? (
          <p className="text-[#6F8D4C]">Aucun pack acheté.</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {data.packs.map((p) => (
              <div
                key={p.idpack}
                className="bg-white rounded-xl shadow-sm border border-[#FDC600]/40 overflow-hidden"
              >
                {p.illustration && (
                  <img
                    src={p.illustration}
                    alt={p.title}
                    className="h-40 w-full object-cover"
                  />
                )}

                <div className="p-4">
                  <h3 className="text-[#93197D] font-semibold text-lg mb-1">
                    {p.title}
                  </h3>

                  <p className="text-xs text-[#6F8D4C] mb-3">
                    {p.activities_count} activités incluses
                  </p>

                  <Link
                    to={`/packs/${p.idpack}`}
                    className="text-[#E94E6F] font-semibold hover:underline"
                  >
                    Voir le pack →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  )
}
