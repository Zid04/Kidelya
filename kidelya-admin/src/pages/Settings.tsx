import { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import api from '../api/axios'
import { useTheme } from "../context/ThemeContext"

interface Settings {
  app_name: string
  contact_email: string
  stripe_enabled: string
  appearance: string
}

export default function Settings() {
  const [success, setSuccess] = useState<string | null>(null)
  const { updateTheme } = useTheme()

  const [form, setForm] = useState<Settings>({
    app_name: '',
    contact_email: '',
    stripe_enabled: 'true',
    appearance: 'light',
  })

  const { data, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const res = await api.get('/settings')
      return res.data.data
    }
  })

  // Remplit le formulaire SANS changer le thème global
  useEffect(() => {
    if (data) {
      setForm({
        app_name: data.app_name ?? '',
        contact_email: data.contact_email ?? '',
        stripe_enabled: data.stripe_enabled ?? 'true',
        appearance: data.appearance ?? 'light',
      })
    }
  }, [data])

  const updateMutation = useMutation({
    mutationFn: async (payload: Settings) => {
      await api.patch('/settings', payload)
    },
    onSuccess: () => {
      setSuccess('Paramètres mis à jour avec succès !')
      setTimeout(() => setSuccess(null), 3000)
    }
  })

  if (isLoading) return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin h-8 w-8 border-b-2 border-purple-600 rounded-full" />
    </div>
  )

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Paramètres</h1>
        <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">Configuration générale de la plateforme</p>
      </div>

      {success && (
        <div className="bg-green-900/30 border border-green-700 text-green-300 text-sm rounded-lg px-4 py-3 mb-6">
          {success}
        </div>
      )}

      {/* Informations générales */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-4">
        <h2 className="text-base font-medium text-gray-900 dark:text-white mb-4">Informations générales</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nom de la plateforme
            </label>
            <input
              type="text"
              value={form.app_name}
              onChange={e => setForm({ ...form, app_name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Kidelya"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email de contact
            </label>
            <input
              type="email"
              value={form.contact_email}
              onChange={e => setForm({ ...form, contact_email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="contact@kidelya.com"
            />
          </div>
        </div>
      </div>

      {/* Apparence */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-4">
        <h2 className="text-base font-medium text-gray-900 dark:text-white mb-4">Apparence</h2>

        <div className="flex gap-3">

          {/* Thème clair */}
          <button
            onClick={() => {
              setForm({ ...form, appearance: 'light' })
              updateTheme('light')   // applique le thème immédiatement
            }}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-colors ${
              form.appearance === 'light'
                ? 'border-purple-500 bg-purple-50 text-purple-700'
                : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <span>☀️</span>
            <span className="text-sm font-medium">Thème clair</span>
          </button>

          {/* Thème sombre */}
          <button
            onClick={() => {
              setForm({ ...form, appearance: 'dark' })
              updateTheme('dark')   // applique le thème immédiatement
            }}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-colors ${
              form.appearance === 'dark'
                ? 'border-purple-500 bg-purple-50 text-purple-700'
                : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <span>🌙</span>
            <span className="text-sm font-medium">Thème sombre</span>
          </button>

        </div>
      </div>

      {/* Stripe */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <h2 className="text-base font-medium text-gray-900 dark:text-white mb-4">Paiement Stripe</h2>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">Activer les paiements Stripe</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Désactiver empêche tout nouveau paiement sur la plateforme
            </p>
          </div>

          <button
            onClick={() => setForm({
              ...form,
              stripe_enabled: form.stripe_enabled === 'true' ? 'false' : 'true'
            })}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              form.stripe_enabled === 'true' ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
            }`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              form.stripe_enabled === 'true' ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
        </div>
      </div>

      {/* Bouton sauvegarder */}
      <div className="flex justify-end">
        <button
          onClick={() => updateMutation.mutate(form)}
          disabled={updateMutation.isPending}
          className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-sm font-medium px-6 py-2 rounded-lg transition-colors"
        >
          {updateMutation.isPending ? 'Sauvegarde...' : 'Sauvegarder les paramètres'}
        </button>
      </div>
    </div>
  )
}
