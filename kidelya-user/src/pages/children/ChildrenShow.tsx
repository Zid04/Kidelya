import { useEffect, useState, useMemo } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"

interface Child {
  idchild: number
  firstname: string
  birthdate: string
  avatar?: string | null
}

interface Planning {
  idplanning: number
  title: string
  date: string
}

interface Group {
  idgroup: number
  name: string
}

export default function ChildrenShow() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [child, setChild] = useState<Child | null>(null)
  const [plannings, setPlannings] = useState<Planning[]>([])
  const [groups, setGroups] = useState<Group[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 🔥 AGE CALCULÉ AVANT LES RETURN (pas de hook conditionnel)
  const age = useMemo(() => {
    if (!child) return null

    const birth = new Date(child.birthdate).getTime()
    const now = new Date().getTime()

    return Math.floor(
      (now - birth) / (365.25 * 24 * 60 * 60 * 1000)
    )
  }, [child])

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/children/${id}`)
        const json = await res.json()

        setChild(json.child || null)
        setPlannings(json.plannings || [])
        setGroups(json.groups || [])
      } catch (e) {
        console.error("Erreur chargement enfant :", e)
        setError("Impossible de charger cet enfant.")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const handleDelete = async () => {
    if (!confirm("Supprimer cet enfant ?")) return

    try {
      await fetch(`/api/children/${id}`, { method: "DELETE" })
      navigate("/children")
    } catch (e) {
      console.error(e)
      alert("Erreur lors de la suppression.")
    }
  }

  // ⏳ Chargement
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#6F8D4C]">
        Chargement…
      </div>
    )
  }

  // ❌ Erreur ou enfant introuvable
  if (error || !child) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#6F8D4C]">
        {error || "Enfant introuvable."}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FFF9F0] px-6 py-10 max-w-5xl mx-auto">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-[#93197D] flex items-center gap-2">
          {child.firstname} <span className="text-[#FDC600]">🌸</span>
        </h1>

        <div className="flex gap-3">
          <Link
            to={`/children/${child.idchild}/edit`}
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

      {/* INFOS ENFANT */}
      <div className="bg-white rounded-xl shadow-sm border border-[#FDC600]/40 p-6 mb-10 flex items-center gap-6">

        {/* Avatar */}
        {child.avatar ? (
          <img
            src={child.avatar}
            alt={child.firstname}
            className="w-28 h-28 rounded-full object-cover shadow"
          />
        ) : (
          <div className="w-28 h-28 rounded-full bg-[#FFF3E0] flex items-center justify-center text-[#93197D] font-bold text-3xl shadow">
            {child.firstname[0]}
          </div>
        )}

        {/* Infos */}
        <div>
          <p className="text-lg text-[#93197D] font-semibold mb-1">
            {child.firstname}
          </p>

          <p className="text-[#6F8D4C]">
            Âge : <strong>{age !== null ? `${age} ans` : "—"}</strong>
          </p>

          <p className="text-[#6F8D4C]">
            Né(e) le :{" "}
            <strong>
              {new Date(child.birthdate).toLocaleDateString("fr-FR")}
            </strong>
          </p>
        </div>
      </div>

      {/* PLANNINGS */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-[#93197D]">
            Plannings
          </h2>

          <Link
            to={`/plannings/create?child=${child.idchild}`}
            className="px-4 py-2 bg-[#FDC600] text-[#93197D] rounded-lg font-semibold hover:bg-[#e3b400]"
          >
            Créer un planning
          </Link>
        </div>

        {plannings.length === 0 ? (
          <p className="text-[#6F8D4C]">Aucun planning pour cet enfant.</p>
        ) : (
          <div className="space-y-3">
            {plannings.map((p) => (
              <Link
                key={p.idplanning}
                to={`/plannings/${p.idplanning}`}
                className="block bg-white rounded-xl shadow-sm border border-[#FDC600]/40 p-4 hover:bg-[#FFF3E0]"
              >
                <p className="text-[#93197D] font-semibold">{p.title}</p>
                <p className="text-xs text-[#6F8D4C]">
                  {new Date(p.date).toLocaleDateString("fr-FR")}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* GROUPES */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-[#93197D]">
            Groupes
          </h2>

          <Link
            to={`/groups/add?child=${child.idchild}`}
            className="px-4 py-2 bg-white border border-[#93197D] text-[#93197D] rounded-lg font-semibold hover:bg-[#FFF3E0]"
          >
            Ajouter au groupe
          </Link>
        </div>

        {groups.length === 0 ? (
          <p className="text-[#6F8D4C]">Aucun groupe associé.</p>
        ) : (
          <div className="space-y-3">
            {groups.map((g) => (
              <Link
                key={g.idgroup}
                to={`/groups/${g.idgroup}`}
                className="block bg-white rounded-xl shadow-sm border border-[#FDC600]/40 p-4 hover:bg-[#FFF3E0]"
              >
                <p className="text-[#93197D] font-semibold">{g.name}</p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
