import { Link } from "react-router-dom"

interface Props {
  onBuyPack: () => void
  buying: boolean
}

export function LockBanner({ onBuyPack, buying }: Props) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-[#E8DDD0] bg-[#F7F3EE] p-10 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#E94E6F]/10">
        <svg viewBox="0 0 24 24" className="h-7 w-7 text-[#E94E6F]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      </div>
      <h3 className="text-lg font-black text-[#21164F]">Contenu réservé</h3>
      <p className="max-w-sm text-sm text-gray-400">
        Achetez ce pack ou abonnez-vous pour accéder aux étapes et au matériel de cette activité.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <button
          onClick={onBuyPack}
          disabled={buying}
          className="rounded-xl bg-[#E94E6F] px-6 py-3 text-sm font-bold text-white hover:bg-[#d63f5f] disabled:opacity-60"
        >
          {buying ? "Redirection…" : "Acheter le pack"}
        </button>
        <Link
          to="/abonnements"
          className="rounded-xl border border-[#8F6BC8] px-6 py-3 text-sm font-bold text-[#2F236D] hover:bg-[#F5F0FF]"
        >
          Voir les abonnements
        </Link>
      </div>
    </div>
  )
}
