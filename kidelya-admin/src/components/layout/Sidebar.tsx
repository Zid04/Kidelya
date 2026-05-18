import SidebarItem from './SidebarItem'

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: '📊' },
  { path: '/statistics', label: 'Statistiques', icon: '📈' },
  { path: '/packs', label: 'Packs', icon: '📦' },
  { path: '/activities', label: 'Activités', icon: '🎯' },
  { path: '/subscriptions', label: 'Abonnements', icon: '💳' },
  { path: '/payments', label: 'Paiements', icon: '💰' },
  { path: '/coupons', label: 'Coupons', icon: '🎟️' },
  { path: '/users', label: 'Utilisateurs', icon: '👥' },
  { path: '/settings', label: 'Paramètres', icon: '⚙️' },
]

export default function Sidebar({ user, onLogout }: { user: any; onLogout: () => void }) {
  return (
    <aside className="w-60 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Kidelya</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400">Backoffice admin</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(item => (
          <SidebarItem key={item.path} {...item} />
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-gray-200 dark:border-gray-700">
        <div className="px-3 py-2 mb-2">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {user?.firstname} {user?.lastname}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
        </div>
        <button
          onClick={onLogout}
          className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
        >
          Se déconnecter
        </button>
      </div>
    </aside>
  )
}