interface TableProps {
  children: React.ReactNode
  className?: string
}

export default function Table({ children, className = '' }: TableProps) {
  return (
    <table className={`w-full ${className}`}>
      {children}
    </table>
  )
}
