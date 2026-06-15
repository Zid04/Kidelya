import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../../components/page/PageHeader'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import api from '../../api/axios'

export default function PackCreate() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    title: '',
    description: '',
    tarification: '',
    duration: '',
    type: 'monthly',
  })
  const [illustration, setIllustration] = useState<File | null>(null)
  const [illustrationFile, setIllustrationFile] = useState<string | null>(null)
  const [illustrationUrl, setIllustrationUrl] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleFile = (file: File | null) => {
    if (illustrationFile) URL.revokeObjectURL(illustrationFile)
    setIllustration(file)
    setIllustrationFile(file ? URL.createObjectURL(file) : null)
    if (file) setIllustrationUrl('')
  }

  const preview = illustrationFile || (illustrationUrl.startsWith('http') ? illustrationUrl : null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const data = new FormData()
    data.append('title', form.title)
    if (form.description) data.append('description', form.description)
    data.append('tarification', form.tarification)
    data.append('duration', form.duration)
    data.append('type', form.type)
    data.append('is_published', '0')
    if (illustration) data.append('illustration', illustration)
    else if (illustrationUrl) data.append('illustration_url', illustrationUrl)

    const res = await api.post('/packs', data)
    const newPackId = res.data.data.idpack
    navigate(`/packs/${newPackId}/edit`)
  }


  return (
    <div className="p-8">

      <PageHeader
        title="Créer un pack"
        description="Ajoutez un nouveau pack d'abonnement"
      />

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Illustration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Illustration de couverture
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFile(e.target.files?.[0] || null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
            />
            <div className="flex items-center gap-3 my-2">
              <hr className="flex-1 border-gray-200" />
              <span className="text-xs text-gray-400">ou</span>
              <hr className="flex-1 border-gray-200" />
            </div>
            <input
              type="url"
              placeholder="https://exemple.com/image.jpg"
              value={illustrationUrl}
              onChange={(e) => { setIllustrationUrl(e.target.value); if (e.target.value) handleFile(null) }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
            {preview && (
              <img src={preview} alt="Preview" className="mt-2 h-32 rounded-lg object-cover border" />
            )}
          </div>

          {/* Titre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              placeholder="Pack Premium"
              required
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="monthly">Mensuel</option>
              <option value="quarterly">Trimestriel</option>
              <option value="yearly">Annuel</option>
            </select>
          </div>

          {/* Tarification */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tarification (€)</label>
            <input
              name="tarification"
              type="number"
              value={form.tarification}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              placeholder="29.99"
              required
            />
          </div>

          {/* Durée */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Durée (jours)</label>
            <input
              name="duration"
              type="number"
              value={form.duration}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              placeholder="30"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              rows={3}
              placeholder="Description du pack..."
            />
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? 'Création...' : 'Créer le pack'}
          </Button>
        </form>
      </Card>
    </div>
  )
}
