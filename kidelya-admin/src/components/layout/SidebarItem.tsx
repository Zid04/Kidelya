import { NavLink } from 'react-router-dom'

interface Props {
  path: string
  label: string
  icon: string
}

export default function SidebarItem({ path, label, icon }: Props) {
  return (
    <NavLink
      to={path}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
          isActive
            ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 font-medium'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
        }`
      }
    >
      <span>{icon}</span>
      {label}
    </NavLink>
  )
}