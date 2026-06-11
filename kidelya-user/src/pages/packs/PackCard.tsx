import { Link } from "react-router-dom"
import { PackArtwork } from "@/components/kidelya/PackArtwork"
import { formatPrice, mediaUrl } from "@/utils/media"
import type { Pack } from "@/types/Pack"

export const CARD_THEME_COLORS = [
  { badge: "#6F8D4C", button: "#6F8D4C", buttonHover: "#5a7a3a", bg: "#F0F5EA" },
  { badge: "#E98B2A", button: "#E98B2A", buttonHover: "#c9751f", bg: "#FEF3E7" },
  { badge: "#E94E6F", button: "#E94E6F", buttonHover: "#d63f5f", bg: "#FEE8ED" },
  { badge: "#7C5CBF", button: "#7C5CBF", buttonHover: "#6748a8", bg: "#F0ECF8" },
  { badge: "#4A90C4", button: "#4A90C4", buttonHover: "#357aad", bg: "#E8F3FB" },
]

interface Props {
  pack: Pack
  index: number
  isActive: boolean
  isFavorite: boolean
  isAddingToCart: boolean
  cartMessage?: string
  onSelect: () => void
  onToggleFavorite: (e: React.MouseEvent) => void
  onAddToCart: (e: React.MouseEvent) => void
}

export default function PackCard({
  pack,
  index,
  isActive,
  isFavorite,
  isAddingToCart,
  cartMessage,
  onSelect,
  onToggleFavorite,
  onAddToCart,
}: Props) {
  const image = mediaUrl(pack.illustration ?? null)
  const color = CARD_THEME_COLORS[index % CARD_THEME_COLORS.length]

  return (
    <article
      onClick={onSelect}
      style={{ scrollSnapAlign: "start", minWidth: "220px", maxWidth: "220px" }}
      className={`flex cursor-pointer flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${
        isActive ? "border-[#E94E6F] ring-2 ring-[#E94E6F]/30" : "border-[#F1D9B5]"
      }`}
    >
      {/* Image */}
      <div className="relative overflow-hidden">
        {image ? (
          <img src={image} alt={pack.title} className="h-36 w-full object-cover" />
        ) : (
          <PackArtwork title={pack.title} compact className="h-36" />
        )}
        <button
          onClick={onToggleFavorite}
          className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/80 shadow backdrop-blur-sm transition hover:bg-white"
          title={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill={isFavorite ? "#E94E6F" : "none"} stroke="#E94E6F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h2 className="mb-1 text-sm font-black leading-snug" style={{ color: color.badge }}>
          {pack.title}
        </h2>

        <p className="line-clamp-2 text-xs leading-5 text-[#4F5F45]">{pack.description}</p>

        <div className="mt-auto pt-3">
          <p className="mb-1 text-[11px] text-[#4F5F45]">Pour les 3-7 ans</p>

          <p className="mb-3 text-2xl font-black tracking-tight" style={{ color: color.badge }}>
            {formatPrice(pack.tarification)}
          </p>

          <Link
            to={`/packs/${pack.idpack}`}
            onClick={(e) => e.stopPropagation()}
            className="block rounded-full px-4 py-2 text-center text-xs font-bold text-white transition"
            style={{ backgroundColor: color.button }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = color.buttonHover)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = color.button)}
          >
            Voir le détail
          </Link>

          <button
            onClick={onAddToCart}
            disabled={isAddingToCart}
            className="mt-1.5 flex w-full items-center justify-center gap-1.5 rounded-full border px-4 py-2 text-xs font-bold transition disabled:opacity-60"
            style={{ borderColor: color.button, color: color.button }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = color.button + "15" }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent" }}
          >
            {isAddingToCart ? "…" : cartMessage === "✓" ? "Ajouté ✓" : (
              <>
                <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61H19a2 2 0 001.99-1.74L22 6H6"/>
                </svg>
                Panier
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  )
}
