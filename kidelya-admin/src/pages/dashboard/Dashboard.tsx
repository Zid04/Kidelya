import { useQuery } from '@tanstack/react-query'
import PageHeader from '../../components/page/PageHeader'
import Card from '../../components/ui/Card'
import api from '../../api/axios'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts'

export default function Dashboard() {

  const { data: summary, isLoading: loadingSummary } = useQuery({
    queryKey: ['stats-summary'],
    queryFn: async () => {
      const res = await api.get('/stats/summary')
          console.log('summary raw:', res.data)
      return res.data.data
    }
  })

  const { data: stats, isLoading: loadingStats } = useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const res = await api.get('/stats')
       
      return res.data.data
    }
  })

  const { data: lastUsers } = useQuery({
    queryKey: ['last-users'],
    queryFn: async () => {
      const res = await api.get('/users')
  console.log('users raw:', res.data)
      return res.data.data?.slice(0, 5) ?? []
    }
  })

  const { data: lastSubs } = useQuery({
    queryKey: ['last-subs'],
    queryFn: async () => {
      const res = await api.get('/subscriptions')
        console.log('sum raw:', res.data)
      return res.data.data?.slice(0, 5) ?? []
    }
  })

  const cards = [
    {
      label: 'Abonnements actifs',
      value: summary?.total_active ?? 0,
      color: 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300'
    },
    {
      label: 'Revenus du mois',
      value: `${summary?.revenue_month ?? 0} €`,
      color: 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
    },
    {
      label: 'Nouveaux abonnés',
      value: summary?.new_subs ?? 0,
      color: 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
    },
    {
      label: 'Résiliations',
      value: summary?.churned ?? 0,
      color: 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300'
    },
  ]

  return (
    <div className="p-8">

      <PageHeader
        title="Dashboard"
        description="Vue d'ensemble de l'activité de la plateforme"
      />

      {/* CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {loadingSummary ? (
          [...Array(4)].map((_, i) => (
            <Card key={i} className="h-24 animate-pulse bg-gray-100 dark:bg-gray-800" />
          ))
        ) : (
          cards.map(card => (
            <Card key={card.label} className="p-6">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{card.label}</p>
              <p className={`text-2xl font-semibold px-2 py-1 rounded-lg inline-block ${card.color}`}>
                {card.value}
              </p>
            </Card>
          ))
        )}
      </div>

      {/* GRAPHIQUES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

        <Card className="p-6">
          <h2 className="text-base font-medium text-gray-900 dark:text-white mb-4">Abonnements actifs</h2>
          {loadingStats ? (
            <div className="flex items-center justify-center h-40">
              <div className="animate-spin h-8 w-8 border-b-2 border-purple-600 rounded-full" />
            </div>
          ) : stats && stats.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={stats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#ccc' }} />
                <YAxis tick={{ fontSize: 12, fill: '#ccc' }} />
                <Tooltip contentStyle={{ background: '#1f2937', border: 'none', color: '#fff' }} />
                <Line type="monotone" dataKey="total_active" stroke="#7c3aed" strokeWidth={2} dot={false} name="Actifs" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-40 text-sm text-gray-400">
              Pas encore de données
            </div>
          )}
        </Card>

        <Card className="p-6">
          <h2 className="text-base font-medium text-gray-900 dark:text-white mb-4">Revenus journaliers</h2>
          {loadingStats ? (
            <div className="flex items-center justify-center h-40">
              <div className="animate-spin h-8 w-8 border-b-2 border-purple-600 rounded-full" />
            </div>
          ) : stats && stats.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={stats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#ccc' }} />
                <YAxis tick={{ fontSize: 12, fill: '#ccc' }} />
                <Tooltip contentStyle={{ background: '#1f2937', border: 'none', color: '#fff' }} />
                <Bar dataKey="revenue" fill="#7c3aed" radius={[4, 4, 0, 0]} name="Revenus (€)" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-40 text-sm text-gray-400">
              Pas encore de données
            </div>
          )}
        </Card>

      </div>

      {/* TABLEAUX */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <Card className="p-6">
          <h2 className="text-base font-medium text-gray-900 dark:text-white mb-4">Derniers utilisateurs inscrits</h2>
          <table className="w-full text-sm">
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {lastUsers?.map((u: any) => (
                <tr key={u.iduser} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="py-3">
                    <p className="font-medium text-gray-900 dark:text-white">{u.firstname} {u.lastname}</p>
                    <p className="text-gray-500 dark:text-gray-400 text-xs">{u.email}</p>
                  </td>
                </tr>
              ))}
              {(!lastUsers || lastUsers.length === 0) && (
                <tr>
                  <td className="py-6 text-center text-gray-400">Aucun utilisateur récent</td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>

        <Card className="p-6">
          <h2 className="text-base font-medium text-gray-900 dark:text-white mb-4">Derniers abonnements créés</h2>
          <table className="w-full text-sm">
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {lastSubs?.map((s: any) => (
                <tr key={s.idpackuser} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="py-3">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {s.user?.firstname} {s.user?.lastname}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-xs">{s.pack?.title}</p>
                  </td>
                </tr>
              ))}
              {(!lastSubs || lastSubs.length === 0) && (
                <tr>
                  <td className="py-6 text-center text-gray-400">Aucun abonnement récent</td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>

      </div>
    </div>
  )
}