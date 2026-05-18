interface CardProps {
  children?: React.ReactNode
  className?: string
}

export default function Card({ children, className = '' }: CardProps) {
  return (
    <div
      className={`
        rounded-xl 
        border 
        border-gray-200 dark:border-gray-700 
        bg-white dark:bg-gray-900 
        shadow-sm 
        transition-colors 
        ${className}
      `}
    >
      {children}
    </div>
  )
}
