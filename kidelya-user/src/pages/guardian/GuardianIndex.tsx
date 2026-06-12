import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import api from "@/api/axios"

interface Guardian {
  idparent: number
  names: string
  email: string
  phone?: string | null
}

export default function GuardiansIndex() {
  const navigate = useNavigate()
  const [guardians, setGuardians] = useState<Guardian[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api.get("/guardians")
      .then(res => setGuardians(res.data.data ?? []))
      .catch(() => setError("Impossible de charger les parents."))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#6F8D4C]">
        Chargement des parents…
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white px-6 py-10 max-w-5xl mx-auto">

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">{error}</div>
      )}

      <div className="flex items-center gap-3 mb-10">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-[#FFFEFA] shadow-sm hover:bg-[#D5CDE2] text-[#273068]"
        >
          ←
        </button>
        <h1 className="text-3xl font-bold text-[#7C67B2] flex-1">Parents / Guardians</h1>
        <Link to="/guardians/create" className="px-4 py-2 bg-[#E94E6F] text-white rounded-lg font-semibold hover:bg-[#d63f5f]">
          Ajouter un parent
        </Link>
      </div>

      {guardians.length === 0 ? (
        <p className="text-[#273068]">Aucun parent enregistré.</p>
      ) : (
        <div className="space-y-4">
          {guardians.map((g) => (
            <div key={g.idparent} className="bg-[#FFFEFA] rounded-xl shadow-sm p-5 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-[#7C67B2]">{g.names}</h3>
                <p className="text-sm text-[#273068]">{g.email}</p>
                {g.phone && <p className="text-sm text-[#273068] mt-1">{g.phone}</p>}
              </div>
              <Link to={`/guardians/${g.idparent}`} className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#21164F]">
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
                </svg>
                Voir
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
