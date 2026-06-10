import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import api from "@/api/axios"

interface Guardian {
  idparent: number
  names: string
  email: string
  phone?: string | null
}

export default function GuardiansIndex() {
  const [guardians, setGuardians] = useState<Guardian[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get("/guardians")
      .then(res => setGuardians(res.data.data ?? []))
      .catch(console.error)
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

      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-[#93197D]">Parents / Guardians 🌸</h1>
        <Link to="/guardians/create" className="px-4 py-2 bg-[#E94E6F] text-white rounded-lg font-semibold hover:bg-[#d63f5f]">
          Ajouter un parent
        </Link>
      </div>

      {guardians.length === 0 ? (
        <p className="text-[#6F8D4C]">Aucun parent enregistré.</p>
      ) : (
        <div className="space-y-4">
          {guardians.map((g) => (
            <div key={g.idparent} className="bg-white rounded-xl shadow-sm border border-[#FDC600]/40 p-5 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-[#93197D]">{g.names}</h3>
                <p className="text-sm text-[#6F8D4C]">{g.email}</p>
                {g.phone && <p className="text-sm text-[#6F8D4C] mt-1">{g.phone}</p>}
              </div>
              <Link to={`/guardians/${g.idparent}`} className="px-4 py-2 bg-white border border-[#93197D] text-[#93197D] rounded-lg font-semibold hover:bg-[#FFF3E0]">
                Voir →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
