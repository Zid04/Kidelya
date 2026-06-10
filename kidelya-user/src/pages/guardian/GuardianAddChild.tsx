import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import api from "@/api/axios"

interface Child {
  idchildren: number
  firstname: string
  lastname: string
  birthday?: string
  avatar?: string | null
}

export default function GuardianAddChild() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [children,    setChildren]    = useState<Child[]>([])
  const [selectedId,  setSelectedId]  = useState<number | null>(null)
  const [loading,     setLoading]     = useState(true)
  const [saving,      setSaving]      = useState(false)
  const [error,       setError]       = useState<string | null>(null)

  useEffect(() => {
    api.get("/children")
      .then(res => setChildren(res.data.data ?? res.data ?? []))
      .catch(() => setError("Impossible de charger les enfants."))
      .finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedId) { setError("Veuillez sélectionner un enfant."); return }
    setSaving(true)
    setError(null)
    try {
      await api.post(`/guardians/${id}/children`, { child_id: selectedId })
      navigate(`/guardians/${id}`)
    } catch {
      setError("Impossible d'associer cet enfant.")
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center text-[#6F8D4C]">
      Chargement…
    </div>
  )

  return (
    <div className="min-h-screen bg-[#FAFAFA] px-4 py-10">
      <div className="max-w-xl mx-auto">

        {/* En-tête */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-[#FDC600]/40 shadow-sm hover:bg-[#FFF3E0] text-[#93197D]">
            ←
          </button>
          <div>
            <h1 className="text-2xl font-bold text-[#93197D]">Associer un enfant</h1>
            <p className="text-sm text-[#6F8D4C] mt-0.5">Choisissez l'enfant à lier à ce parent</p>
          </div>
        </div>

        {error && (
          <div className="mb-5 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm font-semibold text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-2xl shadow-sm border border-[#FDC600]/40 p-6 mb-5">
            <h2 className="text-sm font-bold text-[#93197D] mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#FDC600]/20 flex items-center justify-center text-xs">🌸</span>
              Sélectionnez un enfant
            </h2>

            {children.length === 0 ? (
              <div className="text-center py-8 text-[#6F8D4C]">
                <p className="text-3xl mb-2">🌱</p>
                <p className="text-sm">Aucun enfant enregistré.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {children.map(child => {
                  const selected = selectedId === child.idchildren
                  return (
                    <button key={child.idchildren} type="button"
                      onClick={() => setSelectedId(child.idchildren)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${
                        selected
                          ? "border-[#E94E6F] bg-[#FFF5F7]"
                          : "border-gray-100 bg-[#FAFAFA] hover:border-[#FDC600]/60 hover:bg-[#FFF3E0]"
                      }`}>

                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0 transition-colors ${
                        selected ? "bg-[#E94E6F] text-white" : "bg-[#FFF3E0] text-[#93197D]"
                      }`}>
                        {child.avatar
                          ? <img src={child.avatar} alt={child.firstname} className="w-12 h-12 rounded-full object-cover" />
                          : child.firstname[0].toUpperCase()
                        }
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className={`font-semibold truncate ${selected ? "text-[#E94E6F]" : "text-[#93197D]"}`}>
                          {child.firstname} {child.lastname}
                        </p>
                        {child.birthday && (
                          <p className="text-xs text-[#6F8D4C] mt-0.5">
                            Né(e) le {new Date(child.birthday).toLocaleDateString("fr-FR")}
                          </p>
                        )}
                      </div>

                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        selected ? "border-[#E94E6F] bg-[#E94E6F]" : "border-gray-300"
                      }`}>
                        {selected && <span className="text-white text-xs font-bold">✓</span>}
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={() => navigate(-1)}
              className="flex-1 px-4 py-3 bg-white border border-gray-200 text-[#374151] rounded-xl font-semibold hover:bg-gray-50 transition-colors">
              Annuler
            </button>
            <button type="submit" disabled={saving || !selectedId}
              className="flex-1 px-4 py-3 bg-[#E94E6F] text-white rounded-xl font-semibold hover:bg-[#d63f5f] disabled:opacity-40 transition-colors shadow-sm">
              {saving ? "Association…" : "Associer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
