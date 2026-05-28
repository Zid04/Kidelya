import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

interface Child {
  idchild: number
  firstname: string
  avatar?: string | null
}

export default function GuardianCreate() {
  const navigate = useNavigate()

  const [firstname, setFirstname] = useState("")
  const [lastname, setLastname] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")

  const [allChildren, setAllChildren] = useState<Child[]>([])
  const [selectedChildren, setSelectedChildren] = useState<number[]>([])

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/me/children")
        const json = await res.json()
        setAllChildren(json.children || [])
      } catch (e) {
        console.error("Erreur chargement enfants :", e)
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
      const res = await fetch("/api/guardians", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstname,
          lastname,
          email,
          phone,
          children: selectedChildren,
        }),
      })

      if (!res.ok) {
        throw new Error("Erreur lors de la création du parent.")
      }

      navigate("/guardians")
    } catch (e) {
      console.error(e)
      setError("Impossible de créer le parent.")
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
    <div className="min-h-screen bg-[#FFF9F0] px-6 py-10 max-w-3xl mx-auto">

      <h1 className="text-3xl font-bold text-[#93197D] mb-8">
        Ajouter un parent 🌸
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

        {/* Nom */}
        <div>
          <label className="block text-sm font-semibold text-[#93197D] mb-1">
            Nom
          </label>
          <input
            type="text"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            required
            className="w-full border border-[#FDC600]/40 rounded-lg px-4 py-2"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-[#93197D] mb-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-[#FDC600]/40 rounded-lg px-4 py-2"
          />
        </div>

        {/* Téléphone */}
        <div>
          <label className="block text-sm font-semibold text-[#93197D] mb-1">
            Téléphone (optionnel)
          </label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border border-[#FDC600]/40 rounded-lg px-4 py-2"
          />
        </div>

        {/* Sélection des enfants */}
        <div>
          <label className="block text-sm font-semibold text-[#93197D] mb-3">
            Associer des enfants
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
            {saving ? "Création…" : "Créer le parent"}
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
