import { useEffect, useState } from "react"
import { useNavigate, useParams, Link } from "react-router-dom"
import { getMyActivity } from "../../services/ActivityService"
import type { Activity } from "@/types/Activity"
import { useFavorites } from "@/hooks/useFavorites"

type Tab = "apercu" | "etapes" | "materiel" | "informations" | "competences"

export default function ActivityShow() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [activity, setActivity] = useState<Activity | null>(null)
  const [loading, setLoading] = useState(true)
  const [accessDenied, setAccessDenied] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<Tab>("apercu")
  const { favActivityIds, toggleActivity } = useFavorites()

  useEffect(() => {
    async function load() {
      try {
        const data = await getMyActivity(Number(id))
        if (!data.is_owned && !data.has_subscription) { setAccessDenied(true); return }
        setActivity(data)
      } catch {
        setError("Impossible de charger cette activité.")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) return (
    <div className="flex min-h-[60vh] items-center justify-center text-[#8F6BC8]">Chargement…</div>
  )

  if (accessDenied) return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <h2 className="text-2xl font-black text-[#E94E6F]">Accès refusé</h2>
      <p className="text-gray-400">Vous n'avez pas accès à cette activité.</p>
      <Link to="/packs" className="rounded-xl bg-[#E94E6F] px-6 py-3 text-sm font-bold text-white">Voir les packs</Link>
    </div>
  )

  if (!activity) return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <h2 className="text-2xl font-black text-[#E94E6F]">{error ? "Erreur" : "Introuvable"}</h2>
      <p className="text-gray-400">{error || "Activité introuvable."}</p>
      <Link to="/activities" className="rounded-xl bg-[#E94E6F] px-6 py-3 text-sm font-bold text-white">Retour</Link>
    </div>
  )

  const steps  = (Array.isArray(activity.steps) ? activity.steps : []).map((s) =>
    typeof s === "string" ? { text: s, image: null } : s
  )
  const mats   = Array.isArray(activity.materials) ? activity.materials : []
  const themes = activity.themes      ?? []
  const comps  = activity.competences ?? []

  const diffColor: Record<string, string> = {
    facile:   "bg-green-100 text-green-700",
    moyen:    "bg-yellow-100 text-yellow-700",
    difficile:"bg-red-100 text-red-700",
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: "apercu",        label: "Aperçu" },
    { key: "etapes",        label: "Étapes" },
    { key: "materiel",      label: "Matériel" },
    { key: "informations",  label: "Informations" },
    { key: "competences",   label: "Compétences" },
  ]

  return (
    <div className="min-h-screen bg-white">

      {/* Breadcrumb */}
      <nav className="mb-5 flex items-center gap-2 text-xs text-gray-400">
        <Link to="/dashboard" className="hover:text-[#21164F]">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </Link>
        <span>›</span>
        <Link to="/activities" className="hover:text-[#21164F]">Mes activités</Link>
        <span>›</span>
        <span className="font-semibold text-[#21164F]">{activity.title}</span>
      </nav>

      {/* ── Hero card ── */}
      <div className="mb-6 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-col gap-6 p-5 sm:p-6 lg:flex-row">
          {/* Infos gauche */}
          <div className="flex-1">
            {activity.is_published && (
              <span className="mb-3 inline-block rounded-full bg-green-100 px-3 py-0.5 text-xs font-bold text-green-700">
                Publiée
              </span>
            )}
            <h1 className="text-3xl font-black text-[#21164F]">{activity.title}</h1>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              {activity.agemin != null && activity.agemax != null && (
                <span className="rounded-full bg-[#273068] px-3 py-1 text-xs font-bold text-white">
                  {activity.agemin} - {activity.agemax} ans
                </span>
              )}
              {activity.category && (
                <span className="rounded-full bg-[#FFE7ED] px-3 py-1 text-xs font-bold text-[#E94E6F]">
                  {activity.category}
                </span>
              )}
              {activity.duration && (
                <span className="flex items-center gap-1 text-xs text-gray-400">
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                  </svg>
                  {activity.duration} min
                </span>
              )}
            </div>

            {activity.description && (
              <p className="mt-4 max-w-lg text-sm leading-6 text-gray-500">{activity.description}</p>
            )}

            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                to={`/activities/${activity.idactivities}/edit`}
                className="flex items-center gap-2 rounded-xl bg-[#21164F] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#2f236d]"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Modifier l'activité
              </Link>
              <button
                onClick={(e) => toggleActivity(activity.idactivities, e)}
                className="flex items-center gap-2 rounded-xl border border-[#E94E6F] px-5 py-2.5 text-sm font-semibold text-[#E94E6F] hover:bg-[#FFF5F7] transition-colors"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill={favActivityIds.has(activity.idactivities) ? "#E94E6F" : "none"} stroke="#E94E6F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                {favActivityIds.has(activity.idactivities) ? "En favoris" : "Favoris"}
              </button>
              <button
                onClick={() => navigate(-1)}
                className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-500 hover:bg-gray-50"
              >
                Retour
              </button>
            </div>
          </div>

          {/* Image droite */}
          <div className="hidden w-[340px] shrink-0 overflow-hidden rounded-xl lg:block">
            {activity.photourl ? (
              <img src={activity.photourl} alt={activity.title} className="h-full w-full object-cover" style={{ minHeight: 220 }} />
            ) : (
              <div className="flex h-full min-h-[220px] items-center justify-center bg-gray-100 text-gray-300">
                <svg viewBox="0 0 24 24" className="h-12 w-12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Onglets ── */}
      <div className="mb-6 border-b border-gray-100">
        <div className="flex gap-6">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`pb-3 text-sm font-semibold transition-colors ${
                activeTab === t.key
                  ? "border-b-2 border-[#21164F] text-[#21164F]"
                  : "text-gray-400 hover:text-[#21164F]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Contenu des onglets ── */}

      {/* APERÇU */}
      {activeTab === "apercu" && (
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Colonne gauche : description + étapes */}
          <div className="flex-1 space-y-6">
            {activity.description && (
              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <h2 className="mb-3 font-black text-[#21164F]">Description</h2>
                <p className="text-sm leading-7 text-gray-500">{activity.description}</p>
              </div>
            )}

            {/* Étapes */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h2 className="mb-4 font-black text-[#21164F]">Étapes de l'activité</h2>
              {steps.length === 0 ? (
                <p className="text-sm text-gray-400">Aucune étape renseignée.</p>
              ) : (
                <ol className="space-y-3">
                  {steps.map((step, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#21164F] text-xs font-black text-white">
                        {i + 1}
                      </span>
                      <div className="flex-1">
                        <p className="pt-0.5 text-sm leading-6 text-gray-600">{step.text}</p>
                        {step.image && (
                          <img src={step.image} alt="" className="mt-2 rounded-lg max-h-40 w-auto object-cover" />
                        )}
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </div>

          {/* Sidebar droite : informations + matériel + compétences & thèmes */}
          <div className="w-full shrink-0 space-y-4 lg:w-[260px]">

            {/* Informations */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h3 className="mb-4 font-black text-[#21164F]">Informations</h3>
              <ul className="space-y-3 text-sm">
                {activity.agemin != null && activity.agemax != null && (
                  <li className="flex justify-between">
                    <span className="text-gray-400">Âge</span>
                    <span className="font-semibold text-[#21164F]">{activity.agemin} - {activity.agemax} ans</span>
                  </li>
                )}
                {activity.duration && (
                  <li className="flex justify-between">
                    <span className="text-gray-400">Durée</span>
                    <span className="font-semibold text-[#21164F]">{activity.duration} min</span>
                  </li>
                )}
                {activity.category && (
                  <li className="flex justify-between">
                    <span className="text-gray-400">Catégorie</span>
                    <span className="font-semibold text-[#21164F]">{activity.category}</span>
                  </li>
                )}
                {activity.difficulty && (
                  <li className="flex items-center justify-between">
                    <span className="text-gray-400">Difficulté</span>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold capitalize ${diffColor[activity.difficulty] ?? "bg-gray-100 text-gray-600"}`}>
                      {activity.difficulty}
                    </span>
                  </li>
                )}
                {activity.season && (
                  <li className="flex justify-between">
                    <span className="text-gray-400">Saison</span>
                    <span className="font-semibold text-[#21164F]">{activity.season}</span>
                  </li>
                )}
                {activity.location && (
                  <li className="flex justify-between">
                    <span className="text-gray-400">Lieu</span>
                    <span className="font-semibold text-[#21164F]">{activity.location}</span>
                  </li>
                )}
                {activity.created_at && (
                  <li className="flex justify-between">
                    <span className="text-gray-400">Créée le</span>
                    <span className="font-semibold text-[#21164F]">
                      {new Date(activity.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </li>
                )}
              </ul>
            </div>

            {/* Matériel */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h3 className="mb-3 font-black text-[#21164F]">Matériel nécessaire</h3>
              {mats.length === 0 ? (
                <p className="text-xs text-gray-400">Aucun matériel renseigné.</p>
              ) : (
                <ul className="space-y-2">
                  {mats.map((m, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-gray-600">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#E94E6F]" />
                      {m}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Compétences & Thèmes */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h3 className="mb-3 font-black text-[#21164F]">Compétences</h3>
              {comps.length === 0 ? (
                <p className="mb-4 text-xs text-gray-400">Aucune compétence associée.</p>
              ) : (
                <div className="mb-4 flex flex-wrap gap-2">
                  {comps.map((c) => (
                    <span key={c.idcompetence} className="rounded-full bg-[#EEF0F8] px-3 py-1 text-xs font-semibold text-[#273068]">
                      {c.name}
                    </span>
                  ))}
                </div>
              )}
              <h3 className="mb-3 font-black text-[#21164F]">Thèmes</h3>
              {themes.length === 0 ? (
                <p className="text-xs text-gray-400">Aucun thème associé.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {themes.map((t) => (
                    <span key={t.idtheme} className="rounded-full bg-[#FFF3D9] px-3 py-1 text-xs font-semibold text-[#F5A623]">
                      {t.name}
                    </span>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ÉTAPES */}
      {activeTab === "etapes" && (
        <div className="space-y-4">
          {steps.length === 0 ? (
            <p className="text-gray-400">Aucune étape renseignée.</p>
          ) : (
            steps.map((step, i) => (
              <div key={i} className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#21164F] text-sm font-black text-white">
                  {i + 1}
                </span>
                <div className="flex-1">
                  <p className="text-sm leading-6 text-gray-600">{step.text}</p>
                  {step.image && (
                    <img src={step.image} alt="" className="mt-3 rounded-xl max-h-52 w-auto object-cover" />
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* MATÉRIEL */}
      {activeTab === "materiel" && (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-black text-[#21164F]">Matériel nécessaire</h2>
          {mats.length === 0 ? (
            <p className="text-gray-400">Aucun matériel renseigné.</p>
          ) : (
            <ul className="space-y-2">
              {mats.map((m, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#E94E6F]" />
                  {m}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* INFORMATIONS */}
      {activeTab === "informations" && (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-5 font-black text-[#21164F]">Informations détaillées</h2>
          <dl className="grid gap-4 sm:grid-cols-2">
            {[
              { label: "Titre",        value: activity.title },
              { label: "Catégorie",    value: activity.category },
              { label: "Âge",          value: activity.agemin != null ? `${activity.agemin} - ${activity.agemax} ans` : null },
              { label: "Durée",        value: activity.duration ? `${activity.duration} min` : null },
              { label: "Difficulté",   value: activity.difficulty },
              { label: "Saison",       value: activity.season },
              { label: "Lieu",         value: activity.location },
              { label: "Statut",       value: activity.is_published ? "Publiée" : "Brouillon" },
            ].filter((row) => row.value).map((row) => (
              <div key={row.label} className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
                <dt className="text-xs font-semibold text-gray-400">{row.label}</dt>
                <dd className="text-sm font-bold text-[#21164F]">{row.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {/* COMPÉTENCES */}
      {activeTab === "competences" && (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-black text-[#21164F]">Compétences développées</h2>
          {comps.length === 0 ? (
            <p className="text-gray-400">Aucune compétence associée.</p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {comps.map((c) => (
                <div key={c.idcompetence} className="flex items-center gap-2 rounded-xl bg-[#EEF0F8] px-4 py-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#8F6BC8] text-white">
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 3l1.8 4.5L18 9.3l-4.2 1.7L12 15.5 10.2 11 6 9.3l4.2-1.8L12 3z" />
                    </svg>
                  </span>
                  <span className="text-xs font-semibold text-[#273068]">{c.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  )
}
