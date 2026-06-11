import { Link } from "react-router-dom"

interface Child {
  idchildren: number
  firstname: string
  lastname?: string
}

interface Props {
  selectedDate: Date | null
  freeLimitReached: boolean
  saving: boolean
  saveSuccess: boolean
  saveError: string | null
  title: string
  startTime: string
  endTime: string
  childId: number | null
  children: Child[]
  onTitleChange: (v: string) => void
  onStartTimeChange: (v: string) => void
  onEndTimeChange: (v: string) => void
  onChildChange: (id: number | null) => void
  onSubmit: () => void
  onCancel: () => void
}

export default function PlanningForm({
  selectedDate, freeLimitReached, saving, saveSuccess, saveError,
  title, startTime, endTime, childId, children,
  onTitleChange, onStartTimeChange, onEndTimeChange, onChildChange,
  onSubmit, onCancel,
}: Props) {
  if (freeLimitReached) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center py-10 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#FFF5F7]">
          <svg viewBox="0 0 24 24" className="h-8 w-8 text-[#E94E6F]" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
          </svg>
        </div>
        <p className="font-semibold text-[#E94E6F]">Plan gratuit — 1 planning max</p>
        <p className="mt-2 text-sm text-[#9CA3AF]">Vous avez atteint la limite. Passez à un abonnement payant pour créer d'autres plannings.</p>
        <Link to="/abonnements" className="mt-4 inline-block rounded-xl bg-[#E94E6F] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#d63f5f]">
          Voir les abonnements
        </Link>
      </div>
    )
  }

  if (!selectedDate) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center py-10 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#EEF0F8]">
          <svg viewBox="0 0 24 24" className="h-8 w-8 text-[#273068]" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
          </svg>
        </div>
        <p className="font-semibold text-[#273068]">Choisissez une date</p>
        <p className="mt-1 text-sm text-[#9CA3AF]">Cliquez sur un jour du calendrier pour planifier une activité.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl bg-[#EEF0F8] px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#9CA3AF]">Date sélectionnée</p>
        <p className="mt-0.5 font-bold text-[#273068]">
          {selectedDate.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>

      {saveSuccess && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
          ✓ Planning créé avec succès !
        </div>
      )}
      {saveError && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
          {saveError}
        </div>
      )}

      <div>
        <label className="mb-1 block text-xs font-semibold text-[#273068]">Titre de l'activité *</label>
        <input type="text" value={title} onChange={(e) => onTitleChange(e.target.value)} placeholder="Ex : Atelier peinture"
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#E94E6F] focus:outline-none"/>
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold text-[#273068]">Créneau horaire</label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="mb-1 text-[11px] text-[#9CA3AF]">Début</p>
            <input type="time" value={startTime} onChange={(e) => onStartTimeChange(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#E94E6F] focus:outline-none"/>
          </div>
          <div>
            <p className="mb-1 text-[11px] text-[#9CA3AF]">Fin</p>
            <input type="time" value={endTime} onChange={(e) => onEndTimeChange(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#E94E6F] focus:outline-none"/>
          </div>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold text-[#273068]">Enfant concerné *</label>
        {children.length === 0 ? (
          <p className="text-xs text-[#9CA3AF]">
            Aucun enfant enregistré.{" "}
            <Link to="/children/create" className="font-semibold text-[#E94E6F] underline underline-offset-2">Ajouter un enfant</Link>
          </p>
        ) : (
          <select value={childId ?? ""} onChange={(e) => onChildChange(Number(e.target.value) || null)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#E94E6F] focus:outline-none">
            <option value="">Sélectionner un enfant</option>
            {children.map((c) => (
              <option key={c.idchildren} value={c.idchildren}>{c.firstname} {c.lastname ?? ""}</option>
            ))}
          </select>
        )}
      </div>

      <button onClick={onSubmit} disabled={saving || !title || !childId}
        className="mt-1 w-full rounded-xl bg-[#E94E6F] py-3 text-sm font-bold text-white transition-colors hover:bg-[#d63f5f] disabled:cursor-not-allowed disabled:opacity-50">
        {saving ? "Planification en cours…" : "Planifier"}
      </button>
      <button type="button" onClick={onCancel} className="text-center text-xs text-[#9CA3AF] hover:text-[#E94E6F]">Annuler</button>
    </div>
  )
}
