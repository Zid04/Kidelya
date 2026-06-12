import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import api from "@/api/axios"

interface Child {
  idchildren: number
  firstname: string
  birthday: string
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

  const [child,    setChild]    = useState<Child | null>(null)
  const [plannings,setPlannings]= useState<Planning[]>([])
  const [groups,   setGroups]   = useState<Group[]>([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState<string | null>(null)

  const age = useMemo(() => {
    if (!child) return null
    return Math.floor((Date.now() - new Date(child.birthday).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
  }, [child])

  useEffect(() => {
    api.get(`/children/${id}`)
      .then(res => {
        const d = res.data
        setChild(d.data ?? d.child ?? d)
        setPlannings(d.plannings ?? [])
        setGroups(d.groups ?? [])
      })
      .catch(() => setError("Impossible de charger cet enfant."))
      .finally(() => setLoading(false))
  }, [id])

  const handleDelete = async () => {
    if (!confirm("Supprimer cet enfant ?")) return
    try {
      await api.delete(`/children/${id}`)
      navigate("/children")
    } catch {
      alert("Erreur lors de la suppression.")
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-[#6F8D4C]">Chargement…</div>
  if (error || !child) return <div className="min-h-screen flex items-center justify-center text-[#6F8D4C]">{error || "Enfant introuvable."}</div>

  return (
    <div className="min-h-screen bg-white px-6 py-10 max-w-5xl mx-auto">

      <div className="flex items-center gap-3 mb-10">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-[#FDC600]/40 shadow-sm hover:bg-[#FFF3E0] text-[#93197D]"
        >
          ←
        </button>
        <h1 className="text-3xl font-bold text-[#93197D] flex items-center gap-2 flex-1">
          {child.firstname} <span className="text-[#FDC600]">🌸</span>
        </h1>
        <div className="flex gap-3">
          <Link to={`/children/${child.idchildren}/edit`} className="px-4 py-2 bg-[#E94E6F] text-white rounded-lg font-semibold hover:bg-[#d63f5f]">Modifier</Link>
          <button onClick={handleDelete} className="px-4 py-2 bg-white border border-[#E94E6F] text-[#E94E6F] rounded-lg font-semibold hover:bg-[#FFF5F7]">Supprimer</button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[#FDC600]/40 p-6 mb-10 flex items-center gap-6">
        {child.avatar ? (
          <img src={child.avatar} alt={child.firstname} className="w-28 h-28 rounded-full object-cover shadow" />
        ) : (
          <div className="w-28 h-28 rounded-full bg-[#FFF3E0] flex items-center justify-center text-[#93197D] font-bold text-3xl shadow">
            {child.firstname[0]}
          </div>
        )}
        <div>
          <p className="text-lg text-[#93197D] font-semibold mb-1">{child.firstname}</p>
          <p className="text-[#6F8D4C]">Âge : <strong>{age !== null ? `${age} ans` : "—"}</strong></p>
          <p className="text-[#6F8D4C]">Né(e) le : <strong>{new Date(child.birthday).toLocaleDateString("fr-FR")}</strong></p>
          <Link to={`/children/${child.idchildren}/guardians`} className="mt-2 inline-block text-sm font-semibold text-[#E94E6F] hover:underline">
            Voir les parents →
          </Link>
        </div>
      </div>

      <section className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-[#93197D]">Plannings</h2>
          <Link to="/calendar" className="px-4 py-2 bg-[#FDC600] text-[#93197D] rounded-lg font-semibold hover:bg-[#e3b400]">
            Créer un planning
          </Link>
        </div>
        {plannings.length === 0 ? (
          <p className="text-[#6F8D4C]">Aucun planning pour cet enfant.</p>
        ) : (
          <div className="space-y-3">
            {plannings.map(p => (
              <Link key={p.idplanning} to={`/plannings/${p.idplanning}`}
                className="block bg-white rounded-xl shadow-sm border border-[#FDC600]/40 p-4 hover:bg-[#FFF3E0]">
                <p className="text-[#93197D] font-semibold">{p.title}</p>
                <p className="text-xs text-[#6F8D4C]">{new Date(p.date).toLocaleDateString("fr-FR")}</p>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-[#93197D]">Groupes</h2>
        </div>
        {groups.length === 0 ? (
          <p className="text-[#6F8D4C]">Aucun groupe associé.</p>
        ) : (
          <div className="space-y-3">
            {groups.map(g => (
              <Link key={g.idgroup} to={`/groups/${g.idgroup}`}
                className="block bg-white rounded-xl shadow-sm border border-[#FDC600]/40 p-4 hover:bg-[#FFF3E0]">
                <p className="text-[#93197D] font-semibold">{g.name}</p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
