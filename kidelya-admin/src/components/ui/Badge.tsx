interface BadgeProps {
  color?: 'purple' | 'green' | 'red' | 'gray'
  children: React.ReactNode
}

export default function Badge({ color = 'gray', children }: BadgeProps) {
  const colors = {
    purple: 'bg-purple-50 text-purple-700',
    green: 'bg-green-50 text-green-700',
    red: 'bg-red-50 text-red-700',
    gray: 'bg-gray-100 text-gray-600',
  }

  return (
    <span className={`text-xs px-2 py-1 rounded-full font-medium ${colors[color]}`}>
      {children}
    </span>
  )
}
