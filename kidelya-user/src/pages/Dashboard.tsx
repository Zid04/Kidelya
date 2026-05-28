import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getUserDashboard } from "@/services/UserService"
import { PackArtwork } from "@/components/kidelya/PackArtwork"
import type {
  DashboardUser,
  DashboardStats,
  DashboardActivity,
  DashboardPack,
} from "@/types/Dashboard"

export default function DashboardUser() {
  const [user, setUser] = useState<DashboardUser | null>(null)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [activities, setActivities] = useState<DashboardActivity[]>([])
  const [recommendedPacks, setRecommendedPacks] = useState<DashboardPack[]>([])

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getUserDashboard()
        setUser(data.user)
        setStats(data.stats)
        setActivities(data.activities)
        setRecommendedPacks(data.recommended_packs)
      } catch (error) {
        console.error("Erreur de chargement du tableau de bord :", error)
      }
    }
    fetchData()
  }, [])

  if (!user || !stats) {
    return (
      <div className="flex min-h-screen items-center justify-center text-[#6F8D4C]">
        Chargement du tableau de bord...
      </div>
    )
  }

  const statsCards = [
    ["Activites creees", stats.activities_created, "/activities"],
    ["Activites favorites", stats.activities_favorites, "/library"],
    ["Activites planifiees", stats.activities_planned, "/calendar"],
    ["Achat de pack", stats.packs_purchased, "/packs"],
  ] as const

  return (
    <div className="min-h-screen bg-[#FFF9F0] text-[#21164F]">
      <section className="mb-7 overflow-hidden rounded-[32px] bg-[#CDB9EA] px-8 py-8 shadow-md">
        <div className="grid gap-6 lg:grid-cols-[1fr,1fr]">
          <div>
            <h1 className="text-4xl font-black text-[#2F236D]">
              Bonjour {user.firstname} !
            </h1>
            <p className="mt-4 max-w-xl leading-7 text-[#21164F]">
              Bienvenue dans votre espace Kidelya. Organisez vos activites et
              gardez de beaux souvenirs avec vos enfants.
            </p>
            <div className="mt-5 inline-flex rounded-xl bg-white/75 px-4 py-2 text-sm font-bold text-[#2F236D]">
              Astuce : debloquez le calendrier avec l'abonnement
            </div>
          </div>
          <div className="relative hidden min-h-[170px] lg:block">
            <div className="absolute bottom-0 left-0 right-0 h-16 rounded-full bg-[#8DBE55]/50" />
            <div className="absolute right-12 top-0 h-20 w-20 rounded-full bg-[#F8B7C4]" />
            <div className="absolute right-36 top-8 h-16 w-16 rounded-full bg-[#FDC600]" />
            <div className="absolute left-24 top-8 h-16 w-28 rounded-full bg-white/85" />
          </div>
        </div>
      </section>

      <section className="mb-7 grid gap-5 md:grid-cols-4">
        {statsCards.map(([title, value, to], index) => (
          <Link
            key={title}
            to={to}
            className="rounded-3xl border border-[#F1D9B5] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className={`mb-4 h-14 w-14 rounded-2xl ${index % 2 === 0 ? "bg-[#8F6BC8]/20" : "bg-[#E94E6F]/15"}`} />
            <p className="text-3xl font-black text-[#2F236D]">{value}</p>
            <p className="mt-1 text-sm font-bold text-[#4F5F45]">{title}</p>
          </Link>
        ))}
      </section>

      <section className="grid gap-7 xl:grid-cols-[1fr,280px]">
        <div className="space-y-7">
          <div className="rounded-3xl border border-[#F1D9B5] bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-black text-[#2F236D]">
                Mes dernieres activites
              </h2>
              <Link to="/activities" className="text-sm font-bold text-[#8F6BC8]">
                Voir toutes mes activites
              </Link>
            </div>

            {activities.length === 0 ? (
              <p className="text-sm text-[#6F8D4C]">
                Vous n'avez pas encore cree d'activites.
              </p>
            ) : (
              <div className="grid gap-5 md:grid-cols-3">
                {activities.slice(0, 3).map((activity) => (
                  <article key={activity.id} className="overflow-hidden rounded-2xl border border-[#F1D9B5]">
                    <PackArtwork title={activity.title} compact className="h-32" />
                    <div className="p-4">
                      <h3 className="font-black text-[#2F236D]">{activity.title}</h3>
                      <p className="mt-2 text-xs text-[#6F8D4C]">
                        {activity.category} · {activity.age_range}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-[#F1D9B5] bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-black text-[#2F236D]">
                Recommande pour vous
              </h2>
              <Link to="/packs" className="text-sm font-bold text-[#8F6BC8]">
                Voir plus d'idees
              </Link>
            </div>

            {recommendedPacks.length === 0 ? (
              <p className="text-sm text-[#6F8D4C]">
                Vous avez deja souscrit a tous les packs disponibles.
              </p>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {recommendedPacks.slice(0, 4).map((pack) => (
                  <Link
                    key={pack.id}
                    to={`/packs/${pack.id}`}
                    className="overflow-hidden rounded-2xl border border-[#F1D9B5]"
                  >
                    <PackArtwork title={pack.name} compact className="h-28" />
                    <div className="p-3">
                      <h3 className="text-sm font-black text-[#2F236D]">{pack.name}</h3>
                      <p className="mt-1 text-xs text-[#6F8D4C]">
                        {pack.theme} · {pack.age_range}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-5">
          <div className="rounded-3xl border border-[#F1D9B5] bg-white p-6 shadow-sm">
            <h3 className="font-black text-[#2F236D]">Bibliotheque d'activites</h3>
            <p className="mt-2 text-sm leading-6 text-[#6F8D4C]">
              Decouvrez des activites pretes a l'emploi classees par age et theme.
            </p>
            <Link to="/library" className="mt-5 inline-flex rounded-xl bg-[#8F6BC8] px-5 py-3 text-sm font-bold text-white">
              Explorer
            </Link>
          </div>
          <div className="rounded-3xl border border-[#F1D9B5] bg-white p-6 shadow-sm">
            <h3 className="font-black text-[#2F236D]">Packs d'activites</h3>
            <p className="mt-2 text-sm leading-6 text-[#6F8D4C]">
              Des themes varies pour toutes les saisons et toutes les envies.
            </p>
            <Link to="/packs" className="mt-5 inline-flex rounded-xl bg-[#E94E6F] px-5 py-3 text-sm font-bold text-white">
              Voir les packs
            </Link>
          </div>
          <div className="rounded-3xl bg-[#8F6BC8] p-6 text-white shadow-md">
            <h3 className="font-black">Passez a un abonnement</h3>
            <p className="mt-2 text-sm leading-6 text-white/85">
              Debloquez l'acces illimite aux packs et au planning.
            </p>
            <Link to="/abonnements" className="mt-5 inline-flex rounded-xl bg-white px-5 py-3 text-sm font-black text-[#2F236D]">
              Decouvrir
            </Link>
          </div>
        </aside>
      </section>
    </div>
  )
}
