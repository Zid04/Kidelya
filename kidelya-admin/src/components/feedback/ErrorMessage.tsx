export default function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="bg-red-50 text-red-700 border border-red-200 px-4 py-3 rounded-lg text-sm">
      {message}
    </div>
  )
}
