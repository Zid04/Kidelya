import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getMyActivity, updateActivity } from "../../services/ActivityService"
import { getThemes } from "../../services/ThemeService"
import { getCompetences } from "../../services/CompetenceService"
import type { Theme, Competence } from "@/types/Taxonomies"
import type { Activity } from "@/types/Activity"
import { mediaUrl } from "@/utils/media"

interface ActivityFormState {
  title: string
  description: string
  agemin: string
  agemax: string
  duration: string
  category: string
  season: string
  location: string
  materials: string
}

type StepForm = { text: string; image: File | null; imageUrl: string | null; preview: string | null }

export default function ActivityEdit() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [form, setForm] = useState<ActivityFormState>({
    title: "",
    description: "",
    agemin: "",
    agemax: "",
    duration: "",
    category: "",
    season: "",
    location: "",
    materials: "",
  })

  const [steps, setSteps] = useState<StepForm[]>([])
  const [photo, setPhoto] = useState<File | null>(null)
  const [themes, setThemes] = useState<Theme[]>([])
  const [competences, setCompetences] = useState<Competence[]>([])
  const [selectedThemes, setSelectedThemes] = useState<number[]>([])
  const [selectedCompetences, setSelectedCompetences] = useState<number[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const activity: Activity = await getMyActivity(Number(id))
        const t = await getThemes()
        const c = await getCompetences()

        setThemes(t)
        setCompetences(c)

        setForm({
          title: activity.title,
          description: activity.description ?? "",
          agemin: activity.agemin?.toString() ?? "",
          agemax: activity.agemax?.toString() ?? "",
          duration: activity.duration?.toString() ?? "",
          category: activity.category ?? "",
          season: activity.season ?? "",
          location: activity.location ?? "",
          materials: activity.materials?.join(", ") ?? "",
        })

        // Normalise les étapes existantes (anciens string ou nouveaux objets)
        const existingSteps = Array.isArray(activity.steps) ? activity.steps : []
        setSteps(
          existingSteps.map((s) => {
            const step = typeof s === "string" ? { text: s, image: null } : s
            return { text: step.text ?? "", image: null, imageUrl: step.image ?? null, preview: null }
          })
        )

        setSelectedThemes(activity.themes?.map((t) => t.idtheme) ?? [])
        setSelectedCompetences(activity.competences?.map((c) => c.idcompetence) ?? [])
      } catch {
        setError("Impossible de charger l'activité. Veuillez réessayer.")
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [id])

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function addStep() {
    setSteps((prev) => [...prev, { text: "", image: null, imageUrl: null, preview: null }])
  }

  function removeStep(i: number) {
    setSteps((prev) => {
      const s = prev[i]
      if (s.preview) URL.revokeObjectURL(s.preview)
      return prev.filter((_, idx) => idx !== i)
    })
  }

  function updateStepText(i: number, text: string) {
    setSteps((prev) => prev.map((s, idx) => (idx === i ? { ...s, text } : s)))
  }

  function updateStepImage(i: number, file: File | null) {
    setSteps((prev) =>
      prev.map((s, idx) => {
        if (idx !== i) return s
        if (s.preview) URL.revokeObjectURL(s.preview)
        return { ...s, image: file, imageUrl: null, preview: file ? URL.createObjectURL(file) : null }
      })
    )
  }

  function removeStepImage(i: number) {
    setSteps((prev) =>
      prev.map((s, idx) => {
        if (idx !== i) return s
        if (s.preview) URL.revokeObjectURL(s.preview)
        return { ...s, image: null, imageUrl: null, preview: null }
      })
    )
  }

  function toggleTheme(id: number) {
    setSelectedThemes((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  function toggleCompetence(id: number) {
    setSelectedCompetences((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      const data = new FormData()

      data.append("title", form.title)
      if (form.description) data.append("description", form.description)
      if (form.agemin)      data.append("agemin",      form.agemin)
      if (form.agemax)      data.append("agemax",      form.agemax)
      if (form.duration)    data.append("duration",    form.duration)
      if (form.category)    data.append("category",    form.category)
      if (form.season)      data.append("season",      form.season)
      if (form.location)    data.append("location",    form.location)

      // Étapes avec illustration
      steps.filter((s) => s.text.trim()).forEach((step, i) => {
        data.append(`steps[${i}][text]`, step.text.trim())
        if (step.image) {
          data.append(`steps[${i}][image]`, step.image)
        } else if (step.imageUrl) {
          data.append(`steps[${i}][image_url]`, step.imageUrl)
        }
      })

      // Matériaux
      const mats = form.materials.split(",").map((m) => m.trim()).filter(Boolean)
      mats.forEach((m) => data.append("materials[]", m))

      if (photo) data.append("photo", photo)

      selectedThemes.forEach((id) => data.append("themes[]", id.toString()))
      selectedCompetences.forEach((id) => data.append("competences[]", id.toString()))

      data.append("_method", "PUT")
      await updateActivity(Number(id), data)
      setSuccess(true)
      setTimeout(() => navigate("/activities"), 1800)
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { errors?: Record<string, string[]>; message?: string } } }
      const firstError = Object.values(axiosErr.response?.data?.errors ?? {}).flat()[0]
      setError(firstError ?? axiosErr.response?.data?.message ?? "Impossible de modifier l'activité. Veuillez réessayer.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-[#6F8D4C]">
        Chargement de l'activité…
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white px-6 py-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-[#93197D] mb-6 flex items-center gap-2">
        Modifier l'activité <span className="text-[#FDC600]">🌸</span>
      </h1>

      {success && (
        <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-semibold text-green-700">
          Activité modifiée avec succès ! Redirection en cours…
        </div>
      )}
      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">{error}</div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm border border-[#FDC600]/40 p-6 space-y-6"
      >
        {/* TITRE */}
        <div>
          <label className="block text-[#93197D] font-semibold mb-1">Titre *</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full border border-[#FDC600]/40 rounded-lg px-4 py-2"
          />
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="block text-[#93197D] font-semibold mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            className="w-full border border-[#FDC600]/40 rounded-lg px-4 py-2"
          />
        </div>

        {/* ÂGE MIN / MAX */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[#93197D] font-semibold mb-1">Âge minimum</label>
            <input
              type="number"
              name="agemin"
              value={form.agemin}
              onChange={handleChange}
              className="w-full border border-[#FDC600]/40 rounded-lg px-4 py-2"
            />
          </div>
          <div>
            <label className="block text-[#93197D] font-semibold mb-1">Âge maximum</label>
            <input
              type="number"
              name="agemax"
              value={form.agemax}
              onChange={handleChange}
              className="w-full border border-[#FDC600]/40 rounded-lg px-4 py-2"
            />
          </div>
        </div>

        {/* DURÉE */}
        <div>
          <label className="block text-[#93197D] font-semibold mb-1">Durée (minutes)</label>
          <input
            type="number"
            name="duration"
            value={form.duration}
            onChange={handleChange}
            className="w-full border border-[#FDC600]/40 rounded-lg px-4 py-2"
          />
        </div>

        {/* CATÉGORIE */}
        <div>
          <label className="block text-[#93197D] font-semibold mb-1">Catégorie</label>
          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full border border-[#FDC600]/40 rounded-lg px-4 py-2"
          />
        </div>

        {/* SAISON */}
        <div>
          <label className="block text-[#93197D] font-semibold mb-1">Saison</label>
          <input
            name="season"
            value={form.season}
            onChange={handleChange}
            className="w-full border border-[#FDC600]/40 rounded-lg px-4 py-2"
          />
        </div>

        {/* LIEU */}
        <div>
          <label className="block text-[#93197D] font-semibold mb-1">Lieu</label>
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            className="w-full border border-[#FDC600]/40 rounded-lg px-4 py-2"
          />
        </div>

        {/* MATÉRIAUX */}
        <div>
          <label className="block text-[#93197D] font-semibold mb-1">Matériaux</label>
          <textarea
            name="materials"
            value={form.materials}
            onChange={handleChange}
            rows={3}
            className="w-full border border-[#FDC600]/40 rounded-lg px-4 py-2"
            placeholder="Liste séparée par des virgules"
          />
        </div>

        {/* ÉTAPES */}
        <div>
          <label className="block text-[#93197D] font-semibold mb-2">Étapes</label>
          <div className="space-y-3">
            {steps.map((step, i) => (
              <div key={i} className="rounded-xl border border-[#FDC600]/40 p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#21164F] text-xs font-black text-white">
                    {i + 1}
                  </span>
                  <span className="text-sm font-semibold text-[#93197D]">Étape {i + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeStep(i)}
                    className="ml-auto text-xs text-red-400 hover:text-red-600"
                  >
                    Supprimer
                  </button>
                </div>
                <textarea
                  value={step.text}
                  onChange={(e) => updateStepText(i, e.target.value)}
                  rows={2}
                  placeholder="Décrivez cette étape…"
                  className="w-full border border-[#FDC600]/40 rounded-lg px-4 py-2 text-sm"
                />
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Illustration (optionnel)</label>
                  {/* Image existante */}
                  {step.imageUrl && !step.image && (
                    <div className="mb-2 flex items-start gap-2">
                      <img src={mediaUrl(step.imageUrl) ?? step.imageUrl} alt="" className="h-24 rounded-lg object-cover" />
                      <button
                        type="button"
                        onClick={() => removeStepImage(i)}
                        className="text-xs text-red-400 hover:text-red-600"
                      >
                        Supprimer
                      </button>
                    </div>
                  )}
                  {/* Nouvelle image */}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => updateStepImage(i, e.target.files?.[0] || null)}
                    className="w-full border border-[#FDC600]/40 rounded-lg px-3 py-1.5 text-xs bg-white"
                  />
                  {step.preview && (
                    <img src={step.preview} alt="" className="mt-2 h-28 rounded-lg object-cover" />
                  )}
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addStep}
              className="flex items-center gap-2 rounded-xl border border-dashed border-[#FDC600] px-4 py-2.5 text-sm font-semibold text-[#93197D] hover:bg-[#FFF9E5] w-full justify-center"
            >
              + Ajouter une étape
            </button>
          </div>
        </div>

        {/* THÈMES */}
        <div>
          <label className="block text-[#93197D] font-semibold mb-2">Thèmes liés</label>
          <div className="grid grid-cols-2 gap-2">
            {themes.map((t) => (
              <label key={t.idtheme} className="flex items-center gap-2 text-[#6F8D4C]">
                <input
                  type="checkbox"
                  checked={selectedThemes.includes(t.idtheme)}
                  onChange={() => toggleTheme(t.idtheme)}
                />
                {t.name}
              </label>
            ))}
          </div>
        </div>

        {/* COMPÉTENCES */}
        <div>
          <label className="block text-[#93197D] font-semibold mb-2">Compétences liées</label>
          <div className="grid grid-cols-2 gap-2">
            {competences.map((c) => (
              <label key={c.idcompetence} className="flex items-center gap-2 text-[#6F8D4C]">
                <input
                  type="checkbox"
                  checked={selectedCompetences.includes(c.idcompetence)}
                  onChange={() => toggleCompetence(c.idcompetence)}
                />
                {c.name}
              </label>
            ))}
          </div>
        </div>

        {/* PHOTO */}
        <div>
          <label className="block text-[#93197D] font-semibold mb-1">Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files?.[0] || null)}
            className="w-full border border-[#FDC600]/40 rounded-lg px-4 py-2 bg-white"
          />
        </div>

        {/* BOUTON */}
        <button
          type="submit"
          disabled={saving}
          className="w-full py-3 bg-[#E94E6F] text-white rounded-lg font-semibold hover:bg-[#d63f5f]"
        >
          {saving ? "Enregistrement..." : "Enregistrer les modifications"}
        </button>
      </form>
    </div>
  )
}
