import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "@/api/axios"

interface Child {
  idchildren: number
  firstname: string
  lastname: string
  avatar?: string | null
}

export default function GuardianCreate() {
  const navigate = useNavigate()

  const [names,   setNames]   = useState("")
  const [email,   setEmail]   = useState("")
  const [phone,   setPhone]   = useState("")
  const [address, setAddress] = useState("")

  const [allChildren,       setAllChildren]       = useState<Child[]>([])
  const [selectedChildren,  setSelectedChildren]  = useState<number[]>([])

  const [loading,  setLoading]  = useState(true)
  const [saving,   setSaving]   = useState(false)
  const [success,  setSuccess]  = useState(false)
  const [errors,   setErrors]   = useState<Record<string, string>>({})

  useEffect(() => {
    api.get("/children")
      .then(res => setAllChildren(res.data.data ?? res.data ?? []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const toggle = (id: number) =>
    setSelectedChildren(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setErrors({})
    try {
      await api.post("/guardians", { names, email, phone, address, children: selectedChildren })
      setSuccess(true)
      setTimeout(() => navigate("/guardians"), 1500)
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { errors?: Record<string, string[]> } } }
      const be = axiosErr.response?.data?.errors ?? {}
      const mapped: Record<string, string> = {}
      for (const key in be) mapped[key] = be[key][0]
      setErrors(Object.keys(mapped).length ? mapped : { general: "Impossible de créer le parent." })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] px-4 py-10">
      <div className="max-w-2xl mx-auto">

        {/* En-tête */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-[#FDC600]/40 shadow-sm hover:bg-[#FFF3E0] text-[#93197D]">
            ←
          </button>
          <div>
            <h1 className="text-2xl font-bold text-[#93197D]">Enregistrer un parent</h1>
            <p className="text-sm text-[#6F8D4C] mt-0.5">Remplissez les informations du parent / tuteur</p>
          </div>
        </div>

        {success && (
          <div className="mb-5 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm font-semibold text-green-700">
            ✓ Parent enregistré avec succès ! Redirection en cours…
          </div>
        )}

        {errors.general && (
          <div className="mb-5 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm font-semibold text-red-600">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Informations principales */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#FDC600]/40 p-6 space-y-4">
            <h2 className="text-base font-bold text-[#93197D] flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-[#93197D]/10 flex items-center justify-center text-sm">👤</span>
              Informations personnelles
            </h2>

            <div>
              <label className="block text-sm font-semibold text-[#374151] mb-1">Nom complet *</label>
              <input type="text" value={names} onChange={e => setNames(e.target.value)} required
                placeholder="Ex : Marie Dupont"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#93197D] transition-colors" />
              {errors.names && <p className="mt-1 text-xs text-red-500">{errors.names}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#374151] mb-1">Email *</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                placeholder="Ex : marie.dupont@email.com"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#93197D] transition-colors" />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#374151] mb-1">Téléphone</label>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                  placeholder="Ex : 06 12 34 56 78"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#93197D] transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#374151] mb-1">Adresse</label>
                <input type="text" value={address} onChange={e => setAddress(e.target.value)}
                  placeholder="Ex : 12 rue de la Paix"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#93197D] transition-colors" />
              </div>
            </div>
          </div>

          {/* Enfants à associer */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#FDC600]/40 p-6">
            <h2 className="text-base font-bold text-[#93197D] flex items-center gap-2 mb-4">
              <span className="w-7 h-7 rounded-full bg-[#FDC600]/20 flex items-center justify-center text-sm">🌸</span>
              Associer des enfants
              <span className="ml-auto text-xs font-normal text-[#6F8D4C]">Optionnel</span>
            </h2>

            {loading ? (
              <p className="text-sm text-[#6F8D4C]">Chargement des enfants…</p>
            ) : allChildren.length === 0 ? (
              <div className="text-center py-6 text-[#6F8D4C]">
                <p className="text-3xl mb-2">🌱</p>
                <p className="text-sm">Aucun enfant enregistré pour l'instant.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {allChildren.map(child => {
                  const selected = selectedChildren.includes(child.idchildren)
                  return (
                    <button key={child.idchildren} type="button" onClick={() => toggle(child.idchildren)}
                      className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${
                        selected
                          ? "border-[#E94E6F] bg-[#FFF5F7]"
                          : "border-gray-100 bg-[#FAFAFA] hover:border-[#FDC600]/60"
                      }`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0 ${
                        selected ? "bg-[#E94E6F] text-white" : "bg-[#FFF3E0] text-[#93197D]"
                      }`}>
                        {child.avatar
                          ? <img src={child.avatar} alt={child.firstname} className="w-10 h-10 rounded-full object-cover" />
                          : child.firstname[0].toUpperCase()
                        }
                      </div>
                      <div className="min-w-0">
                        <p className={`text-sm font-semibold truncate ${selected ? "text-[#E94E6F]" : "text-[#93197D]"}`}>
                          {child.firstname} {child.lastname}
                        </p>
                        {selected && <p className="text-xs text-[#E94E6F]">✓ Sélectionné</p>}
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pb-6">
            <button type="button" onClick={() => navigate(-1)}
              className="flex-1 px-4 py-3 bg-white border border-gray-200 text-[#374151] rounded-xl font-semibold hover:bg-gray-50 transition-colors">
              Annuler
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 px-4 py-3 bg-[#E94E6F] text-white rounded-xl font-semibold hover:bg-[#d63f5f] disabled:opacity-50 transition-colors shadow-sm">
              {saving ? "Enregistrement…" : "Créer le parent"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
