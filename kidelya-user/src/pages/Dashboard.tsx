import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getUserDashboard } from "@/services/UserService"
import { useAuth } from "@/context/useAuth"
import type {
  DashboardUser,
  DashboardStats,
  DashboardActivity,
  DashboardPack,
} from "@/types/Dashboard"

import tableauDeBord from "@/assets/tableaudebord.png"
import fleur1TB from "@/assets/fleur1TB.png"
import fleur2TB from "@/assets/fleur2TB.png"
import fleur3TB from "@/assets/fleur3TB.png"
import calendariconTB from "@/assets/calendariconTB.png"

function IconActivitesCrees() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" /><path d="M9 7h6M9 11h6M9 15h4" />
    </svg>
  )
}
function IconActivitesFaites() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
    </svg>
  )
}
function IconActivitesPlanifiees() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  )
}
function IconAchatPack() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61H19a2 2 0 001.99-1.74L22 6H6" />
    </svg>
  )
}

export default function DashboardUser() {
  const [user, setUser] = useState<DashboardUser | null>(null)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [activities, setActivities] = useState<DashboardActivity[]>([])
  const [recommendedPacks, setRecommendedPacks] = useState<DashboardPack[]>([])
  const [error, setError] = useState<string | null>(null)
  const { user: authUser } = useAuth()

  const plan         = authUser?.plan
  const subscription = authUser?.subscription
  const endsAt       = subscription?.ends_at
  const startsAt     = subscription?.starts_at
  const daysLeft     = endsAt
    ? Math.max(0, Math.ceil((new Date(endsAt).getTime() - Date.now()) / 86400000))
    : null
  const totalDays    = startsAt && endsAt
    ? Math.ceil((new Date(endsAt).getTime() - new Date(startsAt).getTime()) / 86400000)
    : null
  const progressPct  = totalDays && totalDays > 0 && daysLeft !== null
    ? Math.round(((totalDays - daysLeft) / totalDays) * 100)
    : 0

  useEffect(() => {
    getUserDashboard()
      .then((data) => {
        setUser(data.user)
        setStats(data.stats)
        setActivities(data.activities)
        setRecommendedPacks(data.recommended_packs)
      })
      .catch(() => setError("Impossible de charger le tableau de bord."))
  }, [])

  if (!user || !stats) {
    return (
      <div className="flex min-h-screen items-center justify-center text-center px-6">
        {error ? (
          <div>
            <p className="text-lg font-bold text-[#E94E6F]">Erreur</p>
            <p className="mt-1 text-sm text-gray-400">{error}</p>
          </div>
        ) : (
          <p className="text-[#8F6BC8]">Chargement…</p>
        )}
      </div>
    )
  }

  const statsCards = [
    { label: "Activités créées",     value: stats.activities_created,   icon: <IconActivitesCrees />,       bg: "bg-[#D5CDE2]", link: "/activities" },
    { label: "Activités faites",     value: stats.activities_favorites,  icon: <IconActivitesFaites />,      bg: "bg-[#E94E6F]", link: "/activities" },
    { label: "Activités planifiées", value: stats.activities_planned,    icon: <IconActivitesPlanifiees />,  bg: "bg-[#6F8D4C]", link: "/calendar" },
    { label: "Achat de pack",        value: stats.packs_purchased,       icon: <IconAchatPack />,            bg: "bg-[#F5A623]", link: "/packs" },
  ]

  const sidebarItems = [
    { title: "Boutique",                 titleColor: "text-[#21164F]", desc: "Activités prêtes à l'emploi classées par âge et par thème.", link: "/library",     btn: "Explorer",          btnColor: "bg-[#8F6BC8] text-white", img: fleur1TB,       bg: "bg-[#FFFEFA] border border-gray-100" },
    { title: "Packs d'activités",        titleColor: "text-[#6F8D4C]", desc: "Des thèmes variés pour toutes les saisons et toutes les envies.", link: "/packs",   btn: "Voir les packs",    btnColor: "bg-[#6F8D4C] text-white", img: fleur2TB,       bg: "bg-[#FFFEFA] border border-gray-100" },
    { title: "Planifiez vos activités",  titleColor: "text-[#E94E6F]", desc: "Organisez vos activités dans un calendrier dédié.", link: "/calendar",              btn: "Voir le calendrier", btnColor: "bg-[#E94E6F] text-white", img: calendariconTB, bg: "bg-[#FFFEFA] border border-gray-100" },
    { title: "Passez à un abonnement",   titleColor: "text-white",     desc: "Débloquez l'accès illimité aux packs et au planning.", link: "/abonnements",        btn: "Découvrir les offres", btnColor: "bg-white text-[#8F6BC8]", img: fleur3TB, bg: "bg-[#8F6BC8]" },
  ]

  return (
    // overflow-x-hidden sur le wrapper global pour éviter tout débordement
    <div className="min-h-screen overflow-x-hidden bg-white text-[#21164F]">

      {/* ── Hero — image couvre tout le div ── */}
      <section className="relative mb-5 overflow-hidden rounded-2xl" style={{ minHeight: "140px" }}>
        <img
          src={tableauDeBord}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#C5B5E8] via-[#C5B5E8]/70 to-transparent" />
        <div className="absolute inset-0" style={{ backgroundColor: "rgba(0,0,0,var(--app-dark-overlay,0))" }} />
        <div className="relative z-10 px-5 py-7 sm:px-8 sm:py-10">
          <h1 className="text-xl font-black text-[#2F236D] sm:text-3xl">
            Bonjour {user.firstname},
          </h1>
          <p className="mt-1 text-xs leading-5 text-[#3D2D7A] sm:mt-2 sm:text-sm sm:leading-6">
            Bienvenue dans votre espace Kidelya.
          </p>
        </div>
      </section>

      {/* ── Layout principal ── */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">

        {/* ── Contenu principal ── */}
        <div className="w-full min-w-0 flex-1 space-y-6">

          {/* Stats — 2×2 mobile, 4×1 desktop */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
            {statsCards.map((s) => (
              <Link
                key={s.label}
                to={s.link}
                className="flex flex-col items-center gap-2 rounded-2xl border border-gray-100 bg-[#FFFEFA] p-3 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:flex-row sm:p-4 sm:text-left"
              >
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${s.bg}`}>
                  {s.icon}
                </span>
                <div>
                  <p className="text-lg font-black text-[#2F236D]">{s.value}</p>
                  <p className="text-[10px] font-medium leading-tight text-[#6F7894]">{s.label}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Mini-card abonnement */}
          <div className={`flex items-center gap-4 rounded-2xl p-4 ${plan ? "bg-[#FFFEFA] border border-[#8F6BC8]/20" : "bg-[#FFFEFA] border border-gray-100"}`}>
            <span className={`h-10 w-10 flex shrink-0 items-center justify-center rounded-full text-white text-sm font-black ${plan ? "bg-[#8F6BC8]" : "bg-gray-300"}`}>
              {plan ? "★" : "○"}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-black text-[#2F236D]">{plan ? plan.name : "Plan gratuit"}</p>
              {plan && daysLeft !== null ? (
                <>
                  <p className="text-xs text-[#7C67B2]">{daysLeft} jour{daysLeft !== 1 ? "s" : ""} restant{daysLeft !== 1 ? "s" : ""}</p>
                  <div className="mt-1.5 h-1.5 bg-[#8F6BC8]/20 rounded-full">
                    <div className="h-1.5 bg-[#8F6BC8] rounded-full transition-all" style={{ width: `${progressPct}%` }} />
                  </div>
                </>
              ) : (
                <p className="text-xs text-gray-400">Accédez à toutes les fonctionnalités</p>
              )}
            </div>
            <Link
              to="/abonnements"
              className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${plan ? "bg-[#8F6BC8] text-white hover:bg-[#7a5bb3]" : "bg-[#E94E6F] text-white hover:bg-[#d63f5f]"}`}
            >
              {plan ? "Gérer" : "Upgrade"}
            </Link>
          </div>

          {/* Dernières activités */}
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-black text-[#9076B6] sm:text-lg">Dernières activités</h2>
              <Link to="/activities" className="text-xs font-semibold text-[#21164F] hover:text-[#8F6BC8]">
                Voir toutes →
              </Link>
            </div>
            {activities.length === 0 ? (
              <p className="text-sm text-gray-400">Aucune activité créée pour l'instant.</p>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {activities.slice(0, 3).map((a) => (
                  <article key={a.idactivities} className="overflow-hidden rounded-2xl border border-gray-100 bg-[#FFFEFA] shadow-sm">
                    <div className="h-28 bg-gray-100" />
                    <div className="p-3">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-black text-[#21164F]">{a.title}</h3>
                        <span className="shrink-0 text-xs text-gray-400">{a.age_range}</span>
                      </div>
                      <p className="mt-1 text-xs text-gray-400 line-clamp-2">{a.category}</p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          {/* Recommandé pour vous */}
          <section>
            <h2 className="mb-3 text-base font-black text-[#9076B6] sm:text-lg">Recommandé pour vous</h2>
            {recommendedPacks.length === 0 ? (
              <p className="text-sm text-gray-400">Aucun pack disponible.</p>
            ) : (
              <div className="flex items-center gap-3">
                <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {recommendedPacks.slice(0, 3).map((p) => (
                    <Link
                      key={p.idpack}
                      to={`/packs/${p.idpack}`}
                      className="overflow-hidden rounded-2xl border border-gray-100 bg-[#FFFEFA] shadow-sm transition hover:-translate-y-0.5"
                    >
                      <div className="h-24 bg-gray-100" />
                      <div className="p-3">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-sm font-black text-[#21164F]">{p.title}</h3>
                          <span className="shrink-0 text-xs text-gray-400">{p.age_range}</span>
                        </div>
                        <p className="mt-1 text-xs text-gray-400">{p.theme}</p>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link to="/packs" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-[#FFFEFA] shadow-sm hover:bg-[#FFFEFA]">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 text-[#21164F]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </Link>
              </div>
            )}
          </section>

          {/* Accès rapide */}
          <section>
            <h2 className="mb-3 text-base font-black text-[var(--app-text)] sm:text-lg">Accès rapide</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Link to="/activities/create" className="flex items-start gap-3 rounded-2xl bg-[#D5CDE2] border border-[var(--app-border)] p-4 transition hover:opacity-90">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-lg font-black text-[#273068]">+</span>
                <div>
                  <p className="text-sm font-black text-[#273068]">Créer une activité</p>
                  <p className="text-xs text-[#273068]">Créez votre propre activité</p>
                </div>
              </Link>
              <Link to="/library" className="flex items-start gap-3 rounded-2xl bg-[#F0F7D1] border border-[var(--app-border)] p-4 transition hover:opacity-90">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#6F8D4C] text-white">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
                  </svg>
                </span>
                <div>
                  <p className="text-sm font-black text-[#6F8D4C]">Explorer la bibliothèque</p>
                  <p className="text-xs text-[#6F8D4C]">Découvrez de nouvelles activités</p>
                </div>
              </Link>
              <Link to="/packs" className="flex items-start gap-3 rounded-2xl bg-[#FFEDEB] border border-[var(--app-border)] p-4 transition hover:opacity-90">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E94E6F] text-white">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                </span>
                <div>
                  <p className="text-sm font-black text-[#E94E6F]">Voir les packs</p>
                  <p className="text-xs text-[var(--app-muted)]">Découvrez nos packs d'activités</p>
                </div>
              </Link>
            </div>
          </section>

          {/* Sidebar cards — mobile uniquement, en grille 2×2 (pas de scroll horizontal) */}
          <section className="lg:hidden">
            <h2 className="mb-3 text-base font-black text-[#21164F]">Nos services</h2>
            <div className="grid grid-cols-2 gap-3">
              {sidebarItems.map((c) => (
                <div key={c.title} className={`relative overflow-hidden rounded-xl p-3 shadow-sm ${c.bg}`}>
                  <h3 className={`text-xs font-black ${c.titleColor}`}>{c.title}</h3>
                  <p className={`mt-1 text-[10px] leading-4 ${c.titleColor === "text-white" ? "text-white/70" : "text-gray-400"}`}>{c.desc}</p>
                  <Link to={c.link} className={`mt-2 inline-flex rounded-lg px-2 py-1 text-[10px] font-bold ${c.btnColor}`}>
                    {c.btn}
                  </Link>
                  <img src={c.img} alt="" aria-hidden className="absolute bottom-0 right-0 h-10 w-auto object-contain" />
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* ── Sidebar droite — desktop uniquement ── */}
        <aside className="hidden lg:sticky lg:top-6 lg:block lg:w-[220px] lg:shrink-0 lg:space-y-3">
          {sidebarItems.map((c) => (
            <div key={c.title} className={`relative overflow-hidden rounded-xl p-3 shadow-sm ${c.bg}`}>
              <h3 className={`text-xs font-black ${c.titleColor}`}>{c.title}</h3>
              <p className={`mt-1 text-[10px] leading-4 ${c.titleColor === "text-white" ? "text-white/70" : "text-gray-400"}`}>{c.desc}</p>
              <Link to={c.link} className={`mt-2 inline-flex rounded-lg px-3 py-1.5 text-[10px] font-bold ${c.btnColor}`}>
                {c.btn}
              </Link>
              <img src={c.img} alt="" aria-hidden className="absolute bottom-0 right-0 h-14 w-auto object-contain" />
            </div>
          ))}
        </aside>

      </div>

    </div>
  )
}