import { useQuery, useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import api from '../api/axios'

interface Payment {
  id: string
  amount: number
  currency: string
  status: string
  email: string
  created_at: string
  refunded: boolean
}

export default function Payments() {
  const [refundSuccess, setRefundSuccess] = useState<string | null>(null)

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['payments'],
    queryFn: async () => {
      const res = await api.get('/stripe/payments')
      return res.data.data
    }
  })

  const refundMutation = useMutation({
    mutationFn: async (paymentIntent: string) => {
      await api.post('/stripe/refund', { payment_intent: paymentIntent })
    },
    onSuccess: () => {
      setRefundSuccess('Remboursement effectué avec succès !')
      refetch()
      setTimeout(() => setRefundSuccess(null), 3000)
    }
  })

  const statusColor = (status: string, refunded: boolean) => {
    if (refunded) return 'bg-orange-900/30 text-orange-300'
    switch (status) {
      case 'succeeded': return 'bg-green-900/30 text-green-300'
      case 'failed': return 'bg-red-900/30 text-red-300'
      case 'pending': return 'bg-yellow-900/30 text-yellow-300'
      default: return 'bg-gray-800/40 text-gray-400'
    }
  }

  const statusLabel = (status: string, refunded: boolean) => {
    if (refunded) return 'Remboursé'
    switch (status) {
      case 'succeeded': return 'Payé'
      case 'failed': return 'Échoué'
      case 'pending': return 'En attente'
      default: return status
    }
  }

  return (
    <div className="p-8">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Paiements</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Historique des paiements Stripe</p>
      </div>

      {/* SUCCESS MESSAGE */}
      {refundSuccess && (
        <div className="bg-green-900/30 border border-green-700 text-green-300 text-sm rounded-lg px-4 py-3 mb-4">
          {refundSuccess}
        </div>
      )}

      {/* TABLE */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin h-8 w-8 border-b-2 border-purple-600 rounded-full" />
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Montant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {data?.map((payment: Payment) => (
                <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">

                  {/* Email */}
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                    {payment.email ?? '—'}
                  </td>

                  {/* Montant */}
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                    {payment.amount} {payment.currency}
                  </td>

                  {/* Statut */}
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor(payment.status, payment.refunded)}`}>
                      {statusLabel(payment.status, payment.refunded)}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {payment.created_at}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    {payment.status === 'succeeded' && !payment.refunded && (
                      <button
                        onClick={() => {
                          if (confirm('Rembourser ce paiement ?')) {
                            refundMutation.mutate(payment.id)
                          }
                        }}
                        disabled={refundMutation.isPending}
                        className="text-xs px-3 py-1 border border-orange-300 dark:border-orange-700 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20 text-orange-600 dark:text-orange-300 transition disabled:opacity-50"
                      >
                        Rembourser
                      </button>
                    )}
                  </td>

                </tr>
              ))}

              {!data?.length && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-sm text-gray-400 dark:text-gray-500">
                    Aucun paiement trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
