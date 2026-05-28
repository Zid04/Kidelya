import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

interface Child {
  idchild: number
  firstname: string
  birthdate: string
  avatar?: string | null
}

export default function ChildrenEdit() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [child, setChild] = useState<Child | null>(null)
  const [firstname, setFirstname] = useState("")
  const [birthdate, setBirthdate] = useState("")
  const [avatar, setAvatar] = useState<File | null>(null)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/children/${id}`)
        const json = await res.json()

        if (!json.child) {
          setError("Enfant introuvable.")
          return
        }

        setChild(json.child)
        setFirstname(json.child.firstname)
        setBirthdate(json.child.birthdate)
      } catch (e) {
        console.error("Erreur chargement enfant :", e)
        setError("Impossible de charger cet enfant.")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("firstname", firstname)
      formData.append("birthdate", birthdate)
      if (avatar) formData.append("avatar", avatar)

      const res = await fetch(`/api/children/${id}`, {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        throw new Error("Erreur lors de la mise à jour.")
      }

      navigate(`/children/${id}`)
    } catch (e) {
      console.error(e)
      setError("Impossible de mettre à jour l’enfant.")
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

  if (error || !child) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#6F8D4C]">
        {error || "Enfant introuvable."}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FFF9F0] px-6 py-10 max-w-xl mx-auto">

      <h1 className="text-3xl font-bold text-[#93197D] mb-8">
        Modifier {child.firstname} 🌸
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
        {/* Prénom */}
        <div>
          <label className="block text-sm font-semibold text-[#93197D] mb-1">
            Prénom
          </label>
          <input
            type="text"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            required
            className="w-full border border-[#FDC600]/40 rounded-lg px-4 py-2"
          />
        </div>

        {/* Date de naissance */}
        <div>
          <label className="block text-sm font-semibold text-[#93197D] mb-1">
            Date de naissance
          </label>
          <input
            type="date"
            value={birthdate}
            onChange={(e) => setBirthdate(e.target.value)}
            required
            className="w-full border border-[#FDC600]/40 rounded-lg px-4 py-2"
          />
        </div>

        {/* Avatar */}
        <div>
          <label className="block text-sm font-semibold text-[#93197D] mb-1">
            Avatar (optionnel)
          </label>

          {child.avatar && (
            <img
              src={child.avatar}
              alt="avatar"
              className="w-24 h-24 rounded-full object-cover mb-3 shadow"
            />
          )}

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setAvatar(e.target.files?.[0] || null)}
            className="w-full"
          />
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
