import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
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

function PlanningShowContent() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [planning, setPlanning] = useState<Planning | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/plannings/${id}`)
        const json = await res.json()

        if (!json.planning) {
          setError("Planning introuvable.")
          return
        }

        setPlanning(json.planning)
      } catch (e) {
        console.error("Erreur chargement planning :", e)
        setError("Impossible de charger ce planning.")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const handleDelete = async () => {
    if (!confirm("Supprimer ce planning ?")) return

    try {
      await fetch(`/api/plannings/${id}`, { method: "DELETE" })
      navigate("/plannings")
    } catch (e) {
      console.error(e)
      alert("Erreur lors de la suppression.")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#6F8D4C]">
        Chargement…
      </div>
    )
  }

  if (error || !planning) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#6F8D4C]">
        {error || "Planning introuvable."}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FFF9F0] px-6 py-10 max-w-3xl mx-auto">

      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-[#93197D]">
          {planning.title} 🌸
        </h1>

        <div className="flex gap-3">
          <Link
            to={`/plannings/${planning.idplanning}/edit`}
            className="px-4 py-2 bg-[#E94E6F] text-white rounded-lg font-semibold hover:bg-[#d63f5f]"
          >
            Modifier
          </Link>

          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-white border border-[#E94E6F] text-[#E94E6F] rounded-lg font-semibold hover:bg-[#FFF5F7]"
          >
            Supprimer
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[#FDC600]/40 p-6 space-y-4">

        <div>
          <p className="text-sm font-semibold text-[#93197D]">Date</p>
          <p className="text-[#6F8D4C]">
            {new Date(planning.date).toLocaleDateString("fr-FR")}
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold text-[#93197D]">Enfant concerné</p>

          <Link
            to={`/children/${planning.child.idchild}`}
            className="flex items-center gap-3 bg-[#FFF3E0] p-3 rounded-lg hover:bg-[#FFE8C2] mt-2"
          >
            {planning.child.avatar ? (
              <img
                src={planning.child.avatar}
                alt={planning.child.firstname}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#93197D] font-bold text-xl">
                {planning.child.firstname[0]}
              </div>
            )}

            <span className="text-[#93197D] font-semibold text-lg">
              {planning.child.firstname}
            </span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function PlanningShow() {
  return (
    <ProtectedSubscription>
      <PlanningShowContent />
    </ProtectedSubscription>
  )
}
