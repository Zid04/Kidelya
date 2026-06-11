import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { createActivity } from "../../services/ActivityService"
import { getThemes } from "../../services/ThemeService"
import { getCompetences } from "../../services/CompetenceService"

// Types utilisés réellement dans le fichier
interface Theme {
  idtheme: number
  name: string
}

interface Competence {
  idcompetence: number
  name: string
}

interface ActivityFormState {
  title: string
  description: string
  agemin: string
  agemax: string
  duration: string
  category: string
  season: string
  location: string
  steps: string
  materials: string
}

export default function ActivityCreate() {
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
    steps: "",
    materials: "",
  })

  const [photo, setPhoto] = useState<File | null>(null)
  const [themes, setThemes] = useState<Theme[]>([])
  const [competences, setCompetences] = useState<Competence[]>([])
  const [selectedThemes, setSelectedThemes] = useState<number[]>([])
  const [selectedCompetences, setSelectedCompetences] = useState<number[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const t = await getThemes()
      const c = await getCompetences()
      setThemes(t)
      setCompetences(c)
    }
    load()
  }, [])

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
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
    setLoading(true)
    setError(null)

    try {
      const data = new FormData()

      Object.entries(form).forEach(([key, value]) => {
        data.append(key, value)
      })

      if (photo) data.append("photourl", photo)

      selectedThemes.forEach((id) => data.append("themes[]", id.toString()))
      selectedCompetences.forEach((id) =>
        data.append("competences[]", id.toString())
      )

      await createActivity(data)
      navigate("/mes-activites")
    } catch (err) {
      setError("Impossible de créer l'activité. Veuillez réessayer.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white px-6 py-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-[#93197D] mb-6 flex items-center gap-2">
        Créer une activité <span className="text-[#FDC600]">🌸</span>
      </h1>

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
            placeholder="Ex : Peinture magique au sel"
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
            placeholder="Décrivez brièvement l’activité…"
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
          <label className="block text-[#93197D] font-semibold mb-1">Étapes</label>
          <textarea
            name="steps"
            value={form.steps}
            onChange={handleChange}
            rows={4}
            className="w-full border border-[#FDC600]/40 rounded-lg px-4 py-2"
          />
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
          disabled={loading}
          className="w-full py-3 bg-[#E94E6F] text-white rounded-lg font-semibold hover:bg-[#d63f5f]"
        >
          {loading ? "Création..." : "Créer l’activité"}
        </button>
      </form>
    </div>
  )
}
