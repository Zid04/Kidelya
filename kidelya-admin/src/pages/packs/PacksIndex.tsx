import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import PageHeader from '../../components/page/PageHeader'
import Card from '../../components/ui/Card'
import api from '../../api/axios'

interface Pack {
  idpack: number
  title: string
  description: string
  tarification: number
  duration: number
  is_published: boolean
  type: string
  illustration?: string | null // 🔥 ajouté
}

export default function PacksIndex() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['packs'],
    queryFn: async () => {
      const res = await api.get('/packs')
      return res.data.data
    }
  })

  const publishMutation = useMutation({
    mutationFn: async (id: number) => api.patch(`/packs/${id}/publish`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['packs'] })
  })

  const unpublishMutation = useMutation({
    mutationFn: async (id: number) => api.patch(`/packs/${id}/unpublish`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['packs'] })
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => api.delete(`/packs/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['packs'] })
  })

  const filtered = data?.filter((p: Pack) =>
    p.title?.toLowerCase().includes(search.toLowerCase())
  ) ?? []

  return (
    <div className="p-8">

      <PageHeader
        title="Packs"
        description="Gestion des packs d'abonnement"
        actions={
          <Link
            to="/packs/create"
            className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
          >
            + Nouveau pack
          </Link>
        }
      />

      {/* SEARCH */}
      <Card className="p-4 mb-4">
        <input
          type="text"
          placeholder="Rechercher un pack..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
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
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Illustration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pack</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prix</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Durée</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filtered.map((pack: Pack) => (
                <tr key={pack.idpack} className="hover:bg-gray-50">

                  {/* Illustration */}
                  <td className="px-6 py-4">
                    <img
                      src={pack.illustration || 'https://via.placeholder.com/60?text=No+Img'}
                      alt={pack.title}
                      className="h-12 w-12 rounded-lg object-cover border"
                    />
                  </td>

                  {/* Pack info */}
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">{pack.title}</p>
                    <p className="text-xs text-gray-500 line-clamp-1">{pack.description}</p>
                  </td>

                  <td className="px-6 py-4">
                    <span className="text-xs px-2 py-1 rounded-full bg-purple-50 text-purple-700 font-medium capitalize">
                      {pack.type}
                    </span>
                  </td>

                  <td className="px-6 py-4">{pack.tarification} €</td>

                  <td className="px-6 py-4">{pack.duration} jours</td>

                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      pack.is_published ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {pack.is_published ? 'Publié' : 'Brouillon'}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">

                      {pack.is_published ? (
                        <button
                          onClick={() => unpublishMutation.mutate(pack.idpack)}
                          className="text-xs px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600 transition"
                        >
                          Dépublier
                        </button>
                      ) : (
                        <button
                          onClick={() => publishMutation.mutate(pack.idpack)}
                          className="text-xs px-3 py-1 border border-green-200 rounded-lg hover:bg-green-50 text-green-600 transition"
                        >
                          Publier
                        </button>
                      )}

                      <Link
                        to={`/packs/${pack.idpack}/edit`}
                        className="text-xs px-3 py-1 border border-purple-200 rounded-lg hover:bg-purple-50 text-purple-600 transition"
                      >
                        Modifier
                      </Link>

                      <button
                        onClick={() => {
                          if (confirm('Supprimer ce pack ?')) {
                            deleteMutation.mutate(pack.idpack)
                          }
                        }}
                        className="text-xs px-3 py-1 border border-red-200 rounded-lg hover:bg-red-50 text-red-600 transition"
                      >
                        Supprimer
                      </button>

                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-sm text-gray-400">
                    Aucun pack trouvé
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
