import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

interface SubscriptionInfo {
  type: "free" | "monthly" | "annual"
}

export default function ChildrenCreate() {
  const navigate = useNavigate()

  const [firstname, setFirstname] = useState("")
  const [birthdate, setBirthdate] = useState("")
  const [avatar, setAvatar] = useState<File | null>(null)

  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null)
  const [childrenCount, setChildrenCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/me/children")
        const json = await res.json()
        setChildrenCount(json.children?.length || 0)

        const subRes = await fetch("/api/me/subscription")
        const subJson = await subRes.json()
        setSubscription(subJson.subscription || { type: "free" })
      } catch (e) {
        console.error("Erreur chargement :", e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#6F8D4C]">
        Chargement…
      </div>
    )
  }

  // 🔒 Limites selon abonnement
  const limit =
    subscription?.type === "free"
      ? 1
      : subscription?.type === "monthly"
      ? 5
      : Infinity

  const canAdd = childrenCount < limit

  if (!canAdd) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
        <h2 className="text-2xl font-bold text-[#E94E6F] mb-4">
          Limite atteinte
        </h2>

        {subscription?.type === "free" && (
          <p className="text-[#6F8D4C] mb-6">
            Votre abonnement <strong>Free</strong> permet d’ajouter 1 enfant maximum.
          </p>
        )}

        {subscription?.type === "monthly" && (
          <p className="text-[#6F8D4C] mb-6">
            Votre abonnement <strong>Mensuel</strong> permet d’ajouter 5 enfants maximum.
          </p>
        )}

        <p className="text-[#6F8D4C] mb-6">
          Passez à un abonnement supérieur pour ajouter plus d’enfants.
        </p>

        <button
          onClick={() => navigate("/abonnements")}
          className="px-6 py-3 bg-[#E94E6F] text-white rounded-lg font-semibold"
        >
          Voir les abonnements
        </button>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("firstname", firstname)
      formData.append("birthdate", birthdate)
      if (avatar) formData.append("avatar", avatar)

      const res = await fetch("/api/children", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        throw new Error("Erreur lors de l’enregistrement.")
      }

      navigate("/children")
    } catch (e) {
      console.error(e)
      setError("Impossible d’enregistrer l’enfant.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FFF9F0] px-6 py-10 max-w-xl mx-auto">

      <h1 className="text-3xl font-bold text-[#93197D] mb-8">
        Ajouter un enfant 🌸
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
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setAvatar(e.target.files?.[0] || null)}
            className="w-full"
          />
        </div>

        {/* Bouton */}
        <button
          type="submit"
          disabled={saving}
          className="w-full px-4 py-3 bg-[#E94E6F] text-white rounded-lg font-semibold hover:bg-[#d63f5f] disabled:opacity-50"
        >
          {saving ? "Enregistrement…" : "Ajouter l’enfant"}
        </button>
      </form>
    </div>
  )
}
