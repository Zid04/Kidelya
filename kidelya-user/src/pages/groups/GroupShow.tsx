import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import api from "@/api/axios"

interface Child {
  idchildren: number
  firstname: string
  photourl?: string | null
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
  activities?: Activity[]
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
        const res = await api.get(`/groups/${id}`)

        if (!res.data.data) {
          setError("Groupe introuvable.")
          return
        }

        setGroup(res.data.data)
      } catch (e) {
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
      await api.delete(`/groups/${id}`)
      navigate("/groups")
    } catch (e) {
      alert("Erreur lors de la suppression.")
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-[#273068]">Chargement…</div>
  if (error || !group) return <div className="min-h-screen flex items-center justify-center text-red-500">{error || "Groupe introuvable."}</div>

  return (
    <div className="min-h-screen bg-white px-6 py-10 max-w-5xl mx-auto">

      <div className="flex items-center gap-3 mb-10">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-[#FFFEFA] shadow-sm hover:bg-[#D5CDE2] text-[#273068]"
        >
          ←
        </button>
        <h1 className="text-3xl font-bold text-[#7C67B2] flex-1">{group.name}</h1>
        <div className="flex items-center gap-4">
          <Link to={`/groups/${group.idgroup}/edit`}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#21164F]">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            Modifier
          </Link>
          <button onClick={handleDelete}
            className="flex items-center gap-1.5 text-xs font-semibold text-red-400 hover:text-red-600">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
              <path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
            </svg>
            Supprimer
          </button>
        </div>
      </div>

      <section className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-[#7C67B2]">Enfants du groupe</h2>
          <Link to={`/groups/${group.idgroup}/add-child`}
            className="px-4 py-2 bg-[#E94E6F] text-white rounded-lg font-semibold text-sm hover:bg-[#d63f5f]">
            Ajouter un enfant
          </Link>
        </div>

        {group.children.length === 0 ? (
          <p className="text-[#273068]">Aucun enfant dans ce groupe.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {group.children.map((child) => (
              <Link key={child.idchildren} to={`/children/${child.idchildren}`}
                className="flex items-center gap-4 bg-[#FFFEFA] rounded-xl shadow-sm p-4 hover:bg-[#D5CDE2] transition-colors">
                {child.photourl ? (
                  <img src={child.photourl} alt={child.firstname} className="w-14 h-14 rounded-full object-cover" />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-[#D5CDE2] flex items-center justify-center text-[#7C67B2] font-bold text-xl">
                    {child.firstname[0]}
                  </div>
                )}
                <span className="text-[#273068] font-semibold text-lg">{child.firstname}</span>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-[#7C67B2]">Activités associées</h2>
          <Link to={`/groups/${group.idgroup}/add-activity`}
            className="px-4 py-2 bg-[#E94E6F] text-white rounded-lg font-semibold text-sm hover:bg-[#d63f5f]">
            Ajouter une activité
          </Link>
        </div>

        {(group.activities ?? []).length === 0 ? (
          <p className="text-[#273068]">Aucune activité associée.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {(group.activities ?? []).map((a) => (
              <Link key={a.idactivities} to={`/activites/${a.idactivities}`}
                className="bg-[#FFFEFA] rounded-xl shadow-sm p-4 hover:bg-[#D5CDE2] transition-colors">
                {a.photourl && (
                  <img src={a.photourl} alt={a.title} className="w-full h-40 object-cover rounded-lg mb-3" />
                )}
                <p className="text-[#273068] font-semibold text-lg">{a.title}</p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
