import { useEffect, useState, useMemo } from "react"
import { Link } from "react-router-dom"
import { getLibraryActivities } from "@/services/ActivityService"
import type { Activity } from "@/types/Activity"

export default function BibliothequeIndex() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [themeFilter, setThemeFilter] = useState("all")
  const [competenceFilter, setCompetenceFilter] = useState("all")
  const [ageFilter, setAgeFilter] = useState("all")
  const [seasonFilter, setSeasonFilter] = useState("all")
  const [locationFilter, setLocationFilter] = useState("all")

  useEffect(() => {
    async function load() {
      try {
        const data = await getLibraryActivities()
        setActivities(data)
      } catch (err) {
        console.error("Erreur chargement bibliothèque :", err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // Catégories dynamiques
  const categories = useMemo(() => {
    const set = new Set<string>()
    activities.forEach((a) => a.category && set.add(a.category))
    return Array.from(set)
  }, [activities])

  // Thèmes dynamiques
  const themes = useMemo(() => {
    const set = new Set<string>()
    activities.forEach((a) =>
      a.themes?.forEach((t) => set.add(t.name))
    )
    return Array.from(set)
  }, [activities])

  // Compétences dynamiques
  const competences = useMemo(() => {
    const set = new Set<string>()
    activities.forEach((a) =>
      a.competences?.forEach((c) => set.add(c.name))
    )
    return Array.from(set)
  }, [activities])

  // Âges dynamiques
  const ageRanges = useMemo(() => {
    const set = new Set<string>()
    activities.forEach((a) => {
      if (a.agemin != null && a.agemax != null) {
        set.add(`${a.agemin}-${a.agemax} ans`)
      }
    })
    return Array.from(set)
  }, [activities])

  // Saisons dynamiques
  const seasons = useMemo(() => {
    const set = new Set<string>()
    activities.forEach((a) => a.season && set.add(a.season))
    return Array.from(set)
  }, [activities])

  // Lieux dynamiques
  const locations = useMemo(() => {
    const set = new Set<string>()
    activities.forEach((a) => a.location && set.add(a.location))
    return Array.from(set)
  }, [activities])

  // Filtrage final
  const filtered = activities.filter((a) => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase())
    const matchCategory = categoryFilter === "all" || a.category === categoryFilter
    const matchTheme =
      themeFilter === "all" ||
      a.themes?.some((t) => t.name === themeFilter)
    const matchCompetence =
      competenceFilter === "all" ||
      a.competences?.some((c) => c.name === competenceFilter)
    const matchAge =
      ageFilter === "all" ||
      `${a.agemin}-${a.agemax} ans` === ageFilter
    const matchSeason = seasonFilter === "all" || a.season === seasonFilter
    const matchLocation = locationFilter === "all" || a.location === locationFilter

    return (
      matchSearch &&
      matchCategory &&
      matchTheme &&
      matchCompetence &&
      matchAge &&
      matchSeason &&
      matchLocation
    )
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-[#6F8D4C]">
        Chargement de la boutique...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FFF9F0] px-6 py-10 max-w-7xl mx-auto">

      {/* HERO */}
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold text-[#93197D] mb-4">
          Découvrez des activités éducatives pour vos enfants 🌸
        </h1>
        <p className="text-[#6F8D4C] max-w-2xl mx-auto mb-6">
          Achetez des activités à l’unité, explorez nos packs thématiques ou débloquez tout avec l’abonnement.
        </p>

        <div className="flex justify-center gap-4">
          <Link
            to="/packs"
            className="px-6 py-3 bg-[#FDC600] text-[#93197D] rounded-lg font-semibold"
          >
            Voir les packs
          </Link>

          <Link
            to="/abonnement"
            className="px-6 py-3 bg-[#E94E6F] text-white rounded-lg font-semibold"
          >
            S’abonner
          </Link>
        </div>
      </section>

      {/* FILTRES */}
      <div className="grid md:grid-cols-6 gap-4 mb-10">
        <input
          type="text"
          placeholder="Rechercher..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-[#FDC600]/40 rounded-lg px-4 py-2"
        />

        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
          className="border border-[#FDC600]/40 rounded-lg px-3 py-2">
          <option value="all">Catégories</option>
          {categories.map((c) => <option key={c}>{c}</option>)}
        </select>

        <select value={themeFilter} onChange={(e) => setThemeFilter(e.target.value)}
          className="border border-[#FDC600]/40 rounded-lg px-3 py-2">
          <option value="all">Thèmes</option>
          {themes.map((t) => <option key={t}>{t}</option>)}
        </select>

        <select value={competenceFilter} onChange={(e) => setCompetenceFilter(e.target.value)}
          className="border border-[#FDC600]/40 rounded-lg px-3 py-2">
          <option value="all">Compétences</option>
          {competences.map((c) => <option key={c}>{c}</option>)}
        </select>

        <select value={ageFilter} onChange={(e) => setAgeFilter(e.target.value)}
          className="border border-[#FDC600]/40 rounded-lg px-3 py-2">
          <option value="all">Âges</option>
          {ageRanges.map((r) => <option key={r}>{r}</option>)}
        </select>

        <select value={seasonFilter} onChange={(e) => setSeasonFilter(e.target.value)}
          className="border border-[#FDC600]/40 rounded-lg px-3 py-2">
          <option value="all">Saisons</option>
          {seasons.map((s) => <option key={s}>{s}</option>)}
        </select>

        <select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)}
          className="border border-[#FDC600]/40 rounded-lg px-3 py-2">
          <option value="all">Lieux</option>
          {locations.map((l) => <option key={l}>{l}</option>)}
        </select>
      </div>

      {/* GRILLE D’ACTIVITÉS */}
      {filtered.length === 0 ? (
        <p className="text-[#6F8D4C]">Aucune activité trouvée.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {filtered.map((a) => (
            <div
              key={a.idactivities}
              className="bg-white rounded-xl shadow-sm border border-[#FDC600]/40 p-4 hover:shadow-md transition"
            >
              {a.photourl && (
                <img
                  src={a.photourl}
                  alt={a.title}
                  className="rounded-lg mb-3 w-full h-40 object-cover"
                />
              )}

              <h3 className="text-[#93197D] font-semibold text-lg mb-1">
                {a.title}
              </h3>

              <p className="text-xs text-[#6F8D4C] mb-3">
                {a.agemin}-{a.agemax} ans • {a.duration} min • {a.category}
              </p>

              {/* PRIX / PACK / ABONNEMENT */}
              {a.included_in_subscription ? (
                <p className="text-[#4C8D4C] font-semibold mb-2">
                  Inclus dans votre abonnement
                </p>
              ) : a.credit_price ? (
                <p className="text-[#E94E6F] font-semibold mb-2">
                  {a.credit_price} crédits
                </p>
              ) : a.included_in_packs && a.included_in_packs.length > 0 ? (
                <p className="text-[#93197D] font-semibold mb-2">
                  Inclus dans : {a.included_in_packs[0].name}
                </p>
              ) : null}

              <div className="flex justify-between items-center mt-4 text-sm">
                <Link
                  to={`/activites/${a.idactivities}`}
                  className="text-[#93197D] font-semibold hover:underline"
                >
                  Voir
                </Link>

                {a.credit_price && (
                  <button className="text-[#E94E6F] font-semibold hover:underline">
                    Acheter
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PACKS RECOMMANDÉS */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold text-[#93197D] mb-4">
          Packs recommandés 🎁
        </h2>
        <Link to="/packs" className="text-[#E94E6F] font-semibold">
          Voir tous les packs →
        </Link>
      </section>

      {/* ABONNEMENT */}
      <section className="mt-16 text-center bg-[#FFF3E0] p-10 rounded-xl border border-[#FDC600]/40">
        <h2 className="text-3xl font-bold text-[#93197D] mb-4">
          Accédez à tout avec l’abonnement
        </h2>
        <p className="text-[#6F8D4C] max-w-xl mx-auto mb-6">
          Des centaines d’activités, des packs exclusifs, et des nouveautés chaque semaine.
        </p>
        <Link
          to="/abonnement"
          className="px-6 py-3 bg-[#E94E6F] text-white rounded-lg font-semibold"
        >
          S’abonner maintenant
        </Link>
      </section>

    </div>
  )
}
