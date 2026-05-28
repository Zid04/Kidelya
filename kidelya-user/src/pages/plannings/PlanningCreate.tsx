import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import ProtectedSubscription from "@/components/ProtectedSubscription"

interface Child {
  idchild: number
  firstname: string
  avatar?: string | null
}

function PlanningCreateContent() {
  const navigate = useNavigate()

  const [title, setTitle] = useState("")
  const [date, setDate] = useState("")
  const [childId, setChildId] = useState<number | null>(null)

  const [children, setChildren] = useState<Child[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/me/children")
        const json = await res.json()
        setChildren(json.children || [])
      } catch (e) {
        console.error("Erreur chargement enfants :", e)
        setError("Impossible de charger les enfants.")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!childId) {
      setError("Veuillez sélectionner un enfant.")
      return
    }

    setSaving(true)
    setError(null)

    try {
      const res = await fetch("/api/plannings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          date,
          idchild: childId,
        }),
      })

      if (!res.ok) {
        throw new Error("Erreur lors de la création du planning.")
      }

      navigate("/plannings")
    } catch (e) {
      console.error(e)
      setError("Impossible de créer le planning.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#6F8D4C]">
        Chargement…
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FFF9F0] px-6 py-10 max-w-xl mx-auto">

      <h1 className="text-3xl font-bold text-[#93197D] mb-8">
        Créer un planning 🌸
      </h1>

      {error && (
        <div className="mb-4 text-[#E94E6F] font-semibold">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm border border-[#FDC600]/40 p-6 space-y-6"
      >
        {/* Titre */}
        <div>
          <label className="block text-sm font-semibold text-[#93197D] mb-1">
            Titre du planning
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full border border-[#FDC600]/40 rounded-lg px-4 py-2"
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-semibold text-[#93197D] mb-1">
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full border border-[#FDC600]/40 rounded-lg px-4 py-2"
          />
        </div>

        {/* Enfant */}
        <div>
          <label className="block text-sm font-semibold text-[#93197D] mb-3">
            Enfant concerné
          </label>

          {children.length === 0 ? (
            <p className="text-[#6F8D4C]">Aucun enfant disponible.</p>
          ) : (
            <div className="space-y-3">
              {children.map((child) => (
                <label
                  key={child.idchild}
                  className="flex items-center gap-3 bg-[#FFF3E0] p-3 rounded-lg cursor-pointer hover:bg-[#FFE8C2]"
                >
                  <input
                    type="radio"
                    name="child"
                    checked={childId === child.idchild}
                    onChange={() => setChildId(child.idchild)}
                  />

                  {child.avatar ? (
                    <img
                      src={child.avatar}
                      alt={child.firstname}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#93197D] font-bold">
                      {child.firstname[0]}
                    </div>
                  )}

                  <span className="text-[#93197D] font-semibold">
                    {child.firstname}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Boutons */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 px-4 py-3 bg-[#E94E6F] text-white rounded-lg font-semibold hover:bg-[#d63f5f] disabled:opacity-50"
          >
            {saving ? "Création…" : "Créer le planning"}
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 px-4 py-3 bg-white border border-[#93197D] text-[#93197D] rounded-lg font-semibold hover:bg-[#FFF3E0]"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  )
}

export default function PlanningCreate() {
  return (
    <ProtectedSubscription>
      <PlanningCreateContent />
    </ProtectedSubscription>
  )
}
