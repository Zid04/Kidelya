import { useRef, useState } from "react"
import { Link } from "react-router-dom"

export default function GestionEnfantMenu() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const close = () => setOpen(false)

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-xl bg-[#273068] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1e2552]"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
        </svg>
        Gestion Enfant
        <svg viewBox="0 0 24 24" className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-30 mt-2 w-60 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl">

          <p className="px-4 pt-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-[#9CA3AF]">Enfants</p>
          <Link to="/children" onClick={close} className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#273068] hover:bg-[#EEF0F8]">
            <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
            Lister les enfants
          </Link>
          <Link to="/children/create" onClick={close} className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#273068] hover:bg-[#EEF0F8]">
            <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7M17 14v6M14 17h6"/></svg>
            Enregistrer un enfant
          </Link>

          <div className="mx-4 my-1.5 border-t border-gray-100"/>
          <p className="px-4 pt-1 pb-1 text-[10px] font-bold uppercase tracking-widest text-[#9CA3AF]">Parents / Tuteurs</p>
          <Link to="/guardians" onClick={close} className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#273068] hover:bg-[#EEF0F8]">
            <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            Lister les parents
          </Link>
          <Link to="/guardians/create" onClick={close} className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#273068] hover:bg-[#EEF0F8]">
            <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/><path d="M17 14v6M14 17h6"/></svg>
            Enregistrer un parent
          </Link>
          <Link to="/children" onClick={close} className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#273068] hover:bg-[#EEF0F8]">
            <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
            Lier un parent à un enfant
          </Link>

          <div className="mx-4 my-1.5 border-t border-gray-100"/>
          <p className="px-4 pt-1 pb-1 text-[10px] font-bold uppercase tracking-widest text-[#9CA3AF]">Groupes</p>
          <Link to="/groups" onClick={close} className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#273068] hover:bg-[#EEF0F8]">
            <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="6" height="10" rx="1"/><rect x="9" y="3" width="6" height="14" rx="1"/><rect x="16" y="7" width="6" height="10" rx="1"/>
            </svg>
            Lister les groupes
          </Link>
          <Link to="/groups/create" onClick={close} className="flex items-center gap-3 px-4 py-2.5 pb-3 text-sm text-[#273068] hover:bg-[#EEF0F8]">
            <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6M16 11h6"/>
            </svg>
            Créer un groupe
          </Link>
        </div>
      )}
    </div>
  )
}
