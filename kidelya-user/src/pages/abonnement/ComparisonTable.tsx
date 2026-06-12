// Tableau de comparaison statique des formules Free / Monthly / Annual

function CellIcon({ ok }: { ok: boolean }) {
  return ok ? (
    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#E94E6F] text-white text-xs font-bold">✓</span>
  ) : (
    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#D5CDE2] text-[#7C67B2] text-xs font-bold">–</span>
  )
}

function RowIcon({ kind }: { kind: "packs" | "kids" | "calendar" | "star" | "update" }) {
  const cls = "h-4 w-4 text-[#273068]"
  if (kind === "packs") return (
    <svg viewBox="0 0 20 20" className={cls} fill="none">
      <rect x="2.5" y="5" width="15" height="11.5" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M2.5 8h15" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  )
  if (kind === "kids") return (
    <svg viewBox="0 0 20 20" className={cls} fill="none">
      <circle cx="7" cy="6.5" r="2.2" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="13" cy="7.2" r="2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M3.5 15c0-2.8 2-4.5 3.5-4.5S10.5 12.2 10.5 15" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M10.5 15c0-2.3 1.7-3.8 3.2-3.8s2.8 1.5 2.8 3.8" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  )
  if (kind === "calendar") return (
    <svg viewBox="0 0 20 20" className={cls} fill="none">
      <rect x="3" y="4.5" width="14" height="12.5" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M3 8h14M6.2 3v3M13.8 3v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
  if (kind === "star") return (
    <svg viewBox="0 0 20 20" className={cls} fill="none">
      <path d="M10 3.2l1.8 3.7 4.1.6-3 2.9.7 4.1-3.6-1.9-3.6 1.9.7-4.1-3-2.9 4.1-.6L10 3.2z" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  )
  return (
    <svg viewBox="0 0 20 20" className={cls} fill="none">
      <path d="M10 3.5a6.5 6.5 0 016.1 4.2M10 16.5a6.5 6.5 0 01-6.1-4.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M16 3.8v4h-4M4 16.2v-4h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

const ROWS = [
  {
    icon: "packs" as const,
    label: "Accès aux packs",
    free: <div className="flex items-center justify-center gap-2"><CellIcon ok={false}/><span>Limité</span></div>,
    monthly: <div className="flex items-center justify-center gap-2"><CellIcon ok={true}/><span>Illimité</span></div>,
    annual: <div className="flex items-center justify-center gap-2"><CellIcon ok={true}/><span>Illimité</span></div>,
  },
  {
    icon: "kids" as const,
    label: "Nombre d'enfants",
    free: "2 enfants",
    monthly: "10 enfants",
    annual: "Illimité",
  },
  {
    icon: "calendar" as const,
    label: "Planification calendrier",
    free: <CellIcon ok={false}/>,
    monthly: <CellIcon ok={true}/>,
    annual: <CellIcon ok={true}/>,
  },
  {
    icon: "star" as const,
    label: "Enregistrements favoris",
    free: <CellIcon ok={false}/>,
    monthly: <CellIcon ok={true}/>,
    annual: <CellIcon ok={true}/>,
  },
  {
    icon: "update" as const,
    label: "Mises à jour régulières",
    free: <CellIcon ok={false}/>,
    monthly: <CellIcon ok={true}/>,
    annual: <CellIcon ok={true}/>,
  },
]

export default function ComparisonTable() {
  return (
    <section className="mt-14">
      <h3 className="mb-5 text-center text-xl font-semibold text-[#7C67B2]">Comparez nos formules</h3>

      <div className="overflow-x-auto rounded-xl backdrop-blur-sm">
        <table className="w-full min-w-[860px] border-collapse text-sm">
          <thead>
            <tr className="bg-[#D5CDE2] text-[#7C67B2]">
              <th className="p-3 text-left font-semibold">
                Fonctionnalités
                <p className="mt-1 text-[11px] font-normal text-[#273068]">Ce qui est inclus dans chaque formule</p>
              </th>
              <th className="p-3 text-center font-semibold">
                Gratuit
                <p className="mt-1 text-[11px] font-normal text-[#273068]">Découverte</p>
              </th>
              <th className="p-3 text-center font-semibold">
                Mensuel
                <p className="mt-1 text-[11px] font-normal text-[#273068]">Le plus choisi</p>
              </th>
              <th className="p-3 text-center font-semibold">
                Annuel
                <p className="mt-1 text-[11px] font-normal text-[#273068]">Économique</p>
              </th>
            </tr>
          </thead>

          <tbody className="text-[#273068]">
            {ROWS.map((row) => (
              <tr key={row.label}>
                <td className="p-3">
                  <div className="flex items-center gap-2 text-[#273068]">
                    <RowIcon kind={row.icon}/>
                    <span>{row.label}</span>
                  </div>
                </td>
                <td className="p-3 text-center">{row.free}</td>
                <td className="p-3 text-center">{row.monthly}</td>
                <td className="p-3 text-center">{row.annual}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
