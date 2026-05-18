import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import PageHeader from '../../components/page/PageHeader'
import Card from '../../components/ui/Card'
import api from '../../api/axios'

interface Subscription {
  idpackuser: number
  user: { firstname: string; lastname: string; email: string }
  pack: { title: string; tarification: string }
  subscriptiondate: string
  expirationdate: string
  status: string
}

export default function Subscriptions() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const { data, isLoading } = useQuery({
    queryKey: ['subscriptions'],
    queryFn: async () => {
      const res = await api.get('/subscriptions')
      return res.data.data
    }
  })

  const deactivateMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.patch(`/subscriptions/${id}/deactivate`)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['subscriptions'] })
  })

  const renewMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.patch(`/subscriptions/${id}/renew`)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['subscriptions'] })
  })

  const filtered = data?.filter((s: Subscription) => {
    const matchSearch = `${s.user.firstname} ${s.user.lastname} ${s.pack.title}`
      .toLowerCase()
      .includes(search.toLowerCase())
    const matchFilter = filter === 'all' || s.status === filter
    return matchSearch && matchFilter
  }) ?? []

  const statusColor = (status: string) => {
    switch (status) {
      case 'active':   return 'bg-green-50 text-green-700'
      case 'inactive': return 'bg-gray-100 text-gray-500'
      case 'canceled': return 'bg-red-50 text-red-700'
      default:         return 'bg-gray-100 text-gray-500'
    }
  }

  return (
    <div className="p-8">
      <PageHeader
        title="Abonnements"
        description="Gestion des abonnements actifs et expirés"
      />

      {/* FILTRES */}
      <div className="flex gap-2 mb-4">
        {['all', 'active', 'inactive', 'canceled'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`text-sm px-4 py-2 rounded-lg border transition-colors ${
              filter === status
                ? 'bg-purple-600 text-white border-purple-600'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50'
            }`}
          >
            {status === 'all' ? 'Tous' : status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* RECHERCHE */}
      <Card className="p-4 mb-4">
        <input
          type="text"
          placeholder="Rechercher un utilisateur ou un pack..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </Card>

      {/* TABLE */}
      <Card className="overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin h-8 w-8 border-b-2 border-purple-600 rounded-full" />
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Utilisateur</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pack</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Début</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expiration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filtered.map((sub: Subscription) => (
                <tr key={sub.idpackuser} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {sub.user?.firstname} {sub.user?.lastname}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{sub.user?.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900 dark:text-white">{sub.pack?.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{sub.pack?.tarification} €</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {new Date(sub.subscriptiondate).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {new Date(sub.expirationdate).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor(sub.status)}`}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {sub.status === 'active' && (
                        <button
                          onClick={() => deactivateMutation.mutate(sub.idpackuser)}
                          className="text-xs px-3 py-1 border border-orange-200 rounded-lg hover:bg-orange-50 text-orange-600 transition"
                        >
                          Désactiver
                        </button>
                      )}
                      {sub.status === 'inactive' && (
                        <button
                          onClick={() => renewMutation.mutate(sub.idpackuser)}
                          className="text-xs px-3 py-1 border border-green-200 rounded-lg hover:bg-green-50 text-green-600 transition"
                        >
                          Renouveler
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-400">
                    Aucun abonnement trouvé
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