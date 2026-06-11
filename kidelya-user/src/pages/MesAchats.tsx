import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import api from "@/api/axios"
import { useAuth } from "@/context/useAuth"
import { mediaUrl, formatPrice } from "@/utils/media"

interface PurchasedActivity {
  idactivities: number
  title: string
  photourl?: string | null
  agemin?: number | null
  agemax?: number | null
  duration?: number | null
  credit_price?: number | null
}

interface PurchasedPack {
  idpack: number
  title: string
  illustration?: string | null
  activities_count: number
  tarification?: number | null
}

interface PurchasesData {
  activities: PurchasedActivity[]
  packs: PurchasedPack[]
  recommended_activities: PurchasedActivity[]
  recommended_packs: PurchasedPack[]
  subscription_all_access?: boolean
}

type Tab = "activites" | "packs" | "abonnement"

function ActivityCard({ a, owned, viaSubscription }: { a: PurchasedActivity; owned: boolean; viaSubscription?: boolean }) {
  const img = mediaUrl(a.photourl)
  return (
    <Link
      to={`/library/${a.idactivities}`}
      className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      {img ? (
        <img src={img} alt={a.title} className="h-40 w-full object-cover" />
      ) : (
        <div className="h-40 bg-gradient-to-br from-[#C5B5E8] to-[#E94E6F]/30" />
      )}
      <div className="p-4">
        <h3 className="font-black text-[#2F236D] mb-1 line-clamp-1">{a.title}</h3>
        <p className="text-xs text-[#6F8D4C]">
          {a.agemin}-{a.agemax} ans · {a.duration} min
        </p>
        {owned ? (
          <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#8F6BC8]">
            ★ {viaSubscription ? "Via abonnement" : "Accès permanent"}
          </span>
        ) : (
          <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#E94E6F]">
            {a.credit_price ? `${a.credit_price} crédits` : "Acheter →"}
          </span>
        )}
      </div>
    </Link>
  )
}

function PackCard({ p, owned, viaSubscription }: { p: PurchasedPack; owned: boolean; viaSubscription?: boolean }) {
  const img = mediaUrl(p.illustration)
  return (
    <Link
      to={`/packs/${p.idpack}`}
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      {img ? (
        <img src={img} alt={p.title} className="h-40 w-full object-cover" />
      ) : (
        <div className="h-40 bg-gradient-to-br from-[#FDC600]/30 to-[#E94E6F]/20" />
      )}
      <div className="p-4">
        <h3 className="font-black text-[#2F236D] mb-1 line-clamp-1">{p.title}</h3>
        <p className="text-xs text-[#6F8D4C]">{p.activities_count} activités incluses</p>
        {owned ? (
          <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#8F6BC8]">
            ★ {viaSubscription ? "Via abonnement" : "Accès permanent"}
          </span>
        ) : (
          <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#E94E6F]">
            {p.tarification ? formatPrice(p.tarification) : "Voir →"}
          </span>
        )}
      </div>
    </Link>
  )
}

export default function MaBibliotheque() {
  const [tab, setTab] = useState<Tab>("activites")
  const [data, setData] = useState<PurchasesData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    api.get("/me/purchases")
      .then(res => setData(res.data.data || res.data))
      .catch(() => setError("Impossible de charger vos achats."))
      .finally(() => setLoading(false))
  }, [])

  const plan              = user?.plan
  const subscription      = user?.subscription
  const endsAt            = subscription?.ends_at
  const startsAt          = subscription?.starts_at
  const allAccess         = data?.subscription_all_access ?? false

  const daysLeft = endsAt
    ? Math.max(0, Math.ceil((new Date(endsAt).getTime() - Date.now()) / 86400000))
    : null

  const totalDays = startsAt && endsAt
    ? Math.ceil((new Date(endsAt).getTime() - new Date(startsAt).getTime()) / 86400000)
    : null

  const progressPct = totalDays && totalDays > 0 && daysLeft !== null
    ? Math.round(((totalDays - daysLeft) / totalDays) * 100)
    : 0

  const tabs: { key: Tab; label: string }[] = [
    { key: "activites",  label: "Activités achetées" },
    { key: "packs",      label: "Packs achetés" },
    { key: "abonnement", label: "Mon abonnement" },
  ]

  return (
    <div className="min-h-screen bg-white px-4 py-8 max-w-6xl mx-auto">

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">{error}</div>
      )}

      {/* En-tête */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-[#2F236D]">Ma bibliothèque d'activités</h1>
        <Link to="/historique" className="text-sm font-semibold text-[#E94E6F] hover:underline">
          Historique d'achat →
        </Link>
      </div>

      {/* Barre d'onglets */}
      <div className="flex gap-1 mb-8 bg-gray-100 rounded-xl p-1">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-all ${
              tab === t.key
                ? "bg-white text-[#2F236D] shadow-sm"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Onglet Activités ── */}
      {tab === "activites" && (
        loading ? (
          <p className="text-center text-[#6F8D4C] py-12">Chargement…</p>
        ) : (
          <>
            {/* Banner accès complet via abonnement */}
            {allAccess && (
              <div className="flex items-center gap-3 bg-[#F5F0FF] border border-[#8F6BC8]/30 rounded-xl px-4 py-3 mb-6">
                <span className="text-[#8F6BC8] text-lg">★</span>
                <p className="text-sm text-[#2F236D]">
                  <span className="font-black">Abonnement {plan?.name}</span> — vous avez accès à toutes les activités publiées.
                </p>
              </div>
            )}

            {!data || data.activities.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-4xl mb-3">📚</p>
                <p className="text-gray-400 mb-4">Aucune activité disponible pour l'instant.</p>
              </div>
            ) : (
              <>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#6F8D4C] mb-3">
                  {allAccess ? `Toutes les activités (${data.activities.length})` : `Mes activités (${data.activities.length})`}
                </p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
                  {data.activities.map(a => (
                    <ActivityCard key={a.idactivities} a={a} owned viaSubscription={allAccess} />
                  ))}
                </div>
              </>
            )}

            {/* Recommandations (uniquement sans abonnement) */}
            {!allAccess && data && data.recommended_activities.length > 0 && (
              <>
                <div className="flex items-center justify-between mb-3 mt-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#93197D]">
                    Recommandées pour vous
                  </p>
                  <Link to="/library" className="text-xs font-semibold text-[#E94E6F] hover:underline">
                    Voir tout →
                  </Link>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {data.recommended_activities.map(a => (
                    <ActivityCard key={a.idactivities} a={a} owned={false} />
                  ))}
                </div>
              </>
            )}
          </>
        )
      )}

      {/* ── Onglet Packs ── */}
      {tab === "packs" && (
        loading ? (
          <p className="text-center text-[#6F8D4C] py-12">Chargement…</p>
        ) : (
          <>
            {/* Banner accès complet via abonnement */}
            {allAccess && (
              <div className="flex items-center gap-3 bg-[#F5F0FF] border border-[#8F6BC8]/30 rounded-xl px-4 py-3 mb-6">
                <span className="text-[#8F6BC8] text-lg">★</span>
                <p className="text-sm text-[#2F236D]">
                  <span className="font-black">Abonnement {plan?.name}</span> — vous avez accès à tous les packs publiés.
                </p>
              </div>
            )}

            {!data || data.packs.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-4xl mb-3">📦</p>
                <p className="text-gray-400 mb-4">Aucun pack disponible pour l'instant.</p>
              </div>
            ) : (
              <>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#6F8D4C] mb-3">
                  {allAccess ? `Tous les packs (${data.packs.length})` : `Mes packs (${data.packs.length})`}
                </p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
                  {data.packs.map(p => (
                    <PackCard key={p.idpack} p={p} owned viaSubscription={allAccess} />
                  ))}
                </div>
              </>
            )}

            {/* Packs recommandés (uniquement sans abonnement) */}
            {!allAccess && data && data.recommended_packs.length > 0 && (
              <>
                <div className="flex items-center justify-between mb-3 mt-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#93197D]">
                    Packs recommandés
                  </p>
                  <Link to="/packs" className="text-xs font-semibold text-[#E94E6F] hover:underline">
                    Voir tout →
                  </Link>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {data.recommended_packs.map(p => (
                    <PackCard key={p.idpack} p={p} owned={false} />
                  ))}
                </div>
              </>
            )}
          </>
        )
      )}

      {/* ── Onglet Abonnement ── */}
      {tab === "abonnement" && (
        plan ? (
          <div className="max-w-md mx-auto">
            <div className="bg-white border border-[#8F6BC8]/30 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <span className="h-12 w-12 flex items-center justify-center rounded-full bg-[#8F6BC8] text-white text-xl font-black">
                  ★
                </span>
                <div>
                  <p className="font-black text-[#2F236D] text-lg">{plan.name}</p>
                  <p className="text-sm text-[#6F8D4C]">
                    {plan.price > 0 ? `${plan.price} € / mois` : "Gratuit"}
                  </p>
                </div>
              </div>

              {endsAt && (
                <>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Expiration</span>
                    <span className="font-semibold text-[#2F236D]">
                      {new Date(endsAt).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm mb-3">
                    <span className="text-gray-400">Jours restants</span>
                    <span className={`font-black ${daysLeft !== null && daysLeft <= 7 ? "text-[#E94E6F]" : "text-[#6DBF67]"}`}>
                      {daysLeft} jour{daysLeft !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 mb-5">
                    <div
                      className="h-2 rounded-full bg-[#8F6BC8] transition-all"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </>
              )}

              {startsAt && (
                <p className="text-xs text-gray-400 mb-5">
                  Abonnement depuis le {new Date(startsAt).toLocaleDateString("fr-FR")}
                </p>
              )}

              <Link
                to="/abonnements"
                className="block w-full py-3 text-center bg-[#8F6BC8] text-white rounded-xl font-semibold text-sm hover:bg-[#7a5bb3] transition-colors"
              >
                Gérer mon abonnement
              </Link>
            </div>
          </div>
        ) : (
          <div className="max-w-md mx-auto text-center py-10">
            <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
              <p className="text-4xl mb-4">🌟</p>
              <h3 className="text-xl font-black text-[#2F236D] mb-2">Plan gratuit</h3>
              <p className="text-sm text-gray-400 mb-6">
                Passez à un abonnement pour accéder à toutes les activités et fonctionnalités avancées.
              </p>
              <Link
                to="/abonnements"
                className="inline-block px-6 py-3 bg-[#E94E6F] text-white rounded-xl font-semibold text-sm hover:bg-[#d63f5f] transition-colors"
              >
                Découvrir les offres
              </Link>
            </div>
          </div>
        )
      )}

    </div>
  )
}
