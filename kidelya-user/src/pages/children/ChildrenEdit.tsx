import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import api from "@/api/axios"

interface Child {
  idchildren: number
  firstname: string
  lastname: string
  birthday: string
  sexe: "male" | "female" | "other"
  specification_note?: string | null
}

export default function ChildrenEdit() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [child,            setChild]            = useState<Child | null>(null)
  const [firstname,        setFirstname]        = useState("")
  const [lastname,         setLastname]         = useState("")
  const [birthday,         setBirthday]         = useState("")
  const [sexe,             setSexe]             = useState<"male" | "female" | "other" | "">("")
  const [specificationNote,setSpecificationNote]= useState("")
  const [loading,          setLoading]          = useState(true)
  const [saving,           setSaving]           = useState(false)
  const [errors,           setErrors]           = useState<Record<string, string>>({})

  useEffect(() => {
    api.get(`/children/${id}`)
      .then(res => {
        const c: Child = res.data.data ?? res.data.child ?? res.data
        setChild(c)
        setFirstname(c.firstname)
        setLastname(c.lastname)
        setBirthday(c.birthday.slice(0, 10))
        setSexe(c.sexe)
        setSpecificationNote(c.specification_note ?? "")
      })
      .catch(() => setErrors({ general: "Impossible de charger cet enfant." }))
      .finally(() => setLoading(false))
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setErrors({})

    try {
      await api.put(`/children/${id}`, {
        firstname,
        lastname,
        birthday,
        sexe,
        specification_note: specificationNote || undefined,
      })
      navigate(`/children/${id}`)
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { errors?: Record<string, string[]> } } }
      const be = axiosErr.response?.data?.errors ?? {}
      const mapped: Record<string, string> = {}
      for (const key in be) mapped[key] = be[key][0]
      if (Object.keys(mapped).length) {
        setErrors(mapped)
      } else {
        setErrors({ general: "Impossible de mettre à jour l'enfant." })
      }
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-[#6F8D4C]">Chargement…</div>
  if (!child)  return <div className="min-h-screen flex items-center justify-center text-[#6F8D4C]">Enfant introuvable.</div>

  return (
    <div className="min-h-screen bg-white px-6 py-10 max-w-xl mx-auto">

      <h1 className="text-3xl font-bold text-[#93197D] mb-8">Modifier {child.firstname} 🌸</h1>

      {errors.general && (
        <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">{errors.general}</div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-[#FDC600]/40 p-6 space-y-5">

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-[#93197D] mb-1">Prénom *</label>
            <input type="text" value={firstname} onChange={e => setFirstname(e.target.value)} required
              className="w-full border border-[#FDC600]/40 rounded-lg px-4 py-2" />
            {errors.firstname && <p className="mt-1 text-xs text-red-500">{errors.firstname}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#93197D] mb-1">Nom *</label>
            <input type="text" value={lastname} onChange={e => setLastname(e.target.value)} required
              className="w-full border border-[#FDC600]/40 rounded-lg px-4 py-2" />
            {errors.lastname && <p className="mt-1 text-xs text-red-500">{errors.lastname}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#93197D] mb-1">Date de naissance *</label>
          <input type="date" value={birthday} onChange={e => setBirthday(e.target.value)} required
            className="w-full border border-[#FDC600]/40 rounded-lg px-4 py-2" />
          {errors.birthday && <p className="mt-1 text-xs text-red-500">{errors.birthday}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#93197D] mb-2">Sexe *</label>
          <div className="flex gap-4">
            {(["male", "female", "other"] as const).map(s => (
              <label key={s} className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 font-semibold transition-colors ${
                sexe === s ? "border-[#E94E6F] bg-[#FFF5F7] text-[#E94E6F]" : "border-gray-200 text-[#374151] hover:border-[#E94E6F]/50"
              }`}>
                <input type="radio" name="sexe" value={s} checked={sexe === s} onChange={() => setSexe(s)} className="sr-only" />
                {s === "male" ? "👦 Garçon" : s === "female" ? "👧 Fille" : "⚧ Autre"}
              </label>
            ))}
          </div>
          {errors.sexe && <p className="mt-1 text-xs text-red-500">{errors.sexe}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#93197D] mb-1">Note (optionnel)</label>
          <textarea value={specificationNote} onChange={e => setSpecificationNote(e.target.value)}
            rows={3} placeholder="Allergies, besoins spécifiques…"
            className="w-full border border-[#FDC600]/40 rounded-lg px-4 py-2 resize-none" />
        </div>

        <div className="flex gap-4 pt-2">
          <button type="submit" disabled={saving || !sexe}
            className="flex-1 px-4 py-3 bg-[#E94E6F] text-white rounded-lg font-semibold hover:bg-[#d63f5f] disabled:opacity-50">
            {saving ? "Enregistrement…" : "Enregistrer"}
          </button>
          <button type="button" onClick={() => navigate(-1)}
            className="flex-1 px-4 py-3 bg-white border border-[#93197D] text-[#93197D] rounded-lg font-semibold hover:bg-[#FFF3E0]">
            Annuler
          </button>
        </div>
      </form>
    </div>
  )
}
