export default function TopBar({ title, actions }: { title: string; actions?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
      <div>{actions}</div>
    </div>
  )
}
