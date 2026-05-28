import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

interface Guardian {
  idguardian: number
  firstname: string
  lastname: string
  email: string
  phone?: string | null
  children_count: number
}

export default function GuardiansIndex() {
  const [guardians, setGuardians] = useState<Guardian[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/guardians")
        const json = await res.json()
        setGuardians(json.guardians || [])
      } catch (e) {
        console.error("Erreur chargement parents :", e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#6F8D4C]">
        Chargement des parents…
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FFF9F0] px-6 py-10 max-w-5xl mx-auto">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-[#93197D]">
          Parents / Guardians 🌸
        </h1>

        <Link
          to="/guardians/create"
          className="px-4 py-2 bg-[#E94E6F] text-white rounded-lg font-semibold hover:bg-[#d63f5f]"
        >
          Ajouter un parent
        </Link>
      </div>

      {/* LISTE DES PARENTS */}
      {guardians.length === 0 ? (
        <p className="text-[#6F8D4C]">Aucun parent enregistré.</p>
      ) : (
        <div className="space-y-4">
          {guardians.map((g) => (
            <div
              key={g.idguardian}
              className="bg-white rounded-xl shadow-sm border border-[#FDC600]/40 p-5 flex justify-between items-center"
            >
              {/* Infos */}
              <div>
                <h3 className="text-lg font-semibold text-[#93197D]">
                  {g.firstname} {g.lastname}
                </h3>

                <p className="text-sm text-[#6F8D4C]">{g.email}</p>

                <p className="text-sm text-[#6F8D4C] mt-1">
                  {g.children_count} enfant(s)
                </p>
              </div>

              {/* Bouton */}
              <Link
                to={`/guardians/${g.idguardian}`}
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
