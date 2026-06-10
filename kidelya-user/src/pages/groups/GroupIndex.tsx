import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

interface Group {
  idgroup: number
  name: string
  children_count: number
  activities_count: number
}

export default function GroupsIndex() {
  const [groups, setGroups] = useState<Group[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/groups")
        const json = await res.json()
        setGroups(json.groups || [])
      } catch (e) {
        console.error("Erreur chargement groupes :", e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#6F8D4C]">
        Chargement des groupes…
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white px-6 py-10 max-w-5xl mx-auto">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-[#93197D]">
          Groupes d’enfants 🌸
        </h1>

        <Link
          to="/groups/create"
          className="px-4 py-2 bg-[#E94E6F] text-white rounded-lg font-semibold hover:bg-[#d63f5f]"
        >
          Créer un groupe
        </Link>
      </div>

      {/* LISTE DES GROUPES */}
      {groups.length === 0 ? (
        <p className="text-[#6F8D4C]">Aucun groupe créé pour le moment.</p>
      ) : (
        <div className="space-y-4">
          {groups.map((g) => (
            <div
              key={g.idgroup}
              className="bg-white rounded-xl shadow-sm border border-[#FDC600]/40 p-5 flex justify-between items-center"
            >
              {/* Infos */}
              <div>
                <h3 className="text-lg font-semibold text-[#93197D]">
                  {g.name}
                </h3>

                <p className="text-sm text-[#6F8D4C]">
                  {g.children_count} enfant(s) • {g.activities_count} activité(s)
                </p>
              </div>

              {/* Bouton */}
              <Link
                to={`/groups/${g.idgroup}`}
                className="px-4 py-2 bg-white border border-[#93197D] text-[#93197D] rounded-lg font-semibold hover:bg-[#FFF3E0]"
              >
                Voir →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
