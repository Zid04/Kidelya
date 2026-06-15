import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../../components/page/PageHeader'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import api from '../../api/axios'

type StepForm = { text: string; image: File | null; preview: string | null }

export default function ActivityCreate() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    title: '',
    description: '',
    agemin: '',
    agemax: '',
    duration: '',
    season: '',
    location: '',
    category: '',
    difficulty: '',
    credit_price: '',
    is_purchasable: false,
  })

  const [steps, setSteps] = useState<StepForm[]>([{ text: '', image: null, preview: null }])
  const [photo, setPhoto] = useState<File | null>(null)
  const [photoFile, setPhotoFile] = useState<string | null>(null)
  const [photoUrl, setPhotoUrl] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement
    const { name, value, type } = target
    setForm({ ...form, [name]: type === 'checkbox' ? target.checked : value })
  }

  const addStep = () => {
    setSteps((prev) => [...prev, { text: '', image: null, preview: null }])
  }

  const removeStep = (i: number) => {
    setSteps((prev) => {
      const s = prev[i]
      if (s.preview) URL.revokeObjectURL(s.preview)
      return prev.filter((_, idx) => idx !== i)
    })
  }

  const updateStepText = (i: number, text: string) => {
    setSteps((prev) => prev.map((s, idx) => (idx === i ? { ...s, text } : s)))
  }

  const updateStepImage = (i: number, file: File | null) => {
    setSteps((prev) =>
      prev.map((s, idx) => {
        if (idx !== i) return s
        if (s.preview) URL.revokeObjectURL(s.preview)
        return { ...s, image: file, preview: file ? URL.createObjectURL(file) : null }
      })
    )
  }

  const handlePhoto = (file: File | null) => {
    if (photoFile) URL.revokeObjectURL(photoFile)
    setPhoto(file)
    setPhotoFile(file ? URL.createObjectURL(file) : null)
    if (file) setPhotoUrl('')
  }

  const photoPreview = photoFile || (photoUrl.startsWith('http') ? photoUrl : null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const data = new FormData()
    data.append('title', form.title)
    if (form.description) data.append('description', form.description)
    if (form.agemin)      data.append('agemin', form.agemin)
    if (form.agemax)      data.append('agemax', form.agemax)
    if (form.duration)    data.append('duration', form.duration)
    if (form.season)      data.append('season', form.season)
    if (form.location)    data.append('location', form.location)
    if (form.category)    data.append('category', form.category)
    if (form.difficulty)  data.append('difficulty', form.difficulty)
    if (form.credit_price) data.append('credit_price', form.credit_price)
    data.append('is_purchasable', form.is_purchasable ? '1' : '0')

    if (photo) data.append('photo', photo)
    else if (photoUrl) data.append('photo_url', photoUrl)

    steps.filter((s) => s.text.trim()).forEach((step, i) => {
      data.append(`steps[${i}][text]`, step.text.trim())
      if (step.image) data.append(`steps[${i}][image]`, step.image)
    })

    await api.post('/activities', data)
    navigate('/activities')
  }

  return (
    <div className="p-8">
      <PageHeader title="Créer une activité" description="Ajoutez une nouvelle activité complète" />

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">

          <div>
            <label className="block text-sm font-medium mb-1">Titre *</label>
            <input name="title" value={form.title} onChange={handleChange} required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Âge min</label>
              <input type="number" name="agemin" value={form.agemin} onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Âge max</label>
              <input type="number" name="agemax" value={form.agemax} onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Durée (minutes)</label>
            <input type="number" name="duration" value={form.duration} onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Saison</label>
            <input name="season" value={form.season} onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Lieu</label>
            <input name="location" value={form.location} onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Catégorie</label>
            <select name="category" value={form.category} onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
              <option value="">Sélectionner</option>
              <option value="manuel">Manuel</option>
              <option value="artistique">Artistique</option>
              <option value="logique">Logique</option>
              <option value="exterieur">Extérieur</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Difficulté</label>
            <select name="difficulty" value={form.difficulty} onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
              <option value="">Sélectionner</option>
              <option value="facile">Facile</option>
              <option value="moyen">Moyen</option>
              <option value="difficile">Difficile</option>
            </select>
          </div>

          {/* Illustration principale */}
          <div>
            <label className="block text-sm font-medium mb-2">Illustration principale</label>
            <input type="file" accept="image/*"
              onChange={(e) => handlePhoto(e.target.files?.[0] || null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white" />
            <div className="flex items-center gap-3 my-2">
              <hr className="flex-1 border-gray-200" />
              <span className="text-xs text-gray-400">ou</span>
              <hr className="flex-1 border-gray-200" />
            </div>
            <input
              type="url"
              placeholder="https://exemple.com/image.jpg"
              value={photoUrl}
              onChange={(e) => { setPhotoUrl(e.target.value); if (e.target.value) handlePhoto(null) }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
            {photoPreview && (
              <img src={photoPreview} alt="" className="mt-2 h-32 rounded-lg object-cover" />
            )}
          </div>

          {/* Étapes */}
          <div>
            <label className="block text-sm font-medium mb-2">Étapes</label>
            <div className="space-y-3">
              {steps.map((step, i) => (
                <div key={i} className="rounded-lg border border-gray-200 p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-600 text-xs font-bold text-white">
                      {i + 1}
                    </span>
                    <span className="text-sm font-medium text-gray-700">Étape {i + 1}</span>
                    {steps.length > 1 && (
                      <button type="button" onClick={() => removeStep(i)}
                        className="ml-auto text-xs text-red-400 hover:text-red-600">
                        Supprimer
                      </button>
                    )}
                  </div>
                  <input
                    value={step.text}
                    onChange={(e) => updateStepText(i, e.target.value)}
                    placeholder={`Description de l'étape ${i + 1}…`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Illustration (optionnel)</label>
                    <input type="file" accept="image/*"
                      onChange={(e) => updateStepImage(i, e.target.files?.[0] || null)}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs bg-white" />
                    {step.preview && (
                      <img src={step.preview} alt="" className="mt-2 h-24 rounded-lg object-cover" />
                    )}
                  </div>
                </div>
              ))}
              <button type="button" onClick={addStep}
                className="text-purple-600 text-sm hover:text-purple-800">
                + Ajouter une étape
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Prix en crédits *</label>
            <input name="credit_price" type="number" value={form.credit_price} onChange={handleChange} required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" name="is_purchasable"
              checked={form.is_purchasable}
              onChange={handleChange} />
            <label className="text-sm text-gray-700">Achat unitaire possible</label>
          </div>

          <Button type="submit">Créer l'activité</Button>
        </form>
      </Card>
    </div>
  )
}
