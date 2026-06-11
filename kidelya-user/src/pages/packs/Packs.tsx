import { useEffect, useMemo, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "@/api/axios"
import { useAuth } from "@/context/useAuth"
import { useFavorites } from "@/hooks/useFavorites"
import type { Pack, PackFilterOptions, PackPaginationMeta } from "@/types/Pack"
import PackCard, { CARD_THEME_COLORS } from "./PackCard"
import PackFilters from "./PackFilters"
import FeaturedPackPreview from "./FeaturedPackPreview"
import PacksHero from "./PacksHero"
import PacksNewsletter from "./PacksNewsletter"

type Activity = {
  idactivities?: number
  title: string
  photourl?: string | null
  type?: string | null
  category?: string | null
}

export default function PacksPage() {
  const [packs, setPacks]                   = useState<Pack[]>([])
  const [meta, setMeta]                     = useState<PackPaginationMeta | null>(null)
  const [loading, setLoading]               = useState(true)
  const [error, setError]                   = useState<string | null>(null)
  const [page, setPage]                     = useState(1)
  const [selectedType, setSelectedType]     = useState("")
  const [selectedSeason, setSelectedSeason] = useState("")
  const [selectedAge, setSelectedAge]       = useState("")
  const [selectedTheme, setSelectedTheme]   = useState("")
  const [filterOptions, setFilterOptions]   = useState<PackFilterOptions>({ types: [], seasons: [], age_ranges: [], themes: [] })
  const [featuredIndex, setFeaturedIndex]   = useState(0)
  const [featuredActivities, setFeaturedActivities] = useState<Activity[]>([])
  const [loadingActivities, setLoadingActivities]   = useState(false)
  const [addingToCart, setAddingToCart]     = useState(false)
  const [cartMessage, setCartMessage]       = useState<string | null>(null)
  const [addingCardId, setAddingCardId]     = useState<number | null>(null)
  const [cardMessages, setCardMessages]     = useState<Record<number, string>>({})
  const [email, setEmail]                   = useState("")
  const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  const carouselRef = useRef<HTMLDivElement>(null)
  const navigate    = useNavigate()
  const { user }    = useAuth()
  const { favPackIds, togglePack } = useFavorites()

  useEffect(() => {
    setLoading(true); setError(null)
    const params = new URLSearchParams({ page: String(page), per_page: "50" })
    if (selectedType) params.set("type", selectedType)
    if (selectedSeason) params.set("season", selectedSeason)
    if (selectedAge) params.set("age", selectedAge)
    if (selectedTheme) params.set("theme", selectedTheme)

    api.get(`/public/packs?${params.toString()}`)
      .then((res) => {
        const list = res.data.data || []
        setPacks(list)
        setMeta(res.data.meta || null)
        setFilterOptions(res.data.filters || { types: [], seasons: [], age_ranges: [], themes: [] })
        setFeaturedIndex(list.length > 0 ? Math.floor(Math.random() * list.length) : 0)
      })
      .catch(() => { setError("Impossible de charger les packs. Veuillez réessayer."); setPacks([]) })
      .finally(() => setLoading(false))
  }, [page, selectedType, selectedSeason, selectedAge, selectedTheme])

  useEffect(() => {
    const pack = packs[featuredIndex]
    if (!pack) return
    setLoadingActivities(true)
    api.get(`/public/packs/${pack.idpack}`)
      .then((res) => setFeaturedActivities(res.data.data?.activities || []))
      .catch(() => setFeaturedActivities([]))
      .finally(() => setLoadingActivities(false))
  }, [packs, featuredIndex])

  const handleCarouselScroll = () => {
    if (!carouselRef.current) return
    const { scrollLeft, children } = carouselRef.current
    let closest = 0; let minDist = Infinity
    Array.from(children).forEach((child, i) => {
      const dist = Math.abs((child as HTMLElement).offsetLeft - scrollLeft)
      if (dist < minDist) { minDist = dist; closest = i }
    })
    setFeaturedIndex(closest)
  }

  const handleFilterChange = (field: "age" | "theme" | "season" | "type", value: string) => {
    setPage(1)
    if (field === "age") setSelectedAge(value)
    else if (field === "theme") setSelectedTheme(value)
    else if (field === "season") setSelectedSeason(value)
    else setSelectedType(value)
  }

  const handlePageChange = (newPage: number) => {
    if (!meta || newPage < 1 || newPage > meta.last_page) return
    setPage(newPage); setFeaturedIndex(0)
    setTimeout(() => {
      (carouselRef.current?.children[0] as HTMLElement)?.scrollIntoView({ behavior: "smooth", inline: "center" })
    }, 50)
  }

  const featuredPack  = useMemo(() => packs[featuredIndex] ?? null, [packs, featuredIndex])
  const featuredColor = CARD_THEME_COLORS[featuredIndex % CARD_THEME_COLORS.length]

  const handleAddToCart = async () => {
    if (!featuredPack) return
    if (!user) { navigate("/login", { state: { redirectAfter: "/packs" } }); return }
    setAddingToCart(true); setCartMessage(null)
    try {
      await api.post("/cart/add", { idpack: featuredPack.idpack })
      setCartMessage("Ajouté au panier !")
    } catch {
      setCartMessage("Erreur, veuillez réessayer.")
    } finally {
      setAddingToCart(false)
      setTimeout(() => setCartMessage(null), 3000)
    }
  }

  const addPackToCart = async (pack: Pack, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!user) { navigate("/login", { state: { redirectAfter: "/packs" } }); return }
    setAddingCardId(pack.idpack)
    try {
      await api.post("/cart/add", { idpack: pack.idpack })
      setCardMessages((prev) => ({ ...prev, [pack.idpack]: "✓" }))
    } catch {
      setCardMessages((prev) => ({ ...prev, [pack.idpack]: "!" }))
    } finally {
      setAddingCardId(null)
      setTimeout(() => setCardMessages((prev) => { const n = { ...prev }; delete n[pack.idpack]; return n }), 2000)
    }
  }

  const handleNewsletter = async (e: { preventDefault(): void }) => {
    e.preventDefault()
    if (!email) return
    setNewsletterStatus("loading")
    try {
      await api.post("/newsletter", { email })
      setNewsletterStatus("success"); setEmail("")
    } catch {
      setNewsletterStatus("error")
    }
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-[#21164F]">
      <PacksHero/>

      <PackFilters
        filterOptions={filterOptions}
        selectedAge={selectedAge} selectedTheme={selectedTheme}
        selectedSeason={selectedSeason} selectedType={selectedType}
        onChange={handleFilterChange}
        onReset={() => { setSelectedAge(""); setSelectedTheme(""); setSelectedSeason(""); setSelectedType(""); setPage(1) }}
      />

      <main className="mx-auto max-w-7xl px-6 pb-20">
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">{error}</div>
        )}

        {loading ? (
          <div className="py-16 text-center text-[#6F8D4C]">Chargement des packs...</div>
        ) : packs.length === 0 ? (
          <div className="py-16 text-center text-[#6F8D4C]">Aucun pack public trouvé.</div>
        ) : (
          <>
            <div ref={carouselRef} onScroll={handleCarouselScroll}
              className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide" style={{ scrollSnapType: "x mandatory" }}>
              {packs.map((pack, index) => (
                <PackCard key={pack.idpack} pack={pack} index={index}
                  isActive={index === featuredIndex}
                  isFavorite={favPackIds.has(pack.idpack)}
                  isAddingToCart={addingCardId === pack.idpack}
                  cartMessage={cardMessages[pack.idpack]}
                  onSelect={() => setFeaturedIndex(index)}
                  onToggleFavorite={(e) => togglePack(pack.idpack, e)}
                  onAddToCart={(e) => addPackToCart(pack, e)}
                />
              ))}
            </div>

            {meta && meta.last_page > 1 && (
              <div className="mt-4 flex items-center justify-center gap-2">
                {Array.from({ length: meta.last_page }, (_, i) => {
                  const p = i + 1; const isActive = p === page
                  return (
                    <button key={p} onClick={() => handlePageChange(p)} aria-label={`Page ${p}`}>
                      <div className={`rounded-full transition-all ${isActive ? "h-3 w-3 scale-125 bg-[#E94E6F] shadow-md" : "h-3 w-3 bg-[#E94E6F]/30 hover:bg-[#E94E6F]/60"}`}/>
                    </button>
                  )
                })}
              </div>
            )}

            {packs.length > 1 && !(meta && meta.last_page > 1) && (
              <div className="mt-4 flex items-center justify-center gap-2">
                {packs.map((_, i) => (
                  <button key={i} onClick={() => {
                    setFeaturedIndex(i)
                    const card = carouselRef.current?.children[i] as HTMLElement
                    card?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" })
                  }} aria-label={`Pack ${i + 1}`}
                    className={`rounded-full transition-all ${i === featuredIndex ? "h-3 w-3 bg-[#E94E6F]" : "h-2.5 w-2.5 bg-[#E94E6F]/30 hover:bg-[#E94E6F]/60"}`}
                  />
                ))}
              </div>
            )}

            {featuredPack && (
              <FeaturedPackPreview pack={featuredPack} activities={featuredActivities}
                loadingActivities={loadingActivities} color={featuredColor}
                isAddingToCart={addingToCart} cartMessage={cartMessage} onAddToCart={handleAddToCart}
              />
            )}
          </>
        )}

        <PacksNewsletter email={email} status={newsletterStatus} onEmailChange={setEmail} onSubmit={handleNewsletter}/>
      </main>
    </div>
  )
}
