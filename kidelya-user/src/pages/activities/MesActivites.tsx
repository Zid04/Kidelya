import { useEffect, useState, useMemo } from "react"
import { Link } from "react-router-dom"
import { getMyActivities, deleteActivity, createActivity } from "@/services/ActivityService"
import { useAuth } from "@/context/useAuth"
import type { Activity } from "@/types/Activity"
import mesActivitesImg from "@/assets/mesactivites.png"
import { useFavorites } from "@/hooks/useFavorites"

const PAGE_SIZE = 6

export default function MesActivites() {
  const { user } = useAuth()
  const { favActivityIds, toggleActivity } = useFavorites()
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [duplicating, setDuplicating] = useState<number | null>(null)
  const [dupError, setDupError] = useState<string | null>(null)

  // Filtres
  const [ageFilter,      setAgeFilter]      = useState("all")
  const [themeFilter,    setThemeFilter]    = useState("all")
  const [saisonFilter,   setSaisonFilter]   = useState("all")
  const [typeFilter,     setTypeFilter]     = useState("all")

  useEffect(() => {
    getMyActivities()
      .then((data) => {
        const valid = data.filter(
          (a) => a && typeof a === "object" && "idactivities" in a && typeof a.idactivities === "number"
        )
        setActivities(valid)
      })
      .catch(() => setError("Impossible de charger les activités."))
      .finally(() => setLoading(false))
  }, [])

  // Options de filtres dynamiques
  const ageOptions = useMemo(() => {
    const set = new Set<string>()
    activities.forEach((a) => { if (a.agemin != null && a.agemax != null) set.add(`${a.agemin}-${a.agemax} ans`) })
    return Array.from(set)
  }, [activities])

  const themeOptions = useMemo(() => {
    const set = new Set<string>()
    activities.forEach((a) => a.themes?.forEach((t) => set.add(t.name)))
    return Array.from(set)
  }, [activities])

  const saisonOptions = useMemo(() => {
    const set = new Set<string>()
    activities.forEach((a) => { if (a.season) set.add(a.season) })
    return Array.from(set)
  }, [activities])

  const typeOptions = useMemo(() => {
    const set = new Set<string>()
    activities.forEach((a) => { if (a.category) set.add(a.category) })
    return Array.from(set)
  }, [activities])

  // Filtrage
  const filtered = useMemo(() => activities.filter((a) => {
    if (ageFilter !== "all" && `${a.agemin}-${a.agemax} ans` !== ageFilter) return false
    if (themeFilter !== "all" && !a.themes?.some((t) => t.name === themeFilter)) return false
    if (saisonFilter !== "all" && a.season !== saisonFilter) return false
    if (typeFilter !== "all" && a.category !== typeFilter) return false
    return true
  }), [activities, ageFilter, themeFilter, saisonFilter, typeFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const resetPage = () => setPage(1)

  async function handleDelete(id: number) {
    if (!confirm("Supprimer cette activité ?")) return
    await deleteActivity(id)
    setActivities((prev) => prev.filter((a) => a.idactivities !== id))
  }

  async function handleDuplicate(a: Activity) {
    setDuplicating(a.idactivities)
    setDupError(null)
    try {
      const data = new FormData()
      data.append("title", `${a.title} (copie)`)
      if (a.description) data.append("description", a.description)
      if (a.agemin != null)    data.append("agemin",    String(a.agemin))
      if (a.agemax != null)    data.append("agemax",    String(a.agemax))
      if (a.duration != null)  data.append("duration",  String(a.duration))
      if (a.season)    data.append("season",    a.season)
      if (a.location)  data.append("location",  a.location)
      if (a.category)  data.append("category",  a.category)
      if (a.difficulty) data.append("difficulty", a.difficulty)
      if (a.credit_price != null) data.append("credit_price", String(a.credit_price))
      data.append("is_purchasable", a.is_purchasable ? "1" : "0")
      data.append("is_published",   "0")

      // Étapes — références aux images existantes via image_url (pas de re-upload)
      const steps = Array.isArray(a.steps) ? a.steps : []
      steps.forEach((step, i) => {
        const s = typeof step === "string" ? { text: step, image: null } : step
        if (s.text?.trim()) {
          data.append(`steps[${i}][text]`, s.text.trim())
          if (s.image) data.append(`steps[${i}][image_url]`, s.image)
        }
      })

      // Matériaux
      const mats = Array.isArray(a.materials) ? a.materials : []
      mats.forEach((m) => data.append("materials[]", m))

      const res = await createActivity(data)
      const newActivity = res.data ?? res
      if (newActivity?.idactivities) {
        setActivities((prev) => [newActivity, ...prev])
      }
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } }
      const msg = axiosErr.response?.data?.message
        ?? Object.values(axiosErr.response?.data?.errors ?? {}).flat()[0]
        ?? "Erreur lors de la duplication."
      setDupError(msg)
    } finally {
      setDuplicating(null)
    }
  }

  const getPageNumbers = () => {
    const pages: (number | "...")[] = []
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      if (page > 3) pages.push("...")
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i)
      if (page < totalPages - 2) pages.push("...")
      pages.push(totalPages)
    }
    return pages
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-[#8F6BC8]">
        Chargement des activités…
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">

      {/* ── Hero ── */}
      <div className="mb-8 flex items-center justify-between gap-6 rounded-2xl bg-white py-6 pl-2 pr-0">
        <div className="flex-1">
          <h1 className="text-3xl font-black text-[#21164F]">Mes activités,</h1>
          <p className="mt-2 max-w-md text-sm leading-6 text-gray-400">
            Retrouvez ici toutes les activités que vous avez créées.<br />
            Modifiez, dupliquez ou supprimez les à tout moment.
          </p>
          <Link
            to="/activities/create"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#21164F] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#2f236d]"
          >
            <span className="text-lg leading-none">+</span> Créer une activité
          </Link>
        </div>
        <img
          src={mesActivitesImg}
          alt="Mes activités"
          className="h-36 w-auto shrink-0 object-contain"
        />
      </div>

      {/* ── Filtres ── */}
      <div className="mb-6 flex flex-wrap items-center justify-center gap-3 border-b border-gray-100 pb-5">
        {[
          { label: "Âge",             value: ageFilter,    onChange: (v: string) => { setAgeFilter(v);    resetPage() }, options: ageOptions },
          { label: "Thème",           value: themeFilter,  onChange: (v: string) => { setThemeFilter(v);  resetPage() }, options: themeOptions },
          { label: "Saison",          value: saisonFilter, onChange: (v: string) => { setSaisonFilter(v); resetPage() }, options: saisonOptions },
          { label: "Type d'activité", value: typeFilter,   onChange: (v: string) => { setTypeFilter(v);   resetPage() }, options: typeOptions },
        ].map((f) => (
          <div key={f.label} className="relative">
            <select
              value={f.value}
              onChange={(e) => f.onChange(e.target.value)}
              className="appearance-none rounded-xl border border-gray-200 bg-white py-2 pl-4 pr-8 text-sm text-[#21164F] focus:outline-none focus:ring-2 focus:ring-[#8F6BC8]/30"
            >
              <option value="all">{f.label}</option>
              {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
            <svg className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
        ))}
      </div>

      {/* ── Grille ── */}
      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">{error}</div>
      )}

      {dupError && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {dupError}
          <button onClick={() => setDupError(null)} className="ml-auto text-red-400 hover:text-red-600">✕</button>
        </div>
      )}

      {paginated.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-20 text-center">
          <p className="text-gray-400">Aucune activité trouvée.</p>
          <Link to="/activities/create" className="rounded-xl bg-[#21164F] px-5 py-2.5 text-sm font-bold text-white">
            Créer une activité
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-5">
          {paginated.map((a) => (
            <article key={a.idactivities} className="overflow-hidden rounded-2xl bg-[#FFFEFA] shadow-sm">
              {/* Image */}
              {a.photourl ? (
                <img src={a.photourl} alt={a.title} className="h-44 w-full object-cover" />
              ) : (
                <div className="h-44 w-full bg-gray-100" />
              )}

              {/* Contenu */}
              <div className="p-4">
                <h3 className="font-black text-[#21164F]">{a.title ?? "Sans titre"}</h3>

                <div className="mt-2 flex flex-wrap gap-1.5">
                  {a.agemin != null && a.agemax != null && (
                    <span className="rounded-full bg-[#F1B9C3] px-2.5 py-0.5 text-[10px] font-bold text-[#E94E6F]">
                      {a.agemin} - {a.agemax} ans
                    </span>
                  )}
                  {a.category && (
                    <span className="rounded-full bg-[#CDC1DC] px-2.5 py-0.5 text-[10px] font-bold text-[#273068]">
                      {a.category}
                    </span>
                  )}
                </div>

                {a.duration && (
                  <p className="mt-2 text-xs text-gray-400">{a.duration} min</p>
                )}

                <div className="my-3 border-t border-gray-100" />

                <div className="flex items-center gap-4">
                  <Link
                    to={`/activities/${a.idactivities}`}
                    className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#21164F]"
                  >
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
                    </svg>
                    Voir
                  </Link>
                  <Link
                    to={`/activities/${a.idactivities}/edit`}
                    className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#21164F]"
                  >
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    Modifier
                  </Link>
                  <button
                    onClick={() => handleDuplicate(a)}
                    disabled={duplicating === a.idactivities}
                    className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#21164F] disabled:opacity-50"
                  >
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" />
                      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                    </svg>
                    {duplicating === a.idactivities ? "…" : "Dupliquer"}
                  </button>
                  <button
                    onClick={(e) => toggleActivity(a.idactivities, e)}
                    className="flex items-center gap-1 text-xs font-semibold text-[#E94E6F] hover:opacity-70"
                    title={favActivityIds.has(a.idactivities) ? "Retirer des favoris" : "Favoris"}
                  >
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill={favActivityIds.has(a.idactivities) ? "#E94E6F" : "none"} stroke="#E94E6F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(a.idactivities)}
                    className="ml-auto text-xs font-semibold text-red-400 hover:text-red-600"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:border-[#21164F] hover:text-[#21164F] disabled:opacity-30"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          {getPageNumbers().map((p, i) =>
            p === "..." ? (
              <span key={`dots-${i}`} className="px-1 text-gray-300">…</span>
            ) : (
              <button
                key={p}
                onClick={() => setPage(p as number)}
                className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition ${
                  page === p
                    ? "bg-[#21164F] text-white"
                    : "border border-gray-200 text-gray-500 hover:border-[#21164F] hover:text-[#21164F]"
                }`}
              >
                {p}
              </button>
            )
          )}

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:border-[#21164F] hover:text-[#21164F] disabled:opacity-30"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}
