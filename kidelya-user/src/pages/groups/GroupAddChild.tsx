import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import api from "@/api/axios"

interface Child {
  idchildren: number
  firstname: string
  photourl?: string | null
}

export default function GroupAddChild() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [children, setChildren] = useState<Child[]>([])
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/children")
        setChildren(res.data.data || [])
      } catch (e) {
        setError("Impossible de charger les enfants.")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedId) {
      setError("Veuillez sélectionner un enfant.")
      return
    }

    setSaving(true)
    setError(null)

    try {
      await api.post(`/groups/${id}/children`, { child_id: selectedId })
      navigate(`/groups/${id}`)
    } catch (e) {
      setError("Impossible d'ajouter l'enfant au groupe.")
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
    <div className="min-h-screen bg-white px-6 py-10 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold text-[#93197D] mb-8">
        Ajouter un enfant au groupe 🌸
      </h1>

      {error && (
        <div className="mb-4 text-[#E94E6F] font-semibold">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm border border-[#FDC600]/40 p-6 space-y-4"
      >
        {children.length === 0 ? (
          <p className="text-[#6F8D4C]">Aucun enfant disponible.</p>
        ) : (
          <div className="space-y-3">
            {children.map((child) => (
              <label
                key={child.idchildren}
                className="flex items-center gap-3 bg-[#FFF3E0] p-3 rounded-lg cursor-pointer hover:bg-[#FFE8C2]"
              >
                <input
                  type="radio"
                  name="child"
                  checked={selectedId === child.idchildren}
                  onChange={() => setSelectedId(child.idchildren)}
                />

                {child.photourl ? (
                  <img
                    src={child.photourl}
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

        <div className="flex gap-4 mt-4">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 px-4 py-3 bg-[#E94E6F] text-white rounded-lg font-semibold hover:bg-[#d63f5f] disabled:opacity-50"
          >
            {saving ? "Ajout…" : "Ajouter"}
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
