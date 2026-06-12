import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import api from "@/api/axios"
import { useAuth } from "@/context/useAuth"

interface Child {
  idchildren: number
  firstname: string
  birthday: string
  avatar?: string | null
}

const PER_PAGE = 6

const PLAN_INFO: Record<string, { label: string; bg: string; textColor: string; items: { ok: boolean; text: string }[]; cta?: boolean }> = {
  Free: {
    label: "Gratuit",
    bg: "bg-[#FFFEFA]",
    textColor: "text-[#273068]",
    items: [
      { ok: true,  text: "2 enfants maximum" },
      { ok: false, text: "Accès aux packs d'activités" },
      { ok: false, text: "Calendrier et planning" },
      { ok: false, text: "Favoris" },
    ],
    cta: true,
  },
  Monthly: {
    label: "Mensuel",
    bg: "bg-[#D5CDE2]",
    textColor: "text-[#273068]",
    items: [
      { ok: true, text: "10 enfants" },
      { ok: true, text: "Accès aux packs d'activités" },
      { ok: true, text: "Calendrier et planning" },
      { ok: true, text: "Favoris" },
    ],
  },
  Annual: {
    label: "Annuel",
    bg: "bg-[#7C67B2]",
    textColor: "text-white",
    items: [
      { ok: true, text: "Enfants illimités" },
      { ok: true, text: "Accès aux packs d'activités" },
      { ok: true, text: "Calendrier et planning" },
      { ok: true, text: "Favoris et mises à jour" },
    ],
  },
}

function PlanBanner({ plan }: { plan: string }) {
  const info = PLAN_INFO[plan] ?? PLAN_INFO["Free"]
  return (
    <div className={`mb-6 rounded-xl shadow-sm p-5 ${info.bg}`}>
      <p className={`text-sm font-bold mb-3 ${info.textColor}`}>
        Votre plan actuel : <span className="font-extrabold">{info.label}</span>
      </p>
      <ul className="space-y-1.5 text-sm">
        {info.items.map((item) => (
          <li key={item.text} className={`flex items-center gap-2 ${info.textColor} ${!item.ok ? "opacity-50" : ""}`}>
            <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${item.ok ? "bg-[#E94E6F] text-white" : "bg-gray-300 text-white"}`}>
              {item.ok ? "✓" : "✗"}
            </span>
            {item.text}
          </li>
        ))}
      </ul>
      {info.cta && (
        <Link
          to="/abonnements"
          className="mt-4 inline-block rounded-lg bg-[#E94E6F] px-4 py-2 text-sm font-semibold text-white hover:bg-[#d63f5f]"
        >
          Passer à un abonnement →
        </Link>
      )}
    </div>
  )
}

export default function ChildrenIndex() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const planName = user?.plan?.name ?? "Free"

  const [children, setChildren] = useState<Child[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<number | null>(null)
  const [page, setPage] = useState(1)

  useEffect(() => {
    api.get("/children")
      .then(res => setChildren(res.data.data ?? res.data ?? []))
      .catch(() => setError("Impossible de charger les enfants."))
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (idchildren: number, firstname: string) => {
    if (!confirm(`Supprimer ${firstname} ?`)) return
    setDeleting(idchildren)
    try {
      await api.delete(`/children/${idchildren}`)
      setChildren(prev => prev.filter(c => c.idchildren !== idchildren))
      const newTotal = children.length - 1
      const lastPage = Math.max(1, Math.ceil(newTotal / PER_PAGE))
      if (page > lastPage) setPage(lastPage)
    } catch {
      alert("Erreur lors de la suppression.")
    } finally {
      setDeleting(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#273068]">
        Chargement des enfants…
      </div>
    )
  }

  const totalPages = Math.max(1, Math.ceil(children.length / PER_PAGE))
  const paginated = children.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  return (
    <div className="min-h-screen bg-white px-6 py-10 max-w-5xl mx-auto">

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">{error}</div>
      )}

      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-[#FFFEFA] shadow-sm hover:bg-[#D5CDE2] text-[#273068]"
        >
          ←
        </button>
        <h1 className="text-3xl font-bold text-[#7C67B2] flex-1">Mes enfants</h1>
        <Link
          to="/children/create"
          className="px-4 py-2 bg-[#E94E6F] text-white rounded-lg font-semibold hover:bg-[#d63f5f]"
        >
          Ajouter un enfant
        </Link>
      </div>

      <PlanBanner plan={planName} />

      {children.length === 0 ? (
        <p className="text-[#273068]">Aucun enfant enregistré.</p>
      ) : (
        <>
          <div className="grid md:grid-cols-2 gap-6">
            {paginated.map((child) => (
              <div
                key={child.idchildren}
                className="bg-[#FFFEFA] rounded-xl shadow-sm p-5 flex items-center gap-4"
              >
                {child.avatar ? (
                  <img src={child.avatar} alt={child.firstname} className="w-20 h-20 rounded-full object-cover" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-[#D5CDE2] flex items-center justify-center text-[#7C67B2] font-bold text-xl">
                    {child.firstname[0]}
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[#7C67B2]">{child.firstname}</h3>
                  <p className="text-sm text-[#273068]">
                    Né(e) le {new Date(child.birthday).toLocaleDateString("fr-FR")}
                  </p>
                  <div className="mt-3 flex items-center gap-4">
                    <Link to={`/children/${child.idchildren}`} className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#21164F]">
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
                      </svg>
                      Voir
                    </Link>
                    <Link to={`/children/${child.idchildren}/edit`} className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#21164F]">
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                      Modifier
                    </Link>
                    <button
                      onClick={() => handleDelete(child.idchildren, child.firstname)}
                      disabled={deleting === child.idchildren}
                      className="ml-auto text-xs font-semibold text-red-400 hover:text-red-600 disabled:opacity-40"
                    >
                      {deleting === child.idchildren ? "…" : "Supprimer"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 rounded-lg text-sm font-semibold text-[#273068] bg-[#FFFEFA] shadow-sm disabled:opacity-40 hover:bg-[#D5CDE2]"
              >
                ←
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`w-8 h-8 rounded-lg text-sm font-semibold transition-colors ${
                    n === page
                      ? "bg-[#7C67B2] text-white"
                      : "bg-[#FFFEFA] text-[#273068] shadow-sm hover:bg-[#D5CDE2]"
                  }`}
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 rounded-lg text-sm font-semibold text-[#273068] bg-[#FFFEFA] shadow-sm disabled:opacity-40 hover:bg-[#D5CDE2]"
              >
                →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
