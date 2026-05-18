export default function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center text-sm text-gray-400 py-10">
      {message}
    </div>
  )
}
