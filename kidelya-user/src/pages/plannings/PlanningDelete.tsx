import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import ProtectedSubscription from "../../components/ProtectedSubscription"

interface Child {
  idchild: number
  firstname: string
}

interface Planning {
  idplanning: number
  title: string
  date: string
  child: Child
}

function PlanningDeleteContent() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [planning, setPlanning] = useState<Planning | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

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
        console.error(e)
        setError("Impossible de charger ce planning.")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const handleDelete = async () => {
    if (!planning) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/plannings/${planning.idplanning}`, {
        method: "DELETE",
      })
      if (!res.ok) {
        throw new Error("Erreur suppression")
      }
      navigate("/plannings")
    } catch (e) {
      console.error(e)
      setError("Erreur lors de la suppression.")
      setDeleting(false)
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
    <div className="min-h-screen bg-[#FFF9F0] px-6 py-10 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold text-[#93197D] mb-6">
        Supprimer ce planning ? 🔒
      </h1>

      <div className="bg-white rounded-xl shadow-sm border border-[#FDC600]/40 p-6 space-y-4 mb-6">
        <p className="text-lg font-semibold text-[#93197D]">
          {planning.title}
        </p>
        <p className="text-sm text-[#6F8D4C]">
          {new Date(planning.date).toLocaleDateString("fr-FR")}
        </p>
        <p className="text-sm text-[#6F8D4C]">
          Enfant : <span className="font-semibold">{planning.child.firstname}</span>
        </p>
      </div>

      <p className="text-[#6F8D4C] mb-6">
        Cette action est définitive. Le planning sera supprimé pour cet enfant.
      </p>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="flex-1 px-4 py-3 bg-[#E94E6F] text-white rounded-lg font-semibold hover:bg-[#d63f5f] disabled:opacity-50"
        >
          {deleting ? "Suppression…" : "Supprimer définitivement"}
        </button>

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex-1 px-4 py-3 bg-white border border-[#93197D] text-[#93197D] rounded-lg font-semibold hover:bg-[#FFF3E0]"
        >
          Annuler
        </button>
      </div>
    </div>
  )
}

export default function PlanningDelete() {
  return (
    <ProtectedSubscription>
      <PlanningDeleteContent />
    </ProtectedSubscription>
  )
}
