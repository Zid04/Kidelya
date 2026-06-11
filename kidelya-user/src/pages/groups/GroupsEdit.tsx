import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import api from "@/api/axios"

interface Child {
  idchild: number
  firstname: string
  avatar?: string | null
}

interface Group {
  idgroup: number
  name: string
  children: Child[]
}

export default function GroupEdit() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [group, setGroup] = useState<Group | null>(null)
  const [allChildren, setAllChildren] = useState<Child[]>([])
  const [name, setName] = useState("")
  const [selectedChildren, setSelectedChildren] = useState<number[]>([])

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        // Charger le groupe et la liste des enfants en parallèle
        const [groupRes, childRes] = await Promise.all([
          api.get(`/groups/${id}`),
          api.get("/me/children"),
        ])

        if (!groupRes.data.group) {
          setError("Groupe introuvable.")
          return
        }

        setGroup(groupRes.data.group)
        setName(groupRes.data.group.name)
        setSelectedChildren(groupRes.data.group.children.map((c: Child) => c.idchild))
        setAllChildren(childRes.data.children || [])
      } catch (e) {
        setError("Impossible de charger ce groupe.")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

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
      await api.post(`/groups/${id}`, {
        name,
        children: selectedChildren,
      })
      navigate(`/groups/${id}`)
    } catch (e) {
      setError("Impossible de mettre à jour le groupe.")
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

  if (error || !group) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#6F8D4C]">
        {error || "Groupe introuvable."}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white px-6 py-10 max-w-3xl mx-auto">

      <h1 className="text-3xl font-bold text-[#93197D] mb-8">
        Modifier le groupe : {group.name} 🌸
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
        {/* Nom du groupe */}
        <div>
          <label className="block text-sm font-semibold text-[#93197D] mb-1">
            Nom du groupe
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border border-[#FDC600]/40 rounded-lg px-4 py-2"
          />
        </div>

        {/* Sélection des enfants */}
        <div>
          <label className="block text-sm font-semibold text-[#93197D] mb-3">
            Enfants du groupe
          </label>

          {allChildren.length === 0 ? (
            <p className="text-[#6F8D4C]">Aucun enfant disponible.</p>
          ) : (
            <div className="space-y-3">
              {allChildren.map((child) => (
                <label
                  key={child.idchild}
                  className="flex items-center gap-3 bg-[#FFF3E0] p-3 rounded-lg cursor-pointer hover:bg-[#FFE8C2]"
                >
                  <input
                    type="checkbox"
                    checked={selectedChildren.includes(child.idchild)}
                    onChange={() => toggleChild(child.idchild)}
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
            {saving ? "Enregistrement…" : "Enregistrer"}
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
