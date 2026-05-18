import { useQuery } from '@tanstack/react-query'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar
} from 'recharts'
import api from '../../api/axios'

interface StatRow {
  idstat: number
  date: string
  total_active: number
  total_expired: number
  new_subscriptions: number
  churned: number
  revenue: number
}

export default function Statistics() {
  const { data: stats, isLoading } = useQuery<StatRow[]>({
    queryKey: ['stats'],
    queryFn: async () => {
      const res = await api.get('/stats')
      return res.data.data
    }
  })

  const { data: summary } = useQuery({
    queryKey: ['stats-summary'],
    queryFn: async () => {
      const res = await api.get('/stats/summary')
      return res.data
    }
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
      </div>
    )
  }

  const cards = [
    { label: 'Abonnements actifs', value: summary?.total_active ?? 0, color: 'text-purple-300 bg-purple-900/30 dark:text-purple-300 dark:bg-purple-900/30' },
    { label: 'Revenus du mois', value: `${summary?.revenue_month ?? 0} €`, color: 'text-green-300 bg-green-900/30 dark:text-green-300 dark:bg-green-900/30' },
    { label: 'Nouveaux ce mois', value: summary?.new_subs ?? 0, color: 'text-blue-300 bg-blue-900/30 dark:text-blue-300 dark:bg-blue-900/30' },
    { label: 'Résiliations', value: summary?.churned ?? 0, color: 'text-red-300 bg-red-900/30 dark:text-red-300 dark:bg-red-900/30' },
  ]

  return (
    <div className="p-8">

      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Statistiques</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Suivi des abonnements et revenus</p>
      </div>

      {/* Cards résumé */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map(card => (
          <div key={card.label} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{card.label}</p>
            <p className={`text-2xl font-semibold px-2 py-1 rounded-lg inline-block ${card.color}`}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Graphique abonnements actifs */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-4">
        <h2 className="text-base font-medium text-gray-900 dark:text-white mb-6">Évolution des abonnements actifs</h2>

        {stats && stats.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={stats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#ccc' }} />
              <YAxis tick={{ fontSize: 12, fill: '#ccc' }} />
              <Tooltip contentStyle={{ background: '#1f2937', border: 'none', color: '#fff' }} />
              <Line type="monotone" dataKey="total_active" stroke="#7c3aed" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-40 text-sm text-gray-400">
            Pas encore de données
          </div>
        )}
      </div>

      {/* Graphique revenus et nouveaux abonnés */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-base font-medium text-gray-900 dark:text-white mb-6">Revenus journaliers</h2>

          {stats && stats.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#ccc' }} />
                <YAxis tick={{ fontSize: 12, fill: '#ccc' }} />
                <Tooltip contentStyle={{ background: '#1f2937', border: 'none', color: '#fff' }} />
                <Bar dataKey="revenue" fill="#7c3aed" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-32 text-sm text-gray-400">
              Pas encore de données
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-base font-medium text-gray-900 dark:text-white mb-6">Nouveaux vs résiliations</h2>

          {stats && stats.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#ccc' }} />
                <YAxis tick={{ fontSize: 12, fill: '#ccc' }} />
                <Tooltip contentStyle={{ background: '#1f2937', border: 'none', color: '#fff' }} />
                <Bar dataKey="new_subscriptions" fill="#22c55e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="churned" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-32 text-sm text-gray-400">
              Pas encore de données
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
