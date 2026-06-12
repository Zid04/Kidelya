import { LockBanner } from "./LockBanner"

interface Props {
  materials: string[]
  canAccess: boolean
  onBuyPack: () => void
  buying: boolean
}

export function MaterialTab({ materials, canAccess, onBuyPack, buying }: Props) {
  if (!canAccess) return <LockBanner onBuyPack={onBuyPack} buying={buying} />

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h2 className="mb-4 font-black text-[#21164F]">Matériel nécessaire</h2>
      {materials.length === 0 ? (
        <p className="text-gray-400">Aucun matériel renseigné.</p>
      ) : (
        <ul className="space-y-2">
          {materials.map((m, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#E94E6F]" />
              {m}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
