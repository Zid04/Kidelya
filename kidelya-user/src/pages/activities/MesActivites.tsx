import { useEffect, useState, useMemo } from "react"
import { Link } from "react-router-dom"
import { getMyActivities, deleteActivity } from "@/services/ActivityService"
import type { Activity } from "@/types/Activity"

export default function MesActivites() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [ageFilter, setAgeFilter] = useState("all")

  useEffect(() => {
    async function load() {
      try {
        const data = await getMyActivities()
        setActivities(data)
      } catch (err) {
        console.error("Erreur chargement activités :", err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  async function handleDelete(id: number) {
    if (!confirm("Supprimer cette activité ?")) return
    await deleteActivity(id)
    setActivities((prev) => prev.filter((a) => a.idactivities !== id))
  }

  // Catégories dynamiques
  const categories = useMemo(() => {
    const set = new Set<string>()
    activities.forEach((a) => {
      if (a.category) set.add(a.category)
    })
    return Array.from(set)
  }, [activities])

  //Intervalles d’âge dynamiques
  const ageRanges = useMemo(() => {
    const set = new Set<string>()
    activities.forEach((a) => {
      if (a.agemin != null && a.agemax != null) {
        set.add(`${a.agemin}-${a.agemax} ans`)
      }
    })
    return Array.from(set)
  }, [activities])

  // Filtrage 
  const filtered = activities.filter((a) => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase())

    const matchCategory =
      categoryFilter === "all" || a.category === categoryFilter

    const matchAge =
      ageFilter === "all" ||
      `${a.agemin}-${a.agemax} ans` === ageFilter

    return matchSearch && matchCategory && matchAge
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-[#6F8D4C]">
        Chargement des activités...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FFF9F0] px-6 py-10 max-w-6xl mx-auto">
      {/* HEADER */}
      <div className="flex justify-between items-start mb-10">
        <div>
          <h1 className="text-3xl font-bold text-[#93197D] mb-2 flex items-center gap-2">
            Mes activités <span className="text-[#FDC600]">🌸</span>
          </h1>
          <p className="text-[#6F8D4C] max-w-lg">
            Retrouvez ici toutes les activités que vous avez créées.
          </p>
        </div>

        <div className="bg-[#FFF3E0] rounded-xl p-5 text-center shadow-sm border border-[#FDC600]/40">
          <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-white border border-[#FDC600]/40 flex items-center justify-center text-3xl">
            ✨
          </div>
          <h3 className="text-[#93197D] font-semibold mb-1">
            Créer une nouvelle activité
          </h3>
          <p className="text-sm text-[#6F8D4C] mb-3">
            Laissez libre cours à votre créativité.
          </p>
          <Link
            to="/activites/creer"
            className="px-4 py-2 bg-[#E94E6F] text-white rounded-lg font-semibold hover:bg-[#d63f5f]"
          >
            + Créer une activité
          </Link>
        </div>
      </div>

      {/* BARRE DE FILTRES */}
      <div className="flex flex-wrap gap-4 items-center mb-8">
        <input
          type="text"
          placeholder="Rechercher une activité..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-[#FDC600]/40 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FDC600]"
        />

        {/* Catégories dynamiques */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border border-[#FDC600]/40 rounded-lg px-3 py-2 text-[#6F8D4C]"
        >
          <option value="all">Toutes les catégories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {/* Âges dynamiques */}
        <select
          value={ageFilter}
          onChange={(e) => setAgeFilter(e.target.value)}
          className="border border-[#FDC600]/40 rounded-lg px-3 py-2 text-[#6F8D4C]"
        >
          <option value="all">Tous les âges</option>
          {ageRanges.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
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
                {a.agemin ?? "?"}–{a.agemax ?? "?"} ans •{" "}
                {a.category ?? "Sans catégorie"} •{" "}
                {a.duration ? `${a.duration} min` : "Durée inconnue"}
              </p>

             <div className="flex justify-between items-center mt-4 text-sm">
  <Link
    to={`/activites/${a.idactivities}`}
    className="text-[#6F8D4C] font-semibold hover:underline"
  >
    Voir
  </Link>

  <Link
    to={`/activites/${a.idactivities}/edit`}
    className="text-[#93197D] font-semibold hover:underline"
  >
    Modifier
  </Link>

  <button
    onClick={() => handleDelete(a.idactivities)}
    className="text-red-600 font-semibold hover:underline"
  >
    Supprimer
  </button>
</div>

            </div>
          ))}
        </div>
      )}
    </div>
  )
}
