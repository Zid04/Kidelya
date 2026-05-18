import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageHeader from '../../components/page/PageHeader'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import api from '../../api/axios'

export default function ActivityEdit() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    title: '',
    description: '',
    credit_price: '',
    is_purchasable: false
  })

  useEffect(() => {
    api.get(`/activities/${id}`).then(res => {
      setForm(res.data.data)
      setLoading(false)
    })
  }, [id])

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await api.put(`/activities/${id}`, form)
    navigate('/activities')
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
      </div>
    )
  }

  return (
    <div className="p-8">

      <PageHeader
        title="Modifier une activité"
        description="Modifiez les informations de l’activité"
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

          <Button type="submit">Enregistrer</Button>
        </form>
      </Card>
    </div>
  )
}
