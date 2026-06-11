import { formatPrice, mediaUrl } from "@/utils/media"
import type { Pack } from "@/types/Pack"

interface ActivityPreview {
  idactivities?: number
  title: string
  photourl?: string | null
  type?: string | null
  category?: string | null
}

interface ColorTheme {
  badge: string
  button: string
  buttonHover: string
  bg: string
}

interface Props {
  pack: Pack
  activities: ActivityPreview[]
  loadingActivities: boolean
  color: ColorTheme
  isAddingToCart: boolean
  cartMessage: string | null
  onAddToCart: () => void
}

const MAX_GRID = 8

export default function FeaturedPackPreview({
  pack,
  activities,
  loadingActivities,
  color,
  isAddingToCart,
  cartMessage,
  onAddToCart,
}: Props) {
  const totalActivities = activities.length
  const activitySlots = Math.min(totalActivities, MAX_GRID)
  const activityVisible = totalActivities > MAX_GRID ? MAX_GRID - 1 : activitySlots
  const extraCount = Math.max(0, totalActivities - activityVisible)

  const bullets = pack.description
    ? pack.description.split(/[.,;]/).filter((s) => s.trim().length > 4).slice(0, 5)
    : []

  return (
    <section className="mt-12 overflow-hidden rounded-3xl border border-[#F1D9B5] bg-white shadow-sm">
      <div className="border-b border-[#F1D9B5] px-6 py-4">
        <p className="text-sm font-black text-[#2F236D]">
          Aperçu du pack — <span style={{ color: color.badge }}>{pack.title}</span>
        </p>
      </div>

      <div className="grid gap-8 p-6 md:grid-cols-[1fr_280px]">
        {/* Grille des activités */}
        <div>
          {!loadingActivities && activities.length === 0 && (
            <div className="flex h-40 items-center justify-center rounded-2xl border border-dashed border-[#E8DDD0] bg-[#F7F3EE] text-sm text-[#4F5F45]">
              Aucune activité liée à ce pack pour le moment.
            </div>
          )}

          <div className="grid grid-cols-4 gap-2">
            {loadingActivities
              ? Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="animate-pulse rounded-xl bg-[#EDE7DA]" style={{ aspectRatio: "1" }} />
                ))
              : activities.slice(0, activitySlots).map((activity, i) => {
                  const isExtra = i === activityVisible && extraCount > 0
                  const img = mediaUrl(activity.photourl ?? null)
                  return (
                    <div
                      key={activity.idactivities ?? i}
                      className="relative overflow-hidden rounded-xl border border-[#F1D9B5] bg-[#F7F3EE]"
                      style={{ aspectRatio: "1" }}
                    >
                      {isExtra ? (
                        <>
                          <div className="absolute inset-0 rounded-xl bg-[#2F236D]/70" />
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-lg font-black text-white">+{extraCount}</span>
                            <span className="text-[10px] font-semibold text-white">activités</span>
                          </div>
                        </>
                      ) : (
                        <div className="relative h-full w-full">
                          {img
                            ? <img src={img} alt={activity.title} className="h-full w-full object-cover" />
                            : <div className="h-full w-full bg-[#EDE7DA]" />
                          }
                          <div className="absolute bottom-0 left-0 right-0 bg-white/90 px-1.5 py-1">
                            <p className="line-clamp-1 text-[9px] font-bold text-[#2F236D]">{activity.title}</p>
                            <p className="text-[8px] text-[#4F5F45]">{activity.category ?? activity.type ?? "Activité créative"}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })
            }
          </div>

          {/* Barre de progression */}
          <div className="relative mt-3 h-2 overflow-hidden rounded-full bg-[#F1D9B5]">
            <div
              className="absolute inset-y-0 left-0 rounded-full transition-all"
              style={{
                width: `${Math.min(100, (activityVisible / Math.max(pack.duration, activityVisible)) * 100)}%`,
                backgroundColor: color.badge,
              }}
            />
          </div>
          <p className="mt-1 text-right text-[10px] text-[#4F5F45]">
            {activityVisible}/{totalActivities} activités affichées
          </p>
        </div>

        {/* Colonne droite — détails + CTA */}
        <div className="flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-black text-[#2F236D]">{pack.title}</h3>
            <p className="mt-2 text-sm leading-6 text-[#4F5F45]">
              {pack.description || "Un pack créatif prêt à l'emploi."}
            </p>

            {bullets.length > 0 && (
              <ul className="mt-3 space-y-1.5">
                {bullets.map((bullet, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-[#4F5F45]">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ backgroundColor: color.badge }} />
                    {bullet.trim()}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mt-6">
            <p className="mb-3 text-2xl font-black" style={{ color: color.badge }}>
              {formatPrice(pack.tarification)}
            </p>

            <button
              onClick={onAddToCart}
              disabled={isAddingToCart}
              className="block w-full rounded-full px-5 py-3 text-center text-sm font-bold text-white transition disabled:opacity-60"
              style={{ backgroundColor: "#E94E6F" }}
              onMouseEnter={(e) => { if (!isAddingToCart) e.currentTarget.style.backgroundColor = "#d63f5f" }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#E94E6F" }}
            >
              {isAddingToCart ? "Ajout en cours..." : "Ajouter au panier"}
            </button>

            {cartMessage && (
              <p className={`mt-2 text-center text-xs font-semibold ${cartMessage.includes("Erreur") ? "text-red-500" : "text-[#6F8D4C]"}`}>
                {cartMessage}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
