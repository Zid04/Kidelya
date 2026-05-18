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
    credit_price: '',
    is_purchasable: false
  })

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value })
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
        description="Ajoutez une nouvelle activité"
      />

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Titre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
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
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Prix crédits */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prix en crédits</label>
            <input
              name="credit_price"
              type="number"
              value={form.credit_price}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
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
