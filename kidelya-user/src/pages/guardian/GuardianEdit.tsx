import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
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

export default function GuardianEdit() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [guardian, setGuardian] = useState<Guardian | null>(null)
  const [names, setNames] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [allChildren, setAllChildren] = useState<Child[]>([])
  const [selectedChildren, setSelectedChildren] = useState<number[]>([])

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    Promise.all([
      api.get(`/guardians/${id}`),
      api.get("/children"),
    ]).then(([gRes, cRes]) => {
      const g: Guardian = gRes.data.data ?? gRes.data
      setGuardian(g)
      setNames(g.names)
      setEmail(g.email)
      setPhone(g.phone ?? "")
      setAddress(g.address ?? "")
      setSelectedChildren(g.children.map(c => c.idchildren))
      setAllChildren(cRes.data.data ?? cRes.data ?? [])
    }).catch(() => setErrors({ general: "Impossible de charger ce parent." }))
      .finally(() => setLoading(false))
  }, [id])

  const toggleChild = (cid: number) => {
    setSelectedChildren(prev =>
      prev.includes(cid) ? prev.filter(x => x !== cid) : [...prev, cid]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setErrors({})

    try {
      await api.put(`/guardians/${id}`, { names, email, phone, address, children: selectedChildren })
      navigate(`/guardians/${id}`)
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { errors?: Record<string, string[]> } } }
      const be = axiosErr.response?.data?.errors ?? {}
      const mapped: Record<string, string> = {}
      for (const key in be) mapped[key] = be[key][0]
      setErrors(Object.keys(mapped).length ? mapped : { general: "Impossible de mettre à jour le parent." })
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-[#273068]">Chargement…</div>
  if (errors.general && !guardian) return <div className="min-h-screen flex items-center justify-center text-red-500">{errors.general}</div>

  return (
    <div className="min-h-screen bg-white px-6 py-10 max-w-3xl mx-auto">

      <div className="flex items-center gap-3 mb-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="-ml-4 px-4 py-2 bg-[#E94E6F] text-white rounded-lg font-semibold hover:bg-[#d63f5f]"
        >
          Retour
        </button>
        <h1 className="text-3xl font-bold text-[#7C67B2]">Modifier {guardian?.names}</h1>
      </div>

      {errors.general && (
        <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">{errors.general}</div>
      )}

      <form onSubmit={handleSubmit} className="bg-[#FFFEFA] rounded-xl shadow-sm p-6 space-y-6">

        <div>
          <label className="block text-sm font-semibold text-[#7C67B2] mb-1">Nom complet *</label>
          <input type="text" value={names} onChange={e => setNames(e.target.value)} required
            className="w-full border border-gray-200 rounded-lg px-4 py-2" />
          {errors.names && <p className="mt-1 text-xs text-red-500">{errors.names}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#7C67B2] mb-1">Email *</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
            className="w-full border border-gray-200 rounded-lg px-4 py-2" />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#7C67B2] mb-1">Téléphone (optionnel)</label>
          <input type="text" value={phone} onChange={e => setPhone(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-2" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#7C67B2] mb-1">Adresse (optionnel)</label>
          <input type="text" value={address} onChange={e => setAddress(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-2" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#7C67B2] mb-3">Enfants associés</label>
          {allChildren.length === 0 ? (
            <p className="text-[#273068]">Aucun enfant disponible.</p>
          ) : (
            <div className="space-y-3">
              {allChildren.map(child => (
                <label key={child.idchildren}
                  className="flex items-center gap-3 bg-white p-3 rounded-lg cursor-pointer hover:bg-[#D5CDE2] transition-colors">
                  <input type="checkbox" checked={selectedChildren.includes(child.idchildren)}
                    onChange={() => toggleChild(child.idchildren)} />
                  {child.avatar ? (
                    <img src={child.avatar} alt={child.firstname} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#D5CDE2] flex items-center justify-center text-[#7C67B2] font-bold">
                      {child.firstname[0]}
                    </div>
                  )}
                  <span className="text-[#273068] font-semibold">{child.firstname}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        <button type="submit" disabled={saving}
          className="w-full py-3 bg-[#E94E6F] text-white rounded-lg font-semibold hover:bg-[#d63f5f] disabled:opacity-50">
          {saving ? "Enregistrement…" : "Enregistrer"}
        </button>
      </form>
    </div>
  )
}
