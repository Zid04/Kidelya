import { useEffect, useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import api from "@/api/axios"
import { PackArtwork } from "@/components/kidelya/PackArtwork"
import { mediaUrl } from "@/utils/media"
import { createPackCheckout } from "@/services/ActivityService"

type Tab = "apercu" | "etapes" | "materiel" | "informations" | "competences"

interface Activity {
  idactivities: number
  title: string
  description?: string | null
  agemin?: number | null
  agemax?: number | null
  duration?: number | null
  photourl?: string | null
  steps?: string | null
  category?: string | null
  difficulty?: string | null
  season?: string | null
  location?: string | null
  credit_price?: number | null
  created_at?: string
  materials?: string[] | null
  competences?: { idcompetence: number; name: string }[]
  themes?: { idtheme: number; name: string }[]
  packs?: { idpack: number; title: string }[]
  is_owned?: boolean
  has_subscription?: boolean
}

export default function ActivityDetailPack() {
  const { idactivities } = useParams()
  const navigate = useNavigate()
  const [activity, setActivity] = useState<Activity | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<Tab>("apercu")
  const [buying, setBuying] = useState(false)

  useEffect(() => {
    const fetchActivity = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await api.get(`/activities/${idactivities}`)
        setActivity(res.data.data || res.data)
      } catch (e) {
        setError("Impossible de charger cette activité.")
      } finally {
        setLoading(false)
      }
    }
    fetchActivity()
  }, [idactivities])

  async function handleGoToPack() {
    const packId = activity?.packs?.[0]?.idpack
    if (!packId) { navigate("/packs"); return }
    setBuying(true)
    try {
      const url = await createPackCheckout(packId)
      window.location.href = url
    } catch (e) {
      setError("Impossible de lancer le paiement. Veuillez réessayer.")
      setBuying(false)
    }
  }

  if (loading) return (
    <div className="flex min-h-[60vh] items-center justify-center text-[#8F6BC8]">Chargement…</div>
  )

  if (error) return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <h2 className="text-2xl font-black text-[#E94E6F]">Erreur</h2>
      <p className="text-gray-400">{error}</p>
      <Link to="/packs" className="rounded-xl bg-[#E94E6F] px-6 py-3 text-sm font-bold text-white">Retour aux packs</Link>
    </div>
  )

  if (!activity) return (
    <div className="flex min-h-[60vh] items-center justify-center text-gray-400">Activité introuvable.</div>
  )

  const canAccess = activity.is_owned === true || activity.has_subscription === true
  const mats   = Array.isArray(activity.materials) ? activity.materials : []
  const comps  = activity.competences ?? []
  const themes = activity.themes ?? []
  const image  = mediaUrl(activity.photourl)

  const diffColor: Record<string, string> = {
    facile:    "bg-green-100 text-green-700",
    moyen:     "bg-yellow-100 text-yellow-700",
    difficile: "bg-red-100 text-red-700",
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: "apercu",       label: "Aperçu" },
    { key: "etapes",       label: "Étapes" },
    { key: "materiel",     label: "Matériel" },
    { key: "informations", label: "Informations" },
    { key: "competences",  label: "Compétences" },
  ]

  const LockBanner = () => (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-[#E8DDD0] bg-[#F7F3EE] p-10 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#E94E6F]/10">
        <svg viewBox="0 0 24 24" className="h-7 w-7 text-[#E94E6F]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      </div>
      <h3 className="text-lg font-black text-[#21164F]">Contenu réservé</h3>
      <p className="max-w-sm text-sm text-gray-400">
        Achetez ce pack ou abonnez-vous pour accéder aux étapes et au matériel de cette activité.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <button
          onClick={handleGoToPack}
          disabled={buying}
          className="rounded-xl bg-[#E94E6F] px-6 py-3 text-sm font-bold text-white hover:bg-[#d63f5f] disabled:opacity-60"
        >
          {buying ? "Redirection…" : "Acheter le pack"}
        </button>
        <Link
          to="/abonnements"
          className="rounded-xl border border-[#8F6BC8] px-6 py-3 text-sm font-bold text-[#2F236D] hover:bg-[#F5F0FF]"
        >
          Voir les abonnements
        </Link>
      </div>
    </div>
  )

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
        <Link to="/packs" className="hover:text-[#21164F]">Packs</Link>
        <span>›</span>
        <span className="font-semibold text-[#21164F]">{activity.title}</span>
      </nav>

      {/* ── Hero card ── */}
      <div className="mb-6 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-col gap-6 p-5 sm:p-6 lg:flex-row">

          {/* Infos gauche */}
          <div className="flex-1">
            {canAccess ? (
              <span className="mb-3 inline-block rounded-full bg-green-100 px-3 py-0.5 text-xs font-bold text-green-700">
                Débloquée
              </span>
            ) : (
              <span className="mb-3 inline-block rounded-full bg-[#FFE7ED] px-3 py-0.5 text-xs font-bold text-[#E94E6F]">
                Activité du pack
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

            <div className="mt-5 flex gap-3">
              {canAccess ? (
                <span className="flex items-center gap-2 rounded-xl bg-green-50 px-5 py-2.5 text-sm font-bold text-green-700">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  Activité débloquée
                </span>
              ) : (
                <button
                  onClick={handleGoToPack}
                  disabled={buying}
                  className="flex items-center gap-2 rounded-xl bg-[#E94E6F] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#d63f5f] disabled:opacity-60"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  {buying ? "Redirection…" : "Acheter le pack"}
                </button>
              )}
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
            {image ? (
              <img src={image} alt={activity.title} className="h-full w-full object-cover" style={{ minHeight: 220 }} />
            ) : (
              <PackArtwork title={activity.title} className="h-full min-h-[220px]" />
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

      {/* ── APERÇU ── */}
      {activeTab === "apercu" && (
        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="flex-1 space-y-6">
            {activity.description && (
              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <h2 className="mb-3 font-black text-[#21164F]">Description</h2>
                <p className="text-sm leading-7 text-gray-500">{activity.description}</p>
              </div>
            )}

            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h2 className="mb-4 font-black text-[#21164F]">Étapes de l'activité</h2>
              {canAccess ? (
                activity.steps ? (
                  <p className="whitespace-pre-line text-sm leading-7 text-gray-600">{activity.steps}</p>
                ) : (
                  <p className="text-sm text-gray-400">Aucune étape renseignée.</p>
                )
              ) : (
                <LockBanner />
              )}
            </div>
          </div>

          {/* Sidebar droite */}
          <div className="w-full shrink-0 space-y-4 lg:w-[260px]">
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
                {activity.credit_price && (
                  <li className="flex justify-between">
                    <span className="text-gray-400">Prix</span>
                    <span className="font-bold text-[#E94E6F]">{activity.credit_price} €</span>
                  </li>
                )}
              </ul>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h3 className="mb-3 font-black text-[#21164F]">Matériel nécessaire</h3>
              {canAccess ? (
                mats.length === 0 ? (
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
                )
              ) : (
                <p className="flex items-center gap-1.5 text-xs text-gray-400">
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  Disponible après achat
                </p>
              )}
            </div>

            {(comps.length > 0 || themes.length > 0) && (
              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                {comps.length > 0 && (
                  <>
                    <h3 className="mb-3 font-black text-[#21164F]">Compétences</h3>
                    <div className="mb-4 flex flex-wrap gap-2">
                      {comps.map((c) => (
                        <span key={c.idcompetence} className="rounded-full bg-[#EEF0F8] px-3 py-1 text-xs font-semibold text-[#273068]">
                          {c.name}
                        </span>
                      ))}
                    </div>
                  </>
                )}
                {themes.length > 0 && (
                  <>
                    <h3 className="mb-3 font-black text-[#21164F]">Thèmes</h3>
                    <div className="flex flex-wrap gap-2">
                      {themes.map((t) => (
                        <span key={t.idtheme} className="rounded-full bg-[#FFF3D9] px-3 py-1 text-xs font-semibold text-[#F5A623]">
                          {t.name}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── ÉTAPES ── */}
      {activeTab === "etapes" && (
        canAccess ? (
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="mb-4 font-black text-[#21164F]">Étapes de l'activité</h2>
            {activity.steps ? (
              <p className="whitespace-pre-line text-sm leading-7 text-gray-600">{activity.steps}</p>
            ) : (
              <p className="text-gray-400">Aucune étape renseignée.</p>
            )}
          </div>
        ) : <LockBanner />
      )}

      {/* ── MATÉRIEL ── */}
      {activeTab === "materiel" && (
        canAccess ? (
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
        ) : <LockBanner />
      )}

      {/* ── INFORMATIONS ── */}
      {activeTab === "informations" && (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-5 font-black text-[#21164F]">Informations détaillées</h2>
          <dl className="grid gap-4 sm:grid-cols-2">
            {[
              { label: "Titre",      value: activity.title },
              { label: "Catégorie",  value: activity.category },
              { label: "Âge",        value: activity.agemin != null ? `${activity.agemin} - ${activity.agemax} ans` : null },
              { label: "Durée",      value: activity.duration ? `${activity.duration} min` : null },
              { label: "Difficulté", value: activity.difficulty },
              { label: "Saison",     value: activity.season },
              { label: "Lieu",       value: activity.location },
              { label: "Prix",       value: activity.credit_price ? `${activity.credit_price} €` : null },
            ].filter((r) => r.value).map((r) => (
              <div key={r.label} className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
                <dt className="text-xs font-semibold text-gray-400">{r.label}</dt>
                <dd className="text-sm font-bold text-[#21164F]">{r.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {/* ── COMPÉTENCES ── */}
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
