import { Link } from "react-router-dom"
import type { Planning } from "@/types/Planning"

interface Props {
  planning: Planning
  isPast: boolean
}

export default function PlanningCard({ planning: p, isPast }: Props) {
  return (
    <Link
      to={`/plannings/${p.idplanning}`}
      className={`block bg-white rounded-2xl border shadow-sm p-5 hover:shadow-md transition-all group ${
        isPast ? "border-[#6F8D4C]/30 hover:border-[#6F8D4C]" : "border-gray-100 hover:border-[#E94E6F]/40"
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isPast ? "bg-[#F0F7EB]" : "bg-[#EEF0F8]"}`}>
          <svg viewBox="0 0 24 24" className={`h-5 w-5 ${isPast ? "text-[#6F8D4C]" : "text-[#273068]"}`}
            fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
          </svg>
        </div>

        {isPast ? (
          <span className="flex items-center gap-1 rounded-full bg-[#6F8D4C] px-2.5 py-1 text-[10px] font-bold text-white">
            <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            Compte-rendu
          </span>
        ) : (
          <span className="text-xs text-[#9CA3AF] group-hover:text-[#E94E6F] transition-colors">Voir →</span>
        )}
      </div>

      <p className="font-semibold text-[#273068] truncate">{p.title}</p>

      {p.date && (
        <p className="text-sm mt-1 text-[#6F8D4C]">
          {new Date(p.date).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
        </p>
      )}

      {(p.start_time || p.end_time) && (
        <p className="text-xs text-[#9CA3AF] mt-0.5">
          {p.start_time}{p.start_time && p.end_time ? " → " : ""}{p.end_time}
        </p>
      )}

      {isPast && (
        <p className="mt-3 text-xs font-semibold text-[#6F8D4C]">
          Cliquez pour rédiger ou modifier le compte-rendu →
        </p>
      )}
    </Link>
  )
}
