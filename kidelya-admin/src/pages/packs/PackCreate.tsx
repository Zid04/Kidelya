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
    illustration: '' 
  })

  const [loading, setLoading] = useState(false)

 const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
) => {
  setForm({ ...form, [e.target.name]: e.target.value })
}

const handleSubmit = async (
  e: React.FormEvent<HTMLFormElement>
) => {
  e.preventDefault()
  setLoading(true)

  const res = await api.post('/packs', form)
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

          {/* Illustration (URL) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Illustration (URL)
            </label>
            <input
              name="illustration"
              value={form.illustration}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              placeholder="https://cdn.monsite.com/images/pack1.png"
            />
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
