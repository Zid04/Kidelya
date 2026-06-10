import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import api from "@/api/axios"
import { useAuth } from "@/context/useAuth"

interface Child {
  idchild: number
  firstname: string
  avatar?: string | null
}

export default function PlanningEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const hasSubscription = Boolean(user?.plan)

  const [title,    setTitle]    = useState("")
  const [date,     setDate]     = useState("")
  const [childId,  setChildId]  = useState<number | null>(null)
  const [children, setChildren] = useState<Child[]>([])
  const [loading,  setLoading]  = useState(true)
  const [saving,   setSaving]   = useState(false)
  const [error,    setError]    = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      api.get(`/plannings/${id}`),
      api.get("/children"),
    ])
      .then(([planRes, childRes]) => {
        const p = planRes.data.data ?? planRes.data.planning ?? planRes.data
        setTitle(p.title)
        setDate(p.date)
        setChildId(p.child?.idchild ?? null)
        setChildren(childRes.data.data ?? childRes.data ?? [])
      })
      .catch(() => setError("Impossible de charger ce planning."))
      .finally(() => setLoading(false))
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!hasSubscription) return
    if (!childId) { setError("Veuillez sélectionner un enfant."); return }

    setSaving(true)
    setError(null)
    try {
      await api.put(`/plannings/${id}`, { title, date, idchild: childId })
      navigate(`/plannings/${id}`)
    } catch {
      setError("Impossible de mettre à jour le planning.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-[#6F8D4C]">Chargement…</div>
  if (error && !title) return <div className="min-h-screen flex items-center justify-center text-[#6F8D4C]">{error}</div>

  return (
    <div className="min-h-screen bg-white px-6 py-10 max-w-xl mx-auto">

      <h1 className="text-3xl font-bold text-[#93197D] mb-6">Modifier le planning 🌸</h1>

      {!hasSubscription && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-[#E94E6F]/30 bg-[#FFF5F7] px-5 py-4">
          <span className="mt-0.5 text-[#E94E6F]">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
          </span>
          <div>
            <p className="font-semibold text-[#E94E6F]">Fonctionnalité réservée aux abonnés</p>
            <p className="mt-1 text-sm text-[#6B7280]">Pour modifier des plannings, vous devez changer de plan d'abonnement.</p>
            <Link to="/abonnements" className="mt-3 inline-block rounded-lg bg-[#E94E6F] px-4 py-2 text-sm font-semibold text-white hover:bg-[#d63f5f]">Voir les abonnements</Link>
          </div>
        </div>
      )}

      {error && <div className="mb-4 text-[#E94E6F] font-semibold">{error}</div>}

      <form onSubmit={handleSubmit}
        className={`bg-white rounded-xl shadow-sm border border-[#FDC600]/40 p-6 space-y-6 ${!hasSubscription ? "opacity-50 pointer-events-none select-none" : ""}`}>

        <div>
          <label className="block text-sm font-semibold text-[#93197D] mb-1">Titre du planning</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} required disabled={!hasSubscription}
            className="w-full border border-[#FDC600]/40 rounded-lg px-4 py-2" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#93197D] mb-1">Date</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} required disabled={!hasSubscription}
            className="w-full border border-[#FDC600]/40 rounded-lg px-4 py-2" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#93197D] mb-3">Enfant concerné</label>
          {children.length === 0 ? (
            <p className="text-[#6F8D4C]">Aucun enfant disponible.</p>
          ) : (
            <div className="space-y-3">
              {children.map(child => (
                <label key={child.idchild}
                  className="flex items-center gap-3 bg-[#FFF3E0] p-3 rounded-lg cursor-pointer hover:bg-[#FFE8C2]">
                  <input type="radio" name="child" checked={childId === child.idchild}
                    onChange={() => setChildId(child.idchild)} disabled={!hasSubscription} />
                  {child.avatar ? (
                    <img src={child.avatar} alt={child.firstname} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#93197D] font-bold">{child.firstname[0]}</div>
                  )}
                  <span className="text-[#93197D] font-semibold">{child.firstname}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <button type="submit" disabled={saving || !hasSubscription}
            className="flex-1 px-4 py-3 bg-[#E94E6F] text-white rounded-lg font-semibold hover:bg-[#d63f5f] disabled:opacity-50">
            {saving ? "Enregistrement…" : "Enregistrer"}
          </button>
          <button type="button" onClick={() => navigate(-1)}
            className="flex-1 px-4 py-3 bg-white border border-[#93197D] text-[#93197D] rounded-lg font-semibold hover:bg-[#FFF3E0]">
            Annuler
          </button>
        </div>
      </form>
    </div>
  )
}
