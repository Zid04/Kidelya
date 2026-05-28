import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import PageHeader from '../../components/page/PageHeader'
import Card from '../../components/ui/Card'
import api from '../../api/axios'

interface Activity {
  idactivities: number
  title: string
  description: string
  credit_price: number
  is_purchasable: boolean
  is_published: boolean

  // AJOUTS
  category: string
  difficulty: string
  agemin: number
  agemax: number
  duration: number
  photourl: string
}

export default function ActivitiesIndex() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['activities'],
    queryFn: async () => {
      const res = await api.get('/activities')
      return res.data.data
    }
  })

  const publishMutation = useMutation({
    mutationFn: async (id: number) => api.patch(`/activities/${id}/publish`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['activities'] })
  })

  const unpublishMutation = useMutation({
    mutationFn: async (id: number) => api.patch(`/activities/${id}/unpublish`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['activities'] })
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => api.delete(`/activities/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['activities'] })
  })

  const filtered = data?.filter((a: Activity) =>
    a.title?.toLowerCase().includes(search.toLowerCase())
  ) ?? []

  return (
    <div className="p-8">

      <PageHeader
        title="Activités"
        description="Gestion des activités et leur visibilité"
        actions={
          <Link
            to="/activities/create"
            className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
          >
            + Nouvelle activité
          </Link>
        }
      />

      {/* SEARCH */}
      <Card className="p-4 mb-4">
        <input
          type="text"
          placeholder="Rechercher une activité..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
        />
      </Card>

      {/* TABLE */}
      <Card className="overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium">Illustration</th>
                <th className="px-6 py-3 text-left text-xs font-medium">Activité</th>
                <th className="px-6 py-3 text-left text-xs font-medium">Catégorie</th>
                <th className="px-6 py-3 text-left text-xs font-medium">Difficulté</th>
                <th className="px-6 py-3 text-left text-xs font-medium">Âge</th>
                <th className="px-6 py-3 text-left text-xs font-medium">Durée</th>
                <th className="px-6 py-3 text-left text-xs font-medium">Prix crédits</th>
                <th className="px-6 py-3 text-left text-xs font-medium">Achat unitaire</th>
                <th className="px-6 py-3 text-left text-xs font-medium">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filtered.map((activity: Activity) => (
                <tr key={activity.idactivities} className="hover:bg-gray-50 dark:hover:bg-gray-800">

                  {/* Illustration */}
                  <td className="px-6 py-4">
                    {activity.photourl ? (
                      <img
                        src={activity.photourl}
                        className="w-12 h-12 rounded object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded" />
                    )}
                  </td>

                  {/* Titre + description */}
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-gray-500 line-clamp-1">{activity.description}</p>
                  </td>

                  {/* Catégorie */}
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                    {activity.category || '-'}
                  </td>

                  {/* Difficulté */}
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                    {activity.difficulty || '-'}
                  </td>

                  {/* Âge */}
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                    {activity.agemin && activity.agemax
                      ? `${activity.agemin} - ${activity.agemax} ans`
                      : '-'}
                  </td>

                  {/* Durée */}
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                    {activity.duration ? `${activity.duration} min` : '-'}
                  </td>

                  {/* Prix crédits */}
                  <td className="px-6 py-4 text-gray-900 dark:text-gray-100">
                    {activity.credit_price} crédits
                  </td>

                  {/* Achat unitaire */}
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      activity.is_purchasable
                        ? 'bg-blue-900/30 text-blue-300'
                        : 'bg-gray-800/40 text-gray-400'
                    }`}>
                      {activity.is_purchasable ? 'Oui' : 'Non'}
                    </span>
                  </td>

                  {/* Statut */}
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      activity.is_published
                        ? 'bg-green-900/30 text-green-300'
                        : 'bg-gray-800/40 text-gray-400'
                    }`}>
                      {activity.is_published ? 'Publié' : 'Brouillon'}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">

                      {activity.is_published ? (
                        <button
                          onClick={() => unpublishMutation.mutate(activity.idactivities)}
                          className="text-xs px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                          Dépublier
                        </button>
                      ) : (
                        <button
                          onClick={() => publishMutation.mutate(activity.idactivities)}
                          className="text-xs px-3 py-1 border border-green-300 rounded-lg hover:bg-green-50"
                        >
                          Publier
                        </button>
                      )}

                      <Link
                        to={`/activities/${activity.idactivities}/edit`}
                        className="text-xs px-3 py-1 border border-purple-300 rounded-lg hover:bg-purple-50"
                      >
                        Modifier
                      </Link>

                      <button
                        onClick={() => {
                          if (confirm('Supprimer cette activité ?')) {
                            deleteMutation.mutate(activity.idactivities)
                          }
                        }}
                        className="text-xs px-3 py-1 border border-red-300 rounded-lg hover:bg-red-50"
                      >
                        Supprimer
                      </button>

                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-6 py-10 text-center text-sm text-gray-400">
                    Aucune activité trouvée
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  )
}
