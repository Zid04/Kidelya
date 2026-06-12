import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "@/api/axios"

interface Child {
  idchildren: number
  firstname: string
  photourl?: string | null
}

export default function GroupCreate() {
  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [allChildren, setAllChildren] = useState<Child[]>([])
  const [selectedChildren, setSelectedChildren] = useState<number[]>([])

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/children")
        setAllChildren(res.data.data || [])
      } catch (e) {
        setError("Impossible de charger les enfants.")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const toggleChild = (childId: number) => {
    setSelectedChildren((prev) =>
      prev.includes(childId)
        ? prev.filter((id) => id !== childId)
        : [...prev, childId]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      await api.post("/groups", {
        name,
        children: selectedChildren,
      })
      setSuccess(true)
      setTimeout(() => navigate("/groups"), 1500)
    } catch (e) {
      setError("Impossible de créer le groupe.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-[#273068]">Chargement…</div>

  return (
    <div className="min-h-screen bg-white px-6 py-10 max-w-3xl mx-auto">

      <div className="flex items-center gap-3 mb-8">
        <button type="button" onClick={() => navigate(-1)}
          className="-ml-4 px-4 py-2 bg-[#E94E6F] text-white rounded-lg font-semibold hover:bg-[#d63f5f]">
          Retour
        </button>
        <h1 className="text-3xl font-bold text-[#7C67B2]">Créer un groupe</h1>
      </div>

      {success && (
        <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-semibold text-green-700">
          Groupe créé avec succès ! Redirection…
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm font-semibold text-red-600">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="bg-[#FFFEFA] rounded-xl shadow-sm p-6 space-y-6">

        <div>
          <label className="block text-sm font-semibold text-[#7C67B2] mb-1">Nom du groupe *</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
            className="w-full border border-gray-200 rounded-lg px-4 py-2" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#7C67B2] mb-3">Sélectionner les enfants</label>
          {allChildren.length === 0 ? (
            <p className="text-[#273068]">Aucun enfant disponible.</p>
          ) : (
            <div className="space-y-3">
              {allChildren.map((child) => (
                <label key={child.idchildren}
                  className="flex items-center gap-3 bg-white p-3 rounded-lg cursor-pointer hover:bg-[#D5CDE2] transition-colors">
                  <input type="checkbox" checked={selectedChildren.includes(child.idchildren)}
                    onChange={() => toggleChild(child.idchildren)} />
                  {child.photourl ? (
                    <img src={child.photourl} alt={child.firstname} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#D5CDE2] flex items-center justify-center text-[#7C67B2] font-bold">
                      {child.firstname[0]}
                    </div>
                  )}
                  <span className="text-[#273068] font-semibold">{child.firstname}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        <button type="submit" disabled={saving}
          className="w-full py-3 bg-[#E94E6F] text-white rounded-lg font-semibold hover:bg-[#d63f5f] disabled:opacity-50">
          {saving ? "Création…" : "Créer le groupe"}
        </button>
      </form>
    </div>
  )
}
