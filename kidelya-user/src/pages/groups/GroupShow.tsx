import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"

interface Child {
  idchild: number
  firstname: string
  avatar?: string | null
}

interface Activity {
  idactivities: number
  title: string
  photourl?: string | null
}

interface Group {
  idgroup: number
  name: string
  children: Child[]
  activities: Activity[]
}

export default function GroupShow() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [group, setGroup] = useState<Group | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/groups/${id}`)
        const json = await res.json()

        if (!json.group) {
          setError("Groupe introuvable.")
          return
        }

        setGroup(json.group)
      } catch (e) {
        console.error("Erreur chargement groupe :", e)
        setError("Impossible de charger ce groupe.")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const handleDelete = async () => {
    if (!confirm("Supprimer ce groupe ?")) return

    try {
      await fetch(`/api/groups/${id}`, { method: "DELETE" })
      navigate("/groups")
    } catch (e) {
      console.error(e)
      alert("Erreur lors de la suppression.")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#6F8D4C]">
        Chargement…
      </div>
    )
  }

  if (error || !group) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#6F8D4C]">
        {error || "Groupe introuvable."}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white px-6 py-10 max-w-5xl mx-auto">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-[#93197D]">
          Groupe : {group.name} 🌸
        </h1>

        <div className="flex gap-3">
          <Link
            to={`/groups/${group.idgroup}/edit`}
            className="px-4 py-2 bg-[#E94E6F] text-white rounded-lg font-semibold hover:bg-[#d63f5f]"
          >
            Modifier
          </Link>

          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-white border border-[#E94E6F] text-[#E94E6F] rounded-lg font-semibold hover:bg-[#FFF5F7]"
          >
            Supprimer
          </button>
        </div>
      </div>

      {/* ENFANTS DU GROUPE */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-[#93197D]">
            Enfants du groupe
          </h2>

          <Link
            to={`/groups/add?group=${group.idgroup}`}
            className="px-4 py-2 bg-[#FDC600] text-[#93197D] rounded-lg font-semibold hover:bg-[#e3b400]"
          >
            Ajouter un enfant
          </Link>
        </div>

        {group.children.length === 0 ? (
          <p className="text-[#6F8D4C]">Aucun enfant dans ce groupe.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {group.children.map((child) => (
              <Link
                key={child.idchild}
                to={`/children/${child.idchild}`}
                className="flex items-center gap-4 bg-white rounded-xl shadow-sm border border-[#FDC600]/40 p-4 hover:bg-[#FFF3E0]"
              >
                {child.avatar ? (
                  <img
                    src={child.avatar}
                    alt={child.firstname}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-[#FFF3E0] flex items-center justify-center text-[#93197D] font-bold text-xl">
                    {child.firstname[0]}
                  </div>
                )}

                <span className="text-[#93197D] font-semibold text-lg">
                  {child.firstname}
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ACTIVITÉS ASSOCIÉES */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-[#93197D]">
            Activités associées
          </h2>

          <Link
            to={`/groups/${group.idgroup}/add-activity`}
            className="px-4 py-2 bg-white border border-[#93197D] text-[#93197D] rounded-lg font-semibold hover:bg-[#FFF3E0]"
          >
            Ajouter une activité
          </Link>
        </div>

        {group.activities.length === 0 ? (
          <p className="text-[#6F8D4C]">Aucune activité associée.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {group.activities.map((a) => (
              <Link
                key={a.idactivities}
                to={`/activites/${a.idactivities}`}
                className="bg-white rounded-xl shadow-sm border border-[#FDC600]/40 p-4 hover:bg-[#FFF3E0]"
              >
                {a.photourl && (
                  <img
                    src={a.photourl}
                    alt={a.title}
                    className="w-full h-40 object-cover rounded-lg mb-3"
                  />
                )}

                <p className="text-[#93197D] font-semibold text-lg">
                  {a.title}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
