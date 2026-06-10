import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import api from "@/api/axios"

interface Child {
  idchildren: number
  firstname: string
  avatar?: string | null
}

interface Guardian {
  idparent: number
  names: string
  email: string
  phone?: string | null
  address?: string | null
  children: Child[]
}

export default function GuardianShow() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [guardian, setGuardian] = useState<Guardian | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api.get(`/guardians/${id}`)
      .then(res => setGuardian(res.data.data ?? res.data))
      .catch(() => setError("Impossible de charger ce parent."))
      .finally(() => setLoading(false))
  }, [id])

  const handleDelete = async () => {
    if (!confirm("Supprimer ce parent ?")) return
    try {
      await api.delete(`/guardians/${id}`)
      navigate("/guardians")
    } catch {
      alert("Erreur lors de la suppression.")
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-[#6F8D4C]">Chargement…</div>
  if (error || !guardian) return <div className="min-h-screen flex items-center justify-center text-[#6F8D4C]">{error || "Parent introuvable."}</div>

  return (
    <div className="min-h-screen bg-white px-6 py-10 max-w-5xl mx-auto">

      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-[#93197D]">{guardian.names} 🌸</h1>
        <div className="flex gap-3">
          <Link to={`/guardians/${guardian.idparent}/edit`}
            className="px-4 py-2 bg-[#E94E6F] text-white rounded-lg font-semibold hover:bg-[#d63f5f]">
            Modifier
          </Link>
          <button onClick={handleDelete}
            className="px-4 py-2 bg-white border border-[#E94E6F] text-[#E94E6F] rounded-lg font-semibold hover:bg-[#FFF5F7]">
            Supprimer
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[#FDC600]/40 p-6 mb-10">
        <p className="text-lg text-[#93197D] font-semibold mb-2">Informations</p>
        <p className="text-[#6F8D4C]">Email : <strong>{guardian.email}</strong></p>
        {guardian.phone && <p className="text-[#6F8D4C] mt-1">Téléphone : <strong>{guardian.phone}</strong></p>}
        {guardian.address && <p className="text-[#6F8D4C] mt-1">Adresse : <strong>{guardian.address}</strong></p>}
      </div>

      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-[#93197D]">Enfants associés</h2>
          <Link to={`/guardians/${guardian.idparent}/add-child`}
            className="px-4 py-2 bg-[#FDC600] text-[#93197D] rounded-lg font-semibold hover:bg-[#e3b400]">
            Ajouter un enfant
          </Link>
        </div>

        {guardian.children.length === 0 ? (
          <p className="text-[#6F8D4C]">Aucun enfant associé.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {guardian.children.map(child => (
              <Link key={child.idchildren} to={`/children/${child.idchildren}`}
                className="flex items-center gap-4 bg-white rounded-xl shadow-sm border border-[#FDC600]/40 p-4 hover:bg-[#FFF3E0]">
                {child.avatar ? (
                  <img src={child.avatar} alt={child.firstname} className="w-14 h-14 rounded-full object-cover" />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-[#FFF3E0] flex items-center justify-center text-[#93197D] font-bold text-xl">
                    {child.firstname[0]}
                  </div>
                )}
                <span className="text-[#93197D] font-semibold text-lg">{child.firstname}</span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
