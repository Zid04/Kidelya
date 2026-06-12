import { Link } from "react-router-dom"
import { PackArtwork } from "@/components/kidelya/PackArtwork"
import type { Activity } from "./types"

interface Props {
  activity: Activity
  canAccess: boolean
  buying: boolean
  image: string | null
  onBuyPack: () => void
  onBack: () => void
}

export function ActivityHero({ activity, canAccess, buying, image, onBuyPack, onBack }: Props) {
  return (
    <>
      {/* Breadcrumb */}
      <nav className="mb-5 flex items-center gap-2 text-xs text-[#273068]">
        <Link to="/dashboard" className="hover:text-[#7C67B2]">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </Link>
        <span>›</span>
        <Link to="/packs" className="hover:text-[#7C67B2]">Packs</Link>
        <span>›</span>
        <span className="font-semibold text-[#7C67B2]">{activity.title}</span>
      </nav>

      {/* Hero card */}
      <div className="mb-6 overflow-hidden rounded-2xl bg-[#FFFEFA] shadow-sm">
        <div className="flex flex-col gap-6 p-5 sm:p-6 lg:flex-row">

          <div className="flex-1">
            {canAccess ? (
              <span className="mb-3 inline-block rounded-full bg-[#D5CDE2] px-3 py-0.5 text-xs font-bold text-[#7C67B2]">
                Débloquée
              </span>
            ) : (
              <span className="mb-3 inline-block rounded-full bg-[#F1B9C3] px-3 py-0.5 text-xs font-bold text-[#E94E6F]">
                Activité du pack
              </span>
            )}
            <h1 className="text-3xl font-black text-[#7C67B2]">{activity.title}</h1>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              {activity.agemin != null && activity.agemax != null && (
                <span className="rounded-full bg-[#F1B9C3] px-3 py-1 text-xs font-bold text-[#E94E6F]">
                  {activity.agemin} - {activity.agemax} ans
                </span>
              )}
              {activity.category && (
                <span className="rounded-full bg-[#CDC1DC] px-3 py-1 text-xs font-bold text-[#273068]">
                  {activity.category}
                </span>
              )}
              {activity.duration && (
                <span className="flex items-center gap-1 text-xs font-bold text-[#7BA7C0]">
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                  </svg>
                  {activity.duration} min
                </span>
              )}
            </div>

            {activity.description && (
              <p className="mt-4 max-w-lg text-sm leading-6 text-[#273068]">{activity.description}</p>
            )}

            <div className="mt-5 flex gap-3">
              {canAccess ? (
                <span className="flex items-center gap-2 rounded-xl bg-[#D5CDE2] px-5 py-2.5 text-sm font-bold text-[#7C67B2]">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  Activité débloquée
                </span>
              ) : (
                <button
                  onClick={onBuyPack}
                  disabled={buying}
                  className="flex items-center gap-2 rounded-xl bg-[#E94E6F] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#d63f5f] disabled:opacity-60"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  {buying ? "Redirection…" : "Acheter le pack"}
                </button>
              )}
              <button
                onClick={onBack}
                className="rounded-xl bg-[#D5CDE2] px-5 py-2.5 text-sm font-semibold text-[#273068] hover:bg-[#c5bbd2]"
              >
                Retour
              </button>
            </div>
          </div>

          <div className="hidden w-[340px] shrink-0 overflow-hidden rounded-xl lg:block">
            {image ? (
              <img src={image} alt={activity.title} className="h-full w-full object-cover" style={{ minHeight: 220 }} />
            ) : (
              <PackArtwork title={activity.title} className="h-full min-h-[220px]" />
            )}
          </div>
        </div>
      </div>
    </>
  )
}
