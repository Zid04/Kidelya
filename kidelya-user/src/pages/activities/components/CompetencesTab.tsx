interface Props {
  competences: { idcompetence: number; name: string }[]
}

export function CompetencesTab({ competences }: Props) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h2 className="mb-4 font-black text-[#21164F]">Compétences développées</h2>
      {competences.length === 0 ? (
        <p className="text-gray-400">Aucune compétence associée.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {competences.map((c) => (
            <div key={c.idcompetence} className="flex items-center gap-2 rounded-xl bg-[#EEF0F8] px-4 py-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#8F6BC8] text-white">
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3l1.8 4.5L18 9.3l-4.2 1.7L12 15.5 10.2 11 6 9.3l4.2-1.8L12 3z" />
                </svg>
              </span>
              <span className="text-xs font-semibold text-[#273068]">{c.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
