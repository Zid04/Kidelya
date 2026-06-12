import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import api from "@/api/axios"

interface Activity {
  idactivities: number
  title: string
  photourl?: string | null
}

export default function GroupAddActivity() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [activities, setActivities] = useState<Activity[]>([])
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/activities/mine")
        setActivities(res.data.data || [])
      } catch {
        setError("Impossible de charger les activités.")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedId) {
      setError("Veuillez sélectionner une activité.")
      return
    }

    setSaving(true)
    setError(null)

    try {
      await api.post(`/groups/${id}/activities`, { activity_id: selectedId })
      navigate(`/groups/${id}`)
    } catch {
      setError("Impossible d'ajouter l'activité au groupe.")
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#6F8D4C]">
        Chargement…
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white px-6 py-10 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold text-[#93197D] mb-8">
        Ajouter une activité au groupe
      </h1>

      {error && (
        <div className="mb-4 text-[#E94E6F] font-semibold">{error}</div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm border border-[#FDC600]/40 p-6 space-y-4"
      >
        {activities.length === 0 ? (
          <p className="text-[#6F8D4C]">Aucune activité disponible.</p>
        ) : (
          <div className="space-y-3">
            {activities.map((activity) => (
              <label
                key={activity.idactivities}
                className="flex items-center gap-3 bg-[#FFF3E0] p-3 rounded-lg cursor-pointer hover:bg-[#FFE8C2]"
              >
                <input
                  type="radio"
                  name="activity"
                  checked={selectedId === activity.idactivities}
                  onChange={() => setSelectedId(activity.idactivities)}
                />

                {activity.photourl ? (
                  <img
                    src={activity.photourl}
                    alt={activity.title}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-[#93197D] font-bold">
                    {activity.title[0]}
                  </div>
                )}

                <span className="text-[#93197D] font-semibold">
                  {activity.title}
                </span>
              </label>
            ))}
          </div>
        )}

        <div className="flex gap-4 mt-4">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 px-4 py-3 bg-[#E94E6F] text-white rounded-lg font-semibold hover:bg-[#d63f5f] disabled:opacity-50"
          >
            {saving ? "Ajout…" : "Ajouter"}
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 px-4 py-3 bg-white border border-[#93197D] text-[#93197D] rounded-lg font-semibold hover:bg-[#FFF3E0]"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  )
}
