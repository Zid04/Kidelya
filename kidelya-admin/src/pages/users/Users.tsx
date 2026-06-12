import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import PageHeader from '../../components/page/PageHeader'
import Card from '../../components/ui/Card'
import api from '../../api/axios'

interface User {
  iduser: number
  firstname: string
  lastname: string
  email: string
  role: { type: string }
  is_active: boolean
  credit_balance: number
}

interface AdminForm {
  firstname: string
  lastname: string
  email: string
  password: string
  password_confirmation: string
}

export default function Users() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [showAdminForm, setShowAdminForm] = useState(false)
  const [adminForm, setAdminForm] = useState<AdminForm>({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    password_confirmation: ''
  })
  const [formError, setFormError] = useState<string | null>(null)
  const [formSuccess, setFormSuccess] = useState<string | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await api.get('/users')
      return res.data.data
    }
  })

  const deactivateMutation = useMutation({
    mutationFn: async (id: number) => api.patch(`/users/${id}/deactivate`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] })
  })

  const activateMutation = useMutation({
    mutationFn: async (id: number) => api.patch(`/users/${id}/activate`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] })
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => api.delete(`/users/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] })
  })

  const createAdminMutation = useMutation({
    mutationFn: async (payload: AdminForm) => {
      await api.post('/admin/register', payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      setShowAdminForm(false)
      setFormSuccess('Admin créé avec succès !')
      setFormError(null)
      setAdminForm({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        password_confirmation: ''
      })
      setTimeout(() => setFormSuccess(null), 3000)
    },
    onError: () => {
      setFormError('Erreur lors de la création — vérifiez les champs.')
    }
  })

  const filtered = data?.filter((u: User) =>
    `${u.firstname} ${u.lastname} ${u.email} ${u.role?.type}`
      .toLowerCase()
      .includes(search.toLowerCase())
  ) ?? []

  return (
    <div className="p-8">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <PageHeader
          title="Utilisateurs"
          description="Gestion des comptes utilisateurs"
        />
        <button
          onClick={() => {
            setShowAdminForm(!showAdminForm)
            setFormError(null)
          }}
          className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          {showAdminForm ? 'Annuler' : '+ Nouvel admin'}
        </button>
      </div>

      {/* SUCCESS MESSAGE */}
      {formSuccess && (
        <div className="bg-green-900/30 border border-green-700 text-green-300 text-sm rounded-lg px-4 py-3 mb-4">
          {formSuccess}
        </div>
      )}

      {/* FORMULAIRE CRÉATION ADMIN */}
      {showAdminForm && (
        <Card className="p-6 mb-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
          <h2 className="text-base font-medium text-gray-900 dark:text-white mb-4">Créer un nouvel admin</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prénom</label>
              <input
                type="text"
                value={adminForm.firstname}
                onChange={e => setAdminForm({ ...adminForm, firstname: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
                placeholder="Jean"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nom</label>
              <input
                type="text"
                value={adminForm.lastname}
                onChange={e => setAdminForm({ ...adminForm, lastname: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
                placeholder="Dupont"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <input
                type="email"
                value={adminForm.email}
                onChange={e => setAdminForm({ ...adminForm, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
                placeholder="admin2@kidelya.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mot de passe</label>
              <input
                type="password"
                value={adminForm.password}
                onChange={e => setAdminForm({ ...adminForm, password: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirmer le mot de passe</label>
              <input
                type="password"
                value={adminForm.password_confirmation}
                onChange={e => setAdminForm({ ...adminForm, password_confirmation: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
                placeholder="••••••••"
              />
            </div>
          </div>

          {formError && (
            <div className="bg-red-900/30 border border-red-700 text-red-300 text-sm rounded-lg px-3 py-2 mt-4">
              {formError}
            </div>
          )}

          <div className="flex justify-end mt-4">
            <button
              onClick={() => createAdminMutation.mutate(adminForm)}
              disabled={createAdminMutation.isPending}
              className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-sm font-medium px-6 py-2 rounded-lg transition-colors"
            >
              {createAdminMutation.isPending ? 'Création...' : 'Créer l\'admin'}
            </button>
          </div>
        </Card>
      )}

      {/* SEARCH */}
      <Card className="p-4 mb-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
        <input
          type="text"
          placeholder="Rechercher un utilisateur..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
        />
      </Card>

      {/* TABLE */}
      <Card className="overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin h-8 w-8 border-b-2 border-purple-600 rounded-full" />
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Utilisateur</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Rôle</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Crédits</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filtered.map((user: User) => (
                <tr key={user.iduser} className="hover:bg-gray-50 dark:hover:bg-gray-800">

                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {user.firstname} {user.lastname}
                    </p>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{user.email}</td>

                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      user.role?.type === 'Admin'
                        ? 'bg-purple-900/30 text-purple-300'
                        : user.role?.type === 'Partner'
                        ? 'bg-blue-900/30 text-blue-300'
                        : 'bg-gray-800/40 text-gray-400'
                    }`}>
                      {user.role?.type ?? 'N/A'}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                    {user.credit_balance ?? 0} crédits
                  </td>

                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      user.is_active
                        ? 'bg-green-900/30 text-green-300'
                        : 'bg-gray-800/40 text-gray-400'
                    }`}>
                      {user.is_active ? 'Actif' : 'Désactivé'}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {user.is_active ? (
                        <button
                          onClick={() => deactivateMutation.mutate(user.iduser)}
                          className="text-xs px-3 py-1 border border-orange-300 dark:border-orange-700 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20 text-orange-600 dark:text-orange-300 transition"
                        >
                          Désactiver
                        </button>
                      ) : (
                        <button
                          onClick={() => activateMutation.mutate(user.iduser)}
                          className="text-xs px-3 py-1 border border-green-300 dark:border-green-700 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 text-green-600 dark:text-green-300 transition"
                        >
                          Activer
                        </button>
                      )}

                      <button
                        onClick={() => {
                          if (confirm('Supprimer cet utilisateur ?')) {
                            deleteMutation.mutate(user.iduser)
                          }
                        }}
                        className="text-xs px-3 py-1 border border-red-300 dark:border-red-700 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-300 transition"
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>

                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-400 dark:text-gray-500">
                    Aucun utilisateur trouvé
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
