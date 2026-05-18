interface Props {
  page: number
  totalPages: number
  onChange: (page: number) => void
}

export default function Pagination({ page, totalPages, onChange }: Props) {
  return (
    <div className="flex items-center justify-center gap-2 mt-4">
      <button
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        className="px-3 py-1 text-sm border rounded-lg disabled:opacity-50"
      >
        Précédent
      </button>

      <span className="text-sm text-gray-600">
        Page {page} / {totalPages}
      </span>

      <button
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
        className="px-3 py-1 text-sm border rounded-lg disabled:opacity-50"
      >
        Suivant
      </button>
    </div>
  )
}
