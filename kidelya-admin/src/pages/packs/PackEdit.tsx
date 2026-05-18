import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageHeader from '../../components/page/PageHeader'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import api from '../../api/axios'

interface Activity {
  idactivities: number
  title: string
}

export default function PackEdit() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [pack, setPack] = useState<any>(null)
  const [activities, setActivities] = useState<Activity[]>([])
  const [availableActivities, setAvailableActivities] = useState<Activity[]>([])

  // FORM
  const [form, setForm] = useState({
    title: '',
    description: '',
    tarification: '',
    duration: '',
    type: 'monthly',
    illustration: '' 
  })

  // LOAD PACK + ACTIVITIES
  useEffect(() => {
    const load = async () => {
      const res = await api.get(`/packs/${id}`)
      const packData = res.data.data

      setPack(packData)

      setForm({
        title: packData.title,
        description: packData.description ?? '',
        tarification: packData.tarification,
        duration: packData.duration,
        type: packData.type,
        illustration: packData.illustration ?? '' 
      })

      setActivities(packData.activities ?? [])

      // Load all activities
      const all = await api.get('/activities')
      const allActivities = all.data.data

      // Filter out activities already in pack
      const available = allActivities.filter(
        (a: Activity) =>
          !packData.activities.some((pa: Activity) => pa.idactivities === a.idactivities)
      )

      setAvailableActivities(available)
      setLoading(false)
    }

    load()
  }, [id])

  // FORM CHANGE
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // SAVE PACK
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await api.put(`/packs/${id}`, form)
    navigate('/packs')
  }

  // ADD ACTIVITY
  const addActivity = async (activityId: number) => {
    await api.post(`/packs/${id}/add-activity`, { activity_id: activityId })

    const added = availableActivities.find(a => a.idactivities === activityId)
    setActivities([...activities, added!])
    setAvailableActivities(availableActivities.filter(a => a.idactivities !== activityId))
  }

  // REMOVE ACTIVITY
  const removeActivity = async (activityId: number) => {
    await api.delete(`/packs/${id}/remove-activity/${activityId}`)

    const removed = activities.find(a => a.idactivities === activityId)
    setAvailableActivities([...availableActivities, removed!])
    setActivities(activities.filter(a => a.idactivities !== activityId))
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
        title="Modifier un pack"
        description="Modifiez les informations du pack et gérez ses activités"
      />

      {/* FORMULAIRE PACK */}
      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Illustration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Illustration (URL)
            </label>
            <input
              name="illustration"
              value={form.illustration}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              placeholder="https://cdn.monsite.com/images/pack.png"
            />

            {/* Preview */}
            {form.illustration && (
              <img
                src={form.illustration}
                alt="Preview"
                className="mt-3 h-32 rounded-lg object-cover border"
              />
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
            />
          </div>

          <Button type="submit">Enregistrer</Button>
        </form>
      </Card>

      {/* ACTIVITÉS DU PACK */}
      <Card className="mt-8 p-6">
        <h2 className="text-lg font-semibold mb-4">Activités incluses dans ce pack</h2>

        {activities.length === 0 && (
          <p className="text-sm text-gray-500 mb-4">Aucune activité dans ce pack.</p>
        )}

        <ul className="space-y-2 mb-6">
          {activities.map(a => (
            <li key={a.idactivities} className="flex justify-between items-center">
              <span>{a.title}</span>
              <button
                onClick={() => removeActivity(a.idactivities)}
                className="text-xs px-3 py-1 border border-red-200 rounded-lg hover:bg-red-50 text-red-600"
              >
                Retirer
              </button>
            </li>
          ))}
        </ul>

        <h2 className="text-lg font-semibold mb-4">Ajouter une activité</h2>

        {availableActivities.length === 0 && (
          <p className="text-sm text-gray-500">Toutes les activités sont déjà dans ce pack.</p>
        )}

        <ul className="space-y-2">
          {availableActivities.map(a => (
            <li key={a.idactivities} className="flex justify-between items-center">
              <span>{a.title}</span>
              <button
                onClick={() => addActivity(a.idactivities)}
                className="text-xs px-3 py-1 border border-green-200 rounded-lg hover:bg-green-50 text-green-600"
              >
                Ajouter
              </button>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}
