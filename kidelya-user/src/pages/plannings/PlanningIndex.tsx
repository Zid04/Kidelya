import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import api from "@/api/axios"
import { useAuth } from "@/context/useAuth"

// ── Notifications au démarrage ──────────────────────────────────────────────
function requestNotifPermission() {
  if ("Notification" in window && Notification.permission === "default") {
    Notification.requestPermission()
  }
}

function fireNotification(title: string, body: string) {
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification(title, { body, icon: "/favicon.ico" })
  }
}

interface PlanningItem {
  idplanning: number
  title: string
  date: string | null
  start_time: string | null
  end_time: string | null
}

interface Child {
  idchildren: number
  firstname: string
  lastname?: string
  avatar?: string | null
}

// ── Helpers calendrier ──────────────────────────────────────────────────────
const MONTHS_FR = [
  "Janvier","Février","Mars","Avril","Mai","Juin",
  "Juillet","Août","Septembre","Octobre","Novembre","Décembre",
]
const DAYS_FR = ["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"]

function daysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate() }
// Lundi = 0, Dimanche = 6
function firstWeekday(y: number, m: number) { return (new Date(y, m, 1).getDay() + 6) % 7 }

// ── Composant principal ─────────────────────────────────────────────────────
export default function PlanningIndex() {

  const { user } = useAuth()
  const isFree = !user?.plan

  // Calendrier
  const today = new Date()
  const [month, setMonth] = useState(today.getMonth())
  const [year, setYear]   = useState(today.getFullYear())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  // Formulaire
  const [title,     setTitle]     = useState("")
  const [startTime, setStartTime] = useState("09:00")
  const [endTime,   setEndTime]   = useState("10:00")
  const [childId,   setChildId]   = useState<number | null>(null)
  const [children,  setChildren]  = useState<Child[]>([])

  // UI
  const [menuOpen,    setMenuOpen]    = useState(false)
  const [saving,      setSaving]      = useState(false)
  const [saveError,   setSaveError]   = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [plannings,   setPlannings]   = useState<PlanningItem[]>([])
  const menuRef      = useRef<HTMLDivElement>(null)
  const notifiedRef  = useRef<Set<number>>(new Set())

  const loadPlannings = () =>
    api.get("/plannings")
      .then(res => setPlannings(res.data.data ?? res.data ?? []))
      .catch(() => {})

  // Fermer le menu si clic ailleurs
  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener("mousedown", onOutside)
    return () => document.removeEventListener("mousedown", onOutside)
  }, [])

  // Charger les enfants et les plannings + demander permission notifications
  useEffect(() => {
    requestNotifPermission()
    api.get("/children")
      .then(res => setChildren(res.data.data ?? res.data ?? []))
      .catch(() => {})
    loadPlannings()
  }, [])

  // Vérifier toutes les minutes si un planning commence bientôt ou maintenant
  useEffect(() => {
    const check = () => {
      const now = new Date()
      const todayStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}`
      const currentTime = `${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`

      // Heure dans 30 minutes
      const in30 = new Date(now.getTime() + 30 * 60_000)
      const in30Time = `${String(in30.getHours()).padStart(2,"0")}:${String(in30.getMinutes()).padStart(2,"0")}`

      plannings.forEach(p => {
        if (!p.start_time || !p.date) return
        const planDate = p.date.slice(0, 10)
        const planTime = p.start_time.slice(0, 5)

        if (planDate !== todayStr) return

        // Notification 30 min avant
        const key30 = `${p.idplanning}-30min`
        if (planTime === in30Time && !notifiedRef.current.has(key30)) {
          notifiedRef.current.add(key30)
          fireNotification(`⏰ Dans 30 min — ${p.title}`, "Votre activité planifiée commence dans 30 minutes.")
        }

        // Notification à l'heure exacte
        const keyNow = `${p.idplanning}-now`
        if (planTime === currentTime && !notifiedRef.current.has(keyNow)) {
          notifiedRef.current.add(keyNow)
          fireNotification(`🌸 C'est l'heure ! — ${p.title}`, "L'heure de votre activité planifiée est arrivée !")
        }
      })
    }

    check()
    const interval = setInterval(check, 60_000)
    return () => clearInterval(interval)
  }, [plannings])

  // Navigation mois
  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1) } else setMonth(m => m - 1) }
  const nextMonth = () => { if (month === 11) { setMonth(0);  setYear(y => y + 1) } else setMonth(m => m + 1) }

  async function handlePlanifier() {
    if (!selectedDate || !title || !childId) return

    setSaving(true)
    setSaveError(null)
    try {
      const d = selectedDate
      const dateStr = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`
      await api.post("/plannings", { title, date: dateStr, start_time: startTime, end_time: endTime, idchild: childId })
      setSaveSuccess(true)
      setTitle(""); setChildId(null)
      loadPlannings()
      setTimeout(() => { setSelectedDate(null); setSaveSuccess(false) }, 2500)
    } catch {
      setSaveError("Impossible de créer le planning. Veuillez réessayer.")
    } finally {
      setSaving(false)
    }
  }

  const isToday    = (d: number) => d === today.getDate() && month === today.getMonth() && year === today.getFullYear()
  const isSelected = (d: number) => selectedDate?.getDate() === d && selectedDate?.getMonth() === month && selectedDate?.getFullYear() === year
  const isPastDay  = (d: number) => {
    const date = new Date(year, month, d)
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    return date < todayMidnight
  }

  const freeLimitReached = isFree && plannings.length >= 1

  function selectDay(day: number) {
    if (isPastDay(day) || freeLimitReached) return
    setSelectedDate(new Date(year, month, day))
    setSaveSuccess(false)
    setSaveError(null)
  }

  const totalDays  = daysInMonth(year, month)
  const startPad   = firstWeekday(year, month)

  return (
    <div className="min-h-screen bg-[#FAFAFA] px-4 py-8 max-w-6xl mx-auto">

      {/* ── HEADER ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-[#273068]">Planning & Gestion Enfant</h1>
          <p className="mt-1 text-sm text-[#6B7280]">Planifiez vos activités et gérez vos enfants et parents.</p>
        </div>

        {/* Dropdown Gestion Enfant */}
        <div ref={menuRef} className="relative">
          <button
            onClick={() => setMenuOpen(v => !v)}
            className="flex items-center gap-2 rounded-xl bg-[#273068] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1e2552]"
          >
            {/* icône groupe */}
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
            </svg>
            Gestion Enfant
            <svg viewBox="0 0 24 24" className={`h-3.5 w-3.5 transition-transform ${menuOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full z-30 mt-2 w-60 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl">

              {/* Enfants */}
              <p className="px-4 pt-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-[#9CA3AF]">Enfants</p>
              <Link to="/children" onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#273068] hover:bg-[#EEF0F8]">
                <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                Lister les enfants
              </Link>
              <Link to="/children/create" onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#273068] hover:bg-[#EEF0F8]">
                <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7M17 14v6M14 17h6"/></svg>
                Enregistrer un enfant
              </Link>

              <div className="mx-4 my-1.5 border-t border-gray-100"/>

              {/* Parents */}
              <p className="px-4 pt-1 pb-1 text-[10px] font-bold uppercase tracking-widest text-[#9CA3AF]">Parents / Tuteurs</p>
              <Link to="/guardians" onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#273068] hover:bg-[#EEF0F8]">
                <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                Lister les parents
              </Link>
              <Link to="/guardians/create" onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#273068] hover:bg-[#EEF0F8]">
                <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/><path d="M17 14v6M14 17h6"/></svg>
                Enregistrer un parent
              </Link>
              <Link to="/children" onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 pb-3 text-sm text-[#273068] hover:bg-[#EEF0F8]">
                <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
                Lier un parent à un enfant
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* ── LIMITE FREE ── */}
      {freeLimitReached && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-[#E94E6F]/30 bg-[#FFF5F7] px-5 py-4">
          <span className="mt-0.5 text-[#E94E6F]">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
            </svg>
          </span>
          <div className="flex-1">
            <p className="font-semibold text-[#E94E6F]">Limite du plan gratuit atteinte</p>
            <p className="mt-1 text-sm text-[#6B7280]">
              Le plan gratuit est limité à <strong>1 planning</strong>. Passez à un abonnement payant pour en créer davantage.
            </p>
            <Link to="/abonnements" className="mt-3 inline-block rounded-lg bg-[#E94E6F] px-4 py-2 text-sm font-semibold text-white hover:bg-[#d63f5f]">
              Voir les abonnements
            </Link>
          </div>
        </div>
      )}

      {/* ── CORPS : calendrier + formulaire ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* CALENDRIER (2/3) */}
        <div className="lg:col-span-2 rounded-2xl bg-white p-6 shadow-sm border border-gray-100">

          {/* Navigation mois */}
          <div className="mb-6 flex items-center justify-between">
            <button onClick={prevMonth}
              className="rounded-lg p-2 text-[#273068] hover:bg-[#EEF0F8]">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <h2 className="text-lg font-bold text-[#273068]">
              {MONTHS_FR[month]} {year}
            </h2>
            <button onClick={nextMonth}
              className="rounded-lg p-2 text-[#273068] hover:bg-[#EEF0F8]">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </div>

          {/* En-têtes jours */}
          <div className="mb-2 grid grid-cols-7">
            {DAYS_FR.map(d => (
              <div key={d} className="py-2 text-center text-xs font-semibold text-[#9CA3AF]">{d}</div>
            ))}
          </div>

          {/* Grille jours */}
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: startPad }).map((_, i) => <div key={`pad-${i}`} />)}
            {Array.from({ length: totalDays }, (_, i) => i + 1).map(day => (
              <button
                key={day}
                onClick={() => selectDay(day)}
                disabled={isPastDay(day)}
                className={[
                  "aspect-square flex items-center justify-center rounded-xl text-sm font-medium transition-all",
                  isPastDay(day)
                    ? "text-gray-300 cursor-not-allowed line-through"
                    : isSelected(day)
                    ? "bg-[#E94E6F] text-white shadow-md scale-105"
                    : isToday(day)
                    ? "bg-[#FFF5F7] text-[#E94E6F] font-bold ring-2 ring-[#E94E6F]/40"
                    : "text-[#374151] hover:bg-[#EEF0F8]",
                ].join(" ")}
              >
                {day}
              </button>
            ))}
          </div>

          {/* Légende */}
          <div className="mt-5 flex flex-wrap items-center gap-5 border-t border-gray-100 pt-4">
            <span className="flex items-center gap-1.5 text-xs text-[#9CA3AF]">
              <span className="h-3 w-3 rounded-full bg-[#E94E6F] inline-block"/> Sélectionné
            </span>
            <span className="flex items-center gap-1.5 text-xs text-[#9CA3AF]">
              <span className="h-3 w-3 rounded-full bg-[#FFF5F7] ring-2 ring-[#E94E6F]/40 inline-block"/> Aujourd'hui
            </span>
            <span className="flex items-center gap-1.5 text-xs text-[#9CA3AF]">
              <span className="h-3 w-3 rounded-full bg-gray-200 inline-block"/> Passé (non sélectionnable)
            </span>
          </div>
        </div>

        {/* FORMULAIRE (1/3) */}
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 flex flex-col">

          {freeLimitReached ? (
            /* Limite free atteinte */
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
          ) : !selectedDate ? (
            /* État vide */
            <div className="flex flex-1 flex-col items-center justify-center py-10 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#EEF0F8]">
                <svg viewBox="0 0 24 24" className="h-8 w-8 text-[#273068]" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
                </svg>
              </div>
              <p className="font-semibold text-[#273068]">Choisissez une date</p>
              <p className="mt-1 text-sm text-[#9CA3AF]">Cliquez sur un jour du calendrier pour planifier une activité.</p>
            </div>
          ) : (
            /* Formulaire */
            <div className="flex flex-col gap-4">

              {/* Date sélectionnée */}
              <div className="rounded-xl bg-[#EEF0F8] px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#9CA3AF]">Date sélectionnée</p>
                <p className="mt-0.5 font-bold text-[#273068]">
                  {selectedDate.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                </p>
              </div>

              {/* Succès */}
              {saveSuccess && (
                <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
                  ✓ Planning créé avec succès !
                </div>
              )}

              {/* Erreur API */}
              {saveError && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                  {saveError}
                </div>
              )}

              {/* Titre */}
              <div>
                <label className="mb-1 block text-xs font-semibold text-[#273068]">Titre de l'activité *</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Ex : Atelier peinture"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#E94E6F] focus:outline-none"
                />
              </div>

              {/* Créneaux horaires */}
              <div>
                <label className="mb-1 block text-xs font-semibold text-[#273068]">Créneau horaire</label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="mb-1 text-[11px] text-[#9CA3AF]">Début</p>
                    <input
                      type="time"
                      value={startTime}
                      onChange={e => setStartTime(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#E94E6F] focus:outline-none"
                    />
                  </div>
                  <div>
                    <p className="mb-1 text-[11px] text-[#9CA3AF]">Fin</p>
                    <input
                      type="time"
                      value={endTime}
                      onChange={e => setEndTime(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#E94E6F] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Enfant */}
              <div>
                <label className="mb-1 block text-xs font-semibold text-[#273068]">Enfant concerné *</label>
                {children.length === 0 ? (
                  <p className="text-xs text-[#9CA3AF]">
                    Aucun enfant enregistré.{" "}
                    <Link to="/children/create" className="font-semibold text-[#E94E6F] underline underline-offset-2">
                      Ajouter un enfant
                    </Link>
                  </p>
                ) : (
                  <select
                    value={childId ?? ""}
                    onChange={e => setChildId(Number(e.target.value) || null)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#E94E6F] focus:outline-none"
                  >
                    <option value="">Sélectionner un enfant</option>
                    {children.map(c => (
                      <option key={c.idchildren} value={c.idchildren}>
                        {c.firstname} {c.lastname ?? ""}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Bouton Planifier */}
              <button
                onClick={handlePlanifier}
                disabled={saving || !title || !childId}
                className="mt-1 w-full rounded-xl bg-[#E94E6F] py-3 text-sm font-bold text-white transition-colors hover:bg-[#d63f5f] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Planification en cours…" : "Planifier"}
              </button>

              <button
                type="button"
                onClick={() => setSelectedDate(null)}
                className="text-center text-xs text-[#9CA3AF] hover:text-[#E94E6F]"
              >
                Annuler
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── LISTE DES PLANNINGS ── */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-[#273068] mb-4">Mes plannings</h2>

        {plannings.length === 0 ? (
          <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-10 text-center">
            <p className="text-3xl mb-2">📅</p>
            <p className="text-[#273068] font-semibold">Aucun planning créé</p>
            <p className="text-sm text-[#9CA3AF] mt-1">Sélectionnez une date dans le calendrier pour commencer.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {plannings.map(p => (
              <Link key={p.idplanning} to={`/plannings/${p.idplanning}`}
                className="block bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:border-[#E94E6F]/40 hover:shadow-md transition-all group">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#EEF0F8] flex items-center justify-center flex-shrink-0">
                    <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#273068]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                      <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
                    </svg>
                  </div>
                  <span className="text-xs text-[#9CA3AF] group-hover:text-[#E94E6F] transition-colors">Voir →</span>
                </div>
                <p className="font-semibold text-[#273068] truncate">{p.title}</p>
                {p.date && (
                  <p className="text-sm text-[#6F8D4C] mt-1">
                    {new Date(p.date).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
                  </p>
                )}
                {(p.start_time || p.end_time) && (
                  <p className="text-xs text-[#9CA3AF] mt-0.5">
                    {p.start_time}{p.start_time && p.end_time ? " → " : ""}{p.end_time}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
