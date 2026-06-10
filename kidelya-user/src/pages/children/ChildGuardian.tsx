import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import api from "@/api/axios"

interface Guardian {
  idparent: number
  names: string
  email: string
  phone?: string | null
}

export default function ChildGuardians() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [guardians,  setGuardians]  = useState<Guardian[]>([])
  const [childName,  setChildName]  = useState("")
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState<string | null>(null)

  useEffect(() => {
    api.get(`/children/${id}/guardians`)
      .then(res => {
        const d = res.data
        setGuardians(d.guardians ?? d.data ?? [])
        setChildName(d.child?.firstname ?? "")
      })
      .catch(() => setError("Impossible de charger les parents."))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center text-[#6F8D4C]">Chargement…</div>
  )
  if (error) return (
    <div className="min-h-screen flex items-center justify-center text-[#6F8D4C]">{error}</div>
  )

  return (
    <div className="min-h-screen bg-[#FAFAFA] px-4 py-10">
      <div className="max-w-3xl mx-auto">

        {/* En-tête */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-[#FDC600]/40 shadow-sm hover:bg-[#FFF3E0] text-[#93197D]">
            ←
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-[#93197D]">
              Parents {childName ? <span>de <span className="text-[#E94E6F]">{childName}</span></span> : ""}
            </h1>
            <p className="text-sm text-[#6F8D4C] mt-0.5">
              {guardians.length} parent{guardians.length !== 1 ? "s" : ""} associé{guardians.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Link to="/guardians/create"
            className="px-4 py-2 bg-[#E94E6F] text-white rounded-xl font-semibold hover:bg-[#d63f5f] text-sm shadow-sm transition-colors">
            + Ajouter
          </Link>
        </div>

        {/* Liste */}
        {guardians.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-[#FDC600]/40 p-12 text-center">
            <p className="text-4xl mb-3">👨‍👩‍👧</p>
            <p className="text-[#93197D] font-semibold mb-1">Aucun parent associé</p>
            <p className="text-sm text-[#6F8D4C] mb-5">Ajoutez un parent ou tuteur pour cet enfant.</p>
            <Link to="/guardians/create"
              className="inline-block px-5 py-2.5 bg-[#E94E6F] text-white rounded-xl font-semibold hover:bg-[#d63f5f] text-sm transition-colors">
              Enregistrer un parent
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {guardians.map(g => (
              <Link key={g.idparent} to={`/guardians/${g.idparent}`}
                className="flex items-center gap-4 bg-white rounded-2xl shadow-sm border border-[#FDC600]/40 p-4 hover:bg-[#FFF3E0] transition-colors group">

                <div className="w-12 h-12 rounded-full bg-[#93197D]/10 flex items-center justify-center text-[#93197D] font-bold text-xl flex-shrink-0">
                  {g.names[0]?.toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#93197D] truncate">{g.names}</p>
                  <p className="text-sm text-[#6F8D4C] truncate">{g.email}</p>
                  {g.phone && <p className="text-xs text-[#6F8D4C] mt-0.5">{g.phone}</p>}
                </div>

                <span className="text-[#E94E6F] text-lg group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
