import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"

interface Guardian {
  idguardian: number
  firstname: string
  lastname: string
  email: string
  phone?: string | null
}

export default function ChildGuardians() {
  const { id } = useParams()
  const [guardians, setGuardians] = useState<Guardian[]>([])
  const [childName, setChildName] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/children/${id}/guardians`)
        const json = await res.json()

        setGuardians(json.guardians || [])
        setChildName(json.child?.firstname || "")
      } catch (e) {
        console.error(e)
        setError("Impossible de charger les parents.")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#6F8D4C]">
        Chargement…
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#6F8D4C]">
        {error}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FFF9F0] px-6 py-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-[#93197D] mb-6">
        Parents de {childName} 🌸
      </h1>

      {guardians.length === 0 ? (
        <p className="text-[#6F8D4C]">Aucun parent associé.</p>
      ) : (
        <div className="space-y-4">
          {guardians.map((g) => (
            <Link
              key={g.idguardian}
              to={`/guardians/${g.idguardian}`}
              className="block bg-white rounded-xl shadow-sm border border-[#FDC600]/40 p-4 hover:bg-[#FFF3E0]"
            >
              <p className="text-lg font-semibold text-[#93197D]">
                {g.firstname} {g.lastname}
              </p>
              <p className="text-sm text-[#6F8D4C]">{g.email}</p>
              {g.phone && (
                <p className="text-sm text-[#6F8D4C] mt-1">{g.phone}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
