import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../api/axios'

interface Coupon {
  id: string
  name: string
  percent_off: number | null
  amount_off: number | null
  currency: string | null
  times_redeemed: number
  max_redemptions: number | null
  valid: boolean
  redeem_by: number | null
}

interface CouponForm {
  name: string
  discount_type: 'percent' | 'fixed'
  discount_value: string
  max_uses: string
  expires_at: string
}

export default function Coupons() {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [form, setForm] = useState<CouponForm>({
    name: '',
    discount_type: 'percent',
    discount_value: '',
    max_uses: '',
    expires_at: ''
  })

  const { data, isLoading } = useQuery({
    queryKey: ['coupons'],
    queryFn: async () => {
      const res = await api.get('/stripe/coupons')
      return res.data.data
    }
  })

  const createMutation = useMutation({
    mutationFn: async (payload: CouponForm) => {
      await api.post('/stripe/coupons', payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] })
      setShowForm(false)
      setSuccess('Coupon créé avec succès !')
      setForm({ name: '', discount_type: 'percent', discount_value: '', max_uses: '', expires_at: '' })
      setTimeout(() => setSuccess(null), 3000)
    }
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/stripe/coupons/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] })
      setSuccess('Coupon supprimé !')
      setTimeout(() => setSuccess(null), 3000)
    }
  })

  return (
    <div className="p-8">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Coupons & Promotions</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Gérez vos codes de réduction</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          {showForm ? 'Annuler' : '+ Nouveau coupon'}
        </button>
      </div>

      {/* SUCCESS MESSAGE */}
      {success && (
        <div className="bg-green-900/30 border border-green-700 text-green-300 text-sm rounded-lg px-4 py-3 mb-4">
          {success}
        </div>
      )}

      {/* FORM */}
      {showForm && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h2 className="text-base font-medium text-gray-900 dark:text-white mb-4">Créer un coupon</h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nom du coupon</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
                placeholder="PROMO20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type de réduction</label>
              <select
                value={form.discount_type}
                onChange={e => setForm({ ...form, discount_type: e.target.value as 'percent' | 'fixed' })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
              >
                <option value="percent">Pourcentage (%)</option>
                <option value="fixed">Montant fixe (€)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Valeur {form.discount_type === 'percent' ? '(%)' : '(€)'}
              </label>
              <input
                type="number"
                value={form.discount_value}
                onChange={e => setForm({ ...form, discount_value: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
                placeholder={form.discount_type === 'percent' ? '20' : '5'}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Utilisations max</label>
              <input
                type="number"
                value={form.max_uses}
                onChange={e => setForm({ ...form, max_uses: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
                placeholder="100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date d'expiration</label>
              <input
                type="date"
                value={form.expires_at}
                onChange={e => setForm({ ...form, expires_at: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <button
              onClick={() => createMutation.mutate(form)}
              disabled={createMutation.isPending}
              className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-sm font-medium px-6 py-2 rounded-lg transition-colors"
            >
              {createMutation.isPending ? 'Création...' : 'Créer le coupon'}
            </button>
          </div>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Nom</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Réduction</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Utilisations</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Expiration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {data?.map((coupon: Coupon) => (
                <tr key={coupon.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">

                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{coupon.name}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{coupon.id}</p>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                    {coupon.percent_off ? `${coupon.percent_off}%` : `${(coupon.amount_off ?? 0) / 100} €`}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                    {coupon.times_redeemed}
                    {coupon.max_redemptions ? ` / ${coupon.max_redemptions}` : ''}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {coupon.redeem_by
                      ? new Date(coupon.redeem_by * 1000).toLocaleDateString('fr-FR')
                      : '—'
                    }
                  </td>

                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      coupon.valid
                        ? 'bg-green-900/30 text-green-300'
                        : 'bg-red-900/30 text-red-300'
                    }`}>
                      {coupon.valid ? 'Actif' : 'Expiré'}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <button
                      onClick={() => {
                        if (confirm('Supprimer ce coupon ?')) {
                          deleteMutation.mutate(coupon.id)
                        }
                      }}
                      className="text-xs px-3 py-1 border border-red-300 dark:border-red-700 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-300 transition"
                    >
                      Supprimer
                    </button>
                  </td>

                </tr>
              ))}

              {!data?.length && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-400 dark:text-gray-500">
                    Aucun coupon créé pour l'instant
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
