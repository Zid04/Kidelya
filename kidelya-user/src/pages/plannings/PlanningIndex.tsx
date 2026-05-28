import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import ProtectedSubscription from "@/components/ProtectedSubscription"

interface Child {
  idchild: number
  firstname: string
  avatar?: string | null
}

interface Planning {
  idplanning: number
  title: string
  date: string
  child: Child
}

function PlanningIndexContent() {
  const [plannings, setPlannings] = useState<Planning[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/plannings")
        const json = await res.json()
        setPlannings(json.plannings || [])
      } catch (e) {
        console.error("Erreur chargement plannings :", e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#6F8D4C]">
        Chargement des plannings…
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FFF9F0] px-6 py-10 max-w-5xl mx-auto">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-[#93197D]">
          Plannings 🌸
        </h1>

        <Link
          to="/plannings/create"
          className="px-4 py-2 bg-[#E94E6F] text-white rounded-lg font-semibold hover:bg-[#d63f5f]"
        >
          Créer un planning
        </Link>
      </div>

      {/* LISTE */}
      {plannings.length === 0 ? (
        <p className="text-[#6F8D4C]">Aucun planning enregistré.</p>
      ) : (
        <div className="space-y-4">
          {plannings.map((p) => (
            <div
              key={p.idplanning}
              className="bg-white rounded-xl shadow-sm border border-[#FDC600]/40 p-5 flex justify-between items-center"
            >
              <div>
                <h3 className="text-lg font-semibold text-[#93197D]">
                  {p.title}
                </h3>

                <p className="text-sm text-[#6F8D4C]">
                  {new Date(p.date).toLocaleDateString("fr-FR")}
                </p>

                <div className="flex items-center gap-2 mt-2">
                  {p.child.avatar ? (
                    <img
                      src={p.child.avatar}
                      alt={p.child.firstname}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#FFF3E0] flex items-center justify-center text-[#93197D] font-bold">
                      {p.child.firstname[0]}
                    </div>
                  )}

                  <span className="text-[#93197D] font-semibold">
                    {p.child.firstname}
                  </span>
                </div>
              </div>

              <Link
                to={`/plannings/${p.idplanning}`}
                className="px-4 py-2 bg-white border border-[#93197D] text-[#93197D] rounded-lg font-semibold hover:bg-[#FFF3E0]"
              >
                Voir →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function PlanningIndex() {
  return (
    <ProtectedSubscription>
      <PlanningIndexContent />
    </ProtectedSubscription>
  )
}
