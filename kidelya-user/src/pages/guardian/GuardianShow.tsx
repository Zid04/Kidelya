import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"

interface Child {
  idchild: number
  firstname: string
  avatar?: string | null
}

interface Planning {
  idplanning: number
  title: string
  date: string
  child: Child
}

interface Guardian {
  idguardian: number
  firstname: string
  lastname: string
  email: string
  phone?: string | null
  children: Child[]
  plannings: Planning[]
}

export default function GuardianShow() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [guardian, setGuardian] = useState<Guardian | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/guardians/${id}`)
        const json = await res.json()

        if (!json.guardian) {
          setError("Parent introuvable.")
          return
        }

        setGuardian(json.guardian)
      } catch (e) {
        console.error("Erreur chargement parent :", e)
        setError("Impossible de charger ce parent.")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const handleDelete = async () => {
    if (!confirm("Supprimer ce parent ?")) return

    try {
      await fetch(`/api/guardians/${id}`, { method: "DELETE" })
      navigate("/guardians")
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

  if (error || !guardian) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#6F8D4C]">
        {error || "Parent introuvable."}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FFF9F0] px-6 py-10 max-w-5xl mx-auto">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-[#93197D]">
          {guardian.firstname} {guardian.lastname} 🌸
        </h1>

        <div className="flex gap-3">
          <Link
            to={`/guardians/${guardian.idguardian}/edit`}
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

      {/* INFOS PARENT */}
      <div className="bg-white rounded-xl shadow-sm border border-[#FDC600]/40 p-6 mb-10">
        <p className="text-lg text-[#93197D] font-semibold mb-2">
          Informations du parent
        </p>

        <p className="text-[#6F8D4C]">
          Email : <strong>{guardian.email}</strong>
        </p>

        {guardian.phone && (
          <p className="text-[#6F8D4C] mt-1">
            Téléphone : <strong>{guardian.phone}</strong>
          </p>
        )}
      </div>

      {/* ENFANTS ASSOCIÉS */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-[#93197D]">
            Enfants associés
          </h2>

          <Link
            to={`/guardians/${guardian.idguardian}/add-child`}
            className="px-4 py-2 bg-[#FDC600] text-[#93197D] rounded-lg font-semibold hover:bg-[#e3b400]"
          >
            Ajouter un enfant
          </Link>
        </div>

        {guardian.children.length === 0 ? (
          <p className="text-[#6F8D4C]">Aucun enfant associé.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {guardian.children.map((child) => (
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

      {/* PLANNINGS ASSOCIÉS */}
      <section>
        <h2 className="text-2xl font-semibold text-[#93197D] mb-4">
          Plannings liés aux enfants
        </h2>

        {guardian.plannings.length === 0 ? (
          <p className="text-[#6F8D4C]">Aucun planning trouvé.</p>
        ) : (
          <div className="space-y-3">
            {guardian.plannings.map((p) => (
              <Link
                key={p.idplanning}
                to={`/plannings/${p.idplanning}`}
                className="block bg-white rounded-xl shadow-sm border border-[#FDC600]/40 p-4 hover:bg-[#FFF3E0]"
              >
                <p className="text-[#93197D] font-semibold">{p.title}</p>

                <p className="text-xs text-[#6F8D4C]">
                  {new Date(p.date).toLocaleDateString("fr-FR")} —{" "}
                  {p.child.firstname}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
