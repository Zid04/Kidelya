export default function PageContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-8 min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white">
      {children}
    </div>
  )
}