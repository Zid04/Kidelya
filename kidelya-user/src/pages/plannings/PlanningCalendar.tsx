// Calendrier mensuel standalone — navigue entre les mois, sélectionne un jour

const MONTHS_FR = [
  "Janvier","Février","Mars","Avril","Mai","Juin",
  "Juillet","Août","Septembre","Octobre","Novembre","Décembre",
]
const DAYS_FR = ["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"]

function daysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate() }
function firstWeekday(y: number, m: number) { return (new Date(y, m, 1).getDay() + 6) % 7 }

interface Props {
  month: number
  year: number
  today: Date
  selectedDate: Date | null
  freeLimitReached: boolean
  onPrevMonth: () => void
  onNextMonth: () => void
  onSelectDay: (day: number) => void
}

export default function PlanningCalendar({
  month,
  year,
  today,
  selectedDate,
  freeLimitReached,
  onPrevMonth,
  onNextMonth,
  onSelectDay,
}: Props) {
  const totalDays = daysInMonth(year, month)
  const startPad  = firstWeekday(year, month)

  const isPastDay = (d: number) => {
    const date = new Date(year, month, d)
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    return date < todayMidnight
  }

  const isToday    = (d: number) => d === today.getDate() && month === today.getMonth() && year === today.getFullYear()
  const isSelected = (d: number) => selectedDate?.getDate() === d && selectedDate?.getMonth() === month && selectedDate?.getFullYear() === year

  return (
    <div className="lg:col-span-2 rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
      {/* Navigation mois */}
      <div className="mb-6 flex items-center justify-between">
        <button onClick={onPrevMonth} className="rounded-lg p-2 text-[#273068] hover:bg-[#EEF0F8]">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
        <h2 className="text-lg font-bold text-[#273068]">{MONTHS_FR[month]} {year}</h2>
        <button onClick={onNextMonth} className="rounded-lg p-2 text-[#273068] hover:bg-[#EEF0F8]">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>
      </div>

      {/* En-têtes jours */}
      <div className="mb-2 grid grid-cols-7">
        {DAYS_FR.map((d) => (
          <div key={d} className="py-2 text-center text-xs font-semibold text-[#9CA3AF]">{d}</div>
        ))}
      </div>

      {/* Grille jours */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: startPad }).map((_, i) => <div key={`pad-${i}`} />)}
        {Array.from({ length: totalDays }, (_, i) => i + 1).map((day) => (
          <button
            key={day}
            onClick={() => !isPastDay(day) && !freeLimitReached && onSelectDay(day)}
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
  )
}
