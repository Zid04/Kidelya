interface PageHeaderProps {
  title: string
  description?: string
  actions?: React.ReactNode
  className?: string
}

export default function PageHeader({ title, description, actions, className = '' }: PageHeaderProps) {
  return (
    <div className={`flex items-center justify-between mb-8 ${className}`}>
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          {title}
        </h1>

        {description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {description}
          </p>
        )}
      </div>

      {actions}
    </div>
  )
}
