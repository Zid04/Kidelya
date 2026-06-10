import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import api from "@/api/axios"
import { useAuth } from "@/context/useAuth"

interface Child {
  idchildren: number
  firstname: string
  birthday: string
  avatar?: string | null
}

export default function ChildrenIndex() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const hasSubscription = Boolean(user?.plan)

  const [children, setChildren] = useState<Child[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<number | null>(null)

  useEffect(() => {
    api.get("/children")
      .then(res => setChildren(res.data.data ?? res.data ?? []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (idchildren: number, firstname: string) => {
    if (!confirm(`Supprimer ${firstname} ?`)) return
    setDeleting(idchildren)
    try {
      await api.delete(`/children/${idchildren}`)
      setChildren(prev => prev.filter(c => c.idchildren !== idchildren))
    } catch {
      alert("Erreur lors de la suppression.")
    } finally {
      setDeleting(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#6F8D4C]">
        Chargement des enfants…
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white px-6 py-10 max-w-5xl mx-auto">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#93197D]">Mes enfants 🌸</h1>
        <Link
          to="/children/create"
          className="px-4 py-2 bg-[#E94E6F] text-white rounded-lg font-semibold hover:bg-[#d63f5f]"
        >
          Ajouter un enfant
        </Link>
      </div>

      {!hasSubscription && (
        <div className="mb-6 rounded-xl border border-[#E94E6F]/30 bg-[#FFF5F7] px-4 py-3 text-sm text-[#6B7280]">
          Abonnement <strong className="text-[#E94E6F]">Free</strong> — certaines fonctionnalités sont limitées.{" "}
          <Link to="/abonnements" className="font-semibold text-[#E94E6F] underline">Voir les offres</Link>
        </div>
      )}

      {children.length === 0 ? (
        <p className="text-[#6F8D4C]">Aucun enfant enregistré.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {children.map((child) => (
            <div
              key={child.idchildren}
              className="bg-white rounded-xl shadow-sm border border-[#FDC600]/40 p-5 flex items-center gap-4"
            >
              {child.avatar ? (
                <img src={child.avatar} alt={child.firstname} className="w-20 h-20 rounded-full object-cover" />
              ) : (
                <div className="w-20 h-20 rounded-full bg-[#FFF3E0] flex items-center justify-center text-[#93197D] font-bold text-xl">
                  {child.firstname[0]}
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-[#93197D]">{child.firstname}</h3>
                <p className="text-sm text-[#6F8D4C]">
                  Né(e) le {new Date(child.birthday).toLocaleDateString("fr-FR")}
                </p>
                <div className="mt-3 flex gap-3">
                  <Link to={`/children/${child.idchildren}`} className="text-[#E94E6F] font-semibold hover:underline text-sm">Voir →</Link>
                  <Link to={`/children/${child.idchildren}/edit`} className="text-[#93197D] font-semibold hover:underline text-sm">Modifier</Link>
                  <button
                    onClick={() => handleDelete(child.idchildren, child.firstname)}
                    disabled={deleting === child.idchildren}
                    className="text-sm font-semibold text-red-500 hover:underline disabled:opacity-40"
                  >
                    {deleting === child.idchildren ? "…" : "Supprimer"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
