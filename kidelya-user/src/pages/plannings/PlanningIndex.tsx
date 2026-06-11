import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import api from "@/api/axios"
import { useAuth } from "@/context/useAuth"
import type { Planning } from "@/types/Planning"
import PlanningCalendar from "./PlanningCalendar"
import PlanningCard from "./PlanningCard"
import PlanningForm from "./PlanningForm"
import GestionEnfantMenu from "./GestionEnfantMenu"

function requestNotifPermission() {
  if ("Notification" in window && Notification.permission === "default") Notification.requestPermission()
}
function fireNotification(title: string, body: string) {
  if ("Notification" in window && Notification.permission === "granted") new Notification(title, { body, icon: "/favicon.ico" })
}

interface Child { idchildren: number; firstname: string; lastname?: string; avatar?: string | null }

export default function PlanningIndex() {
  const { user } = useAuth()
  const isFree = !user?.plan

  const today = new Date()
  const [month, setMonth]               = useState(today.getMonth())
  const [year, setYear]                 = useState(today.getFullYear())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [title,     setTitle]     = useState("")
  const [startTime, setStartTime] = useState("09:00")
  const [endTime,   setEndTime]   = useState("10:00")
  const [childId,   setChildId]   = useState<number | null>(null)
  const [children,  setChildren]  = useState<Child[]>([])
  const [saving,      setSaving]      = useState(false)
  const [saveError,   setSaveError]   = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [plannings,   setPlannings]   = useState<Planning[]>([])
  const [loadError,   setLoadError]   = useState<string | null>(null)
  const notifiedRef = useRef<Set<number>>(new Set())

  const loadPlannings = () =>
    api.get("/plannings")
      .then((res) => { setLoadError(null); setPlannings(res.data.data ?? res.data ?? []) })
      .catch(() => setLoadError("Impossible de charger vos plannings. Veuillez réessayer."))

  useEffect(() => {
    requestNotifPermission()
    api.get("/children").then((res) => setChildren(res.data.data ?? res.data ?? [])).catch(() => {})
    loadPlannings()
  }, [])

  useEffect(() => {
    const check = () => {
      const now = new Date()
      const todayStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}`
      const cur  = `${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`
      const in30 = new Date(now.getTime() + 30 * 60_000)
      const in30t = `${String(in30.getHours()).padStart(2,"0")}:${String(in30.getMinutes()).padStart(2,"0")}`
      plannings.forEach((p) => {
        if (!p.start_time || !p.date || p.date.slice(0,10) !== todayStr) return
        const t = p.start_time.slice(0,5)
        if (t === in30t && !notifiedRef.current.has(`${p.idplanning}-30`)) {
          notifiedRef.current.add(`${p.idplanning}-30`)
          fireNotification(`⏰ Dans 30 min — ${p.title}`, "Votre activité commence dans 30 minutes.")
        }
        if (t === cur && !notifiedRef.current.has(`${p.idplanning}-now`)) {
          notifiedRef.current.add(`${p.idplanning}-now`)
          fireNotification(`🌸 C'est l'heure ! — ${p.title}`, "L'heure de votre activité planifiée est arrivée !")
        }
      })
    }
    check(); const id = setInterval(check, 60_000); return () => clearInterval(id)
  }, [plannings])

  const prevMonth = () => month === 0  ? (setMonth(11), setYear((y) => y - 1)) : setMonth((m) => m - 1)
  const nextMonth = () => month === 11 ? (setMonth(0),  setYear((y) => y + 1)) : setMonth((m) => m + 1)

  const isPastDay = (d: number) =>
    new Date(year, month, d) < new Date(today.getFullYear(), today.getMonth(), today.getDate())

  const freeLimitReached = isFree && plannings.length >= 1

  async function handlePlanifier() {
    if (!selectedDate || !title || !childId) return
    setSaving(true); setSaveError(null)
    try {
      const d = selectedDate
      const dateStr = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`
      await api.post("/plannings", { title, date: dateStr, start_time: startTime, end_time: endTime, idchild: childId })
      setSaveSuccess(true); setTitle(""); setChildId(null)
      loadPlannings()
      setTimeout(() => { setSelectedDate(null); setSaveSuccess(false) }, 2500)
    } catch {
      setSaveError("Impossible de créer le planning. Veuillez réessayer.")
    } finally {
      setSaving(false)
    }
  }

  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const upcoming = plannings.filter((p) => !p.date || new Date(p.date) >= todayMidnight)
  const past     = plannings.filter((p) =>  p.date  && new Date(p.date) <  todayMidnight)

  return (
    <div className="min-h-screen bg-[#FAFAFA] px-4 py-8 max-w-6xl mx-auto">

      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-[#273068]">Planning & Gestion Enfant</h1>
          <p className="mt-1 text-sm text-[#6B7280]">Planifiez vos activités et gérez vos enfants et parents.</p>
        </div>
        <GestionEnfantMenu/>
      </div>

      {loadError && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">{loadError}</div>
      )}

      {freeLimitReached && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-[#E94E6F]/30 bg-[#FFF5F7] px-5 py-4">
          <svg viewBox="0 0 24 24" className="mt-0.5 h-5 w-5 text-[#E94E6F]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
          </svg>
          <div className="flex-1">
            <p className="font-semibold text-[#E94E6F]">Limite du plan gratuit atteinte</p>
            <p className="mt-1 text-sm text-[#6B7280]">Le plan gratuit est limité à <strong>1 planning</strong>. Passez à un abonnement payant pour en créer davantage.</p>
            <Link to="/abonnements" className="mt-3 inline-block rounded-lg bg-[#E94E6F] px-4 py-2 text-sm font-semibold text-white hover:bg-[#d63f5f]">
              Voir les abonnements
            </Link>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <PlanningCalendar month={month} year={year} today={today} selectedDate={selectedDate}
          freeLimitReached={freeLimitReached} onPrevMonth={prevMonth} onNextMonth={nextMonth}
          onSelectDay={(day) => { if (!isPastDay(day) && !freeLimitReached) { setSelectedDate(new Date(year, month, day)); setSaveSuccess(false); setSaveError(null) } }}
        />

        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 flex flex-col">
          <PlanningForm
            selectedDate={selectedDate} freeLimitReached={freeLimitReached}
            saving={saving} saveSuccess={saveSuccess} saveError={saveError}
            title={title} startTime={startTime} endTime={endTime} childId={childId} children={children}
            onTitleChange={setTitle} onStartTimeChange={setStartTime} onEndTimeChange={setEndTime}
            onChildChange={setChildId} onSubmit={handlePlanifier} onCancel={() => setSelectedDate(null)}
          />
        </div>
      </div>

      {plannings.length === 0 && !loadError ? (
        <div className="mt-8 rounded-2xl bg-white border border-gray-100 shadow-sm p-10 text-center">
          <p className="text-3xl mb-2">📅</p>
          <p className="text-[#273068] font-semibold">Aucun planning créé</p>
          <p className="text-sm text-[#9CA3AF] mt-1">Sélectionnez une date dans le calendrier pour commencer.</p>
        </div>
      ) : (
        <>
          {upcoming.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-bold text-[#273068] mb-4">Plannings à venir</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {upcoming.map((p) => <PlanningCard key={p.idplanning} planning={p} isPast={false}/>)}
              </div>
            </div>
          )}
          {past.length > 0 && (
            <div className="mt-10">
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-xl font-bold text-[#273068]">Comptes-rendus d'activités</h2>
                <span className="rounded-full bg-[#6F8D4C]/10 px-2.5 py-1 text-xs font-semibold text-[#6F8D4C]">
                  {past.length} activité{past.length > 1 ? "s" : ""} passée{past.length > 1 ? "s" : ""}
                </span>
              </div>
              <p className="text-sm text-[#9CA3AF] mb-4">Cliquez sur un planning passé pour rédiger ou consulter son compte-rendu.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {past.map((p) => <PlanningCard key={p.idplanning} planning={p} isPast={true}/>)}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
