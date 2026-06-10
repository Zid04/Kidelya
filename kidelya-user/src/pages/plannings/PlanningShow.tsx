import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import api from "@/api/axios"

interface Child {
  idchildren: number
  firstname: string
  lastname: string
}

interface Report {
  idreport: number
  comments: string | null
  positive: string | null
  difficulties: string | null
  improvements: string | null
}

interface PlanningData {
  idplanning: number
  title: string
  description: string | null
  location: string | null
  date: string
  start_time: string | null
  end_time: string | null
  children: Child[]
  report: Report | null
}

export default function PlanningShow() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [planning,    setPlanning]    = useState<PlanningData | null>(null)
  const [loading,     setLoading]     = useState(true)
  const [error,       setError]       = useState<string | null>(null)

  // report form state
  const [comments,     setComments]     = useState("")
  const [positive,     setPositive]     = useState("")
  const [difficulties, setDifficulties] = useState("")
  const [improvements, setImprovements] = useState("")
  const [savingReport, setSavingReport] = useState(false)
  const [reportSuccess,setReportSuccess]= useState(false)

  useEffect(() => {
    api.get(`/plannings/${id}`)
      .then(res => {
        const d: PlanningData = res.data.data ?? res.data
        setPlanning(d)
        if (d.report) {
          setComments(d.report.comments ?? "")
          setPositive(d.report.positive ?? "")
          setDifficulties(d.report.difficulties ?? "")
          setImprovements(d.report.improvements ?? "")
        }
      })
      .catch(() => setError("Impossible de charger ce planning."))
      .finally(() => setLoading(false))
  }, [id])

  async function handleDelete() {
    if (!confirm("Supprimer ce planning ?")) return
    try {
      await api.delete(`/plannings/${id}`)
      navigate("/plannings")
    } catch {
      alert("Erreur lors de la suppression.")
    }
  }

  async function handleSaveReport(e: React.FormEvent) {
    e.preventDefault()
    setSavingReport(true)
    try {
      const res = await api.post(`/plannings/${id}/report`, {
        comments, positive, difficulties, improvements
      })
      setPlanning(prev => prev ? { ...prev, report: res.data.data.report } : prev)
      setReportSuccess(true)
      setTimeout(() => setReportSuccess(false), 3000)
    } catch {
      alert("Erreur lors de l'enregistrement du rapport.")
    } finally {
      setSavingReport(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center text-[#6F8D4C]">Chargement…</div>
  )
  if (error || !planning) return (
    <div className="min-h-screen flex items-center justify-center text-red-500">{error || "Planning introuvable."}</div>
  )

  const planningDate = new Date(planning.date)
  const isPast = planningDate < new Date(new Date().toDateString())

  function fmtTime(t: string | null) {
    if (!t) return null
    return t.slice(0, 5)
  }

  function fmtDate(d: string) {
    return new Date(d).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
  }

  return (
    <div className="min-h-screen bg-white px-6 py-10 max-w-3xl mx-auto">

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => navigate("/plannings")}
          className="p-2 rounded-lg text-[#93197D] border border-[#93197D]/30 hover:bg-[#FFF3E0]"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
        <h1 className="text-2xl font-bold text-[#93197D] flex-1">{planning.title}</h1>
        <div className="flex gap-2">
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-white border border-[#E94E6F] text-[#E94E6F] rounded-lg font-semibold text-sm hover:bg-[#FFF5F7]"
          >
            Supprimer
          </button>
        </div>
      </div>

      {/* Info card */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#FDC600]/40 p-6 mb-6 space-y-4">

        <div className="flex items-start gap-3">
          <span className="text-2xl">📅</span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#93197D]">Date</p>
            <p className="text-[#374151] font-medium capitalize">{fmtDate(planning.date)}</p>
          </div>
        </div>

        {(planning.start_time || planning.end_time) && (
          <div className="flex items-start gap-3">
            <span className="text-2xl">🕐</span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#93197D]">Horaire</p>
              <p className="text-[#374151] font-medium">
                {fmtTime(planning.start_time)}
                {planning.end_time && ` → ${fmtTime(planning.end_time)}`}
              </p>
            </div>
          </div>
        )}

        {planning.location && (
          <div className="flex items-start gap-3">
            <span className="text-2xl">📍</span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#93197D]">Lieu</p>
              <p className="text-[#374151] font-medium">{planning.location}</p>
            </div>
          </div>
        )}

        {planning.description && (
          <div className="flex items-start gap-3">
            <span className="text-2xl">📝</span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#93197D]">Description</p>
              <p className="text-[#374151]">{planning.description}</p>
            </div>
          </div>
        )}

        {planning.children.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#93197D] mb-2">Enfants concernés</p>
            <div className="flex flex-wrap gap-2">
              {planning.children.map(child => (
                <Link
                  key={child.idchildren}
                  to={`/children/${child.idchildren}`}
                  className="flex items-center gap-2 bg-[#FFF3E0] hover:bg-[#FFE8C2] px-3 py-2 rounded-xl transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-[#93197D] flex items-center justify-center text-white font-bold text-sm">
                    {child.firstname[0].toUpperCase()}
                  </div>
                  <span className="text-[#93197D] font-semibold text-sm">
                    {child.firstname} {child.lastname}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {planning.children.length === 0 && (
          <p className="text-sm text-gray-400 italic">Aucun enfant associé à ce planning.</p>
        )}
      </div>

      {/* Compte-rendu section — only for past plannings */}
      {isPast && (
        <div className="bg-white rounded-2xl shadow-sm border border-[#6F8D4C]/30 p-6">

          <h2 className="text-lg font-bold text-[#6F8D4C] mb-1">Compte-rendu d'activité</h2>
          <p className="text-sm text-gray-500 mb-5">
            {planning.report ? "Modifiez votre rapport ci-dessous." : "Cette activité est passée. Rédigez votre rapport."}
          </p>

          {reportSuccess && (
            <div className="mb-4 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm font-semibold text-green-700">
              ✓ Rapport enregistré avec succès !
            </div>
          )}

          <form onSubmit={handleSaveReport} className="space-y-4">

            <div>
              <label className="block text-sm font-semibold text-[#6F8D4C] mb-1">Commentaires généraux</label>
              <textarea
                value={comments}
                onChange={e => setComments(e.target.value)}
                rows={3}
                placeholder="Comment s'est déroulée l'activité ?"
                className="w-full border border-[#6F8D4C]/30 rounded-xl px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-[#6F8D4C]/40"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#6F8D4C] mb-1">Points positifs</label>
              <textarea
                value={positive}
                onChange={e => setPositive(e.target.value)}
                rows={2}
                placeholder="Ce qui s'est bien passé…"
                className="w-full border border-[#6F8D4C]/30 rounded-xl px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-[#6F8D4C]/40"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#6F8D4C] mb-1">Difficultés rencontrées</label>
              <textarea
                value={difficulties}
                onChange={e => setDifficulties(e.target.value)}
                rows={2}
                placeholder="Ce qui a été difficile…"
                className="w-full border border-[#6F8D4C]/30 rounded-xl px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-[#6F8D4C]/40"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#6F8D4C] mb-1">Améliorations possibles</label>
              <textarea
                value={improvements}
                onChange={e => setImprovements(e.target.value)}
                rows={2}
                placeholder="Ce qu'on pourrait améliorer…"
                className="w-full border border-[#6F8D4C]/30 rounded-xl px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-[#6F8D4C]/40"
              />
            </div>

            <button
              type="submit"
              disabled={savingReport}
              className="w-full py-3 bg-[#6F8D4C] text-white rounded-xl font-semibold hover:bg-[#5a7a3c] disabled:opacity-50 transition-colors"
            >
              {savingReport ? "Enregistrement…" : planning.report ? "Mettre à jour le rapport" : "Enregistrer le rapport"}
            </button>
          </form>
        </div>
      )}

      {!isPast && (
        <div className="rounded-xl bg-[#FFF3E0] border border-[#FDC600]/40 px-5 py-4 text-sm text-[#93197D]">
          Le compte-rendu sera disponible une fois l'activité passée.
        </div>
      )}
    </div>
  )
}
