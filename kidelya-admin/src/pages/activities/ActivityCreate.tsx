import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../../components/page/PageHeader'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import api from '../../api/axios'

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
    photourl: '',
    steps: [''],
    category: '',
    difficulty: '',
    credit_price: '',
    is_purchasable: false,
  })

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value })
  }

  const handleStepChange = (index: number, value: string) => {
    const updated = [...form.steps]
    updated[index] = value
    setForm({ ...form, steps: updated })
  }

  const addStep = () => {
    setForm({ ...form, steps: [...form.steps, ''] })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await api.post('/activities', form)
    navigate('/activities')
  }

  return (
    <div className="p-8">

      <PageHeader
        title="Créer une activité"
        description="Ajoutez une nouvelle activité complète"
      />

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Titre */}
          <div>
            <label className="block text-sm font-medium mb-1">Titre</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>

          {/* Âge min / max */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Âge min</label>
              <input
                type="number"
                name="agemin"
                value={form.agemin}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Âge max</label>
              <input
                type="number"
                name="agemax"
                value={form.agemax}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
          </div>

          {/* Durée */}
          <div>
            <label className="block text-sm font-medium mb-1">Durée (minutes)</label>
            <input
              type="number"
              name="duration"
              value={form.duration}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>

          {/* Saison */}
          <div>
            <label className="block text-sm font-medium mb-1">Saison</label>
            <input
              name="season"
              value={form.season}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>

          {/* Lieu */}
          <div>
            <label className="block text-sm font-medium mb-1">Lieu</label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>

          {/* Illustration */}
          <div>
            <label className="block text-sm font-medium mb-1">Illustration (URL)</label>
            <input
              name="photourl"
              value={form.photourl}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>

          {/* Catégorie */}
          <div>
            <label className="block text-sm font-medium mb-1">Catégorie</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="">Sélectionner</option>
              <option value="manuel">Manuel</option>
              <option value="artistique">Artistique</option>
              <option value="logique">Logique</option>
              <option value="exterieur">Extérieur</option>
            </select>
          </div>

          {/* Difficulté */}
          <div>
            <label className="block text-sm font-medium mb-1">Difficulté</label>
            <select
              name="difficulty"
              value={form.difficulty}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="">Sélectionner</option>
              <option value="facile">Facile</option>
              <option value="moyen">Moyen</option>
              <option value="difficile">Difficile</option>
            </select>
          </div>

          {/* Étapes */}
          <div>
            <label className="block text-sm font-medium mb-2">Étapes</label>

            {form.steps.map((step, index) => (
              <input
                key={index}
                value={step}
                onChange={(e) => handleStepChange(index, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mb-2"
                placeholder={`Étape ${index + 1}`}
              />
            ))}

            <button
              type="button"
              onClick={addStep}
              className="text-purple-600 text-sm"
            >
              + Ajouter une étape
            </button>
          </div>

          {/* Prix crédits */}
          <div>
            <label className="block text-sm font-medium mb-1">Prix en crédits</label>
            <input
              name="credit_price"
              type="number"
              value={form.credit_price}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              required
            />
          </div>

          {/* Achat unitaire */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="is_purchasable"
              checked={form.is_purchasable}
              onChange={handleChange}
            />
            <label className="text-sm text-gray-700">Achat unitaire possible</label>
          </div>

          <Button type="submit">Créer l’activité</Button>
        </form>
      </Card>
    </div>
  )
}
