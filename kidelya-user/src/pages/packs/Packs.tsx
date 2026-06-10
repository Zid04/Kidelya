import { useEffect, useMemo, useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import api from "@/api/axios"
import { useAuth } from "@/context/useAuth"
import { PackArtwork } from "@/components/kidelya/PackArtwork"
import { formatPrice, mediaUrl } from "@/utils/media"
import illuHero from "@/assets/ILLU_PAGE_ACTIVITE.png"
import ctaPack from "@/assets/ctapack.png"
import iconSteam from "@/assets/steam.png"
import iconFilters from "@/assets/filters.png"
import iconAward from "@/assets/award.png"

type Pack = {
  idpack: number
  title: string
  description: string | null
  tarification: number | string
  duration: number
  illustration: string | null
  is_published?: boolean
  type?: string | null
}

type Activity = {
  idactivities?: number
  title: string
  photourl?: string | null
  type?: string | null
  category?: string | null
}

type PaginationMeta = {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

type FilterOptions = {
  types: string[]
  seasons: string[]
  age_ranges: string[]
  themes: string[]
}

const CARD_THEME_COLORS = [
  { badge: "#6F8D4C", button: "#6F8D4C", buttonHover: "#5a7a3a", bg: "#F0F5EA" },
  { badge: "#E98B2A", button: "#E98B2A", buttonHover: "#c9751f", bg: "#FEF3E7" },
  { badge: "#E94E6F", button: "#E94E6F", buttonHover: "#d63f5f", bg: "#FEE8ED" },
  { badge: "#7C5CBF", button: "#7C5CBF", buttonHover: "#6748a8", bg: "#F0ECF8" },
  { badge: "#4A90C4", button: "#4A90C4", buttonHover: "#357aad", bg: "#E8F3FB" },
]



export default function PacksPage() {
  const [packs, setPacks] = useState<Pack[]>([])
  const [meta, setMeta] = useState<PaginationMeta | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [search] = useState("")
  const [selectedType, setSelectedType] = useState("")
  const [selectedSeason, setSelectedSeason] = useState("")
  const [selectedAge, setSelectedAge] = useState("")
  const [selectedTheme, setSelectedTheme] = useState("")
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    types: [],
    seasons: [],
    age_ranges: [],
    themes: [],
  })
  const [featuredIndex, setFeaturedIndex] = useState(0)
  const [featuredActivities, setFeaturedActivities] = useState<Activity[]>([])
  const [loadingActivities, setLoadingActivities] = useState(false)
  const [addingToCart, setAddingToCart] = useState(false)
  const [cartMessage, setCartMessage] = useState<string | null>(null)
  const [addingCardId, setAddingCardId] = useState<number | null>(null)
  const [cardMessages, setCardMessages] = useState<Record<number, string>>({})
  const [email, setEmail] = useState("")
  const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  async function handleNewsletter(e: { preventDefault(): void }) {
    e.preventDefault()
    if (!email) return
    setNewsletterStatus("loading")
    try {
      await api.post("/newsletter", { email })
      setNewsletterStatus("success")
      setEmail("")
    } catch {
      setNewsletterStatus("error")
    }
  }

  const carouselRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    const fetchPacks = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams({ page: String(page), per_page: "50", search })
        if (selectedType) params.set("type", selectedType)
        if (selectedSeason) params.set("season", selectedSeason)
        if (selectedAge) params.set("age", selectedAge)
        if (selectedTheme) params.set("theme", selectedTheme)

        const res = await api.get(`/public/packs?${params.toString()}`)
        const list = res.data.data || []
        setPacks(list)
        setMeta(res.data.meta || null)
        setFilterOptions(res.data.filters || { types: [], seasons: [], age_ranges: [], themes: [] })
        setFeaturedIndex(list.length > 0 ? Math.floor(Math.random() * list.length) : 0)
      } catch (e) {
        console.error(e)
        setPacks([])
        setMeta(null)
      } finally {
        setLoading(false)
      }
    }
    fetchPacks()
  }, [page, search, selectedType, selectedSeason, selectedAge, selectedTheme])

  useEffect(() => {
    if (!packs.length) return
    const pack = packs[featuredIndex]
    if (!pack) return
    const fetchActivities = async () => {
      setLoadingActivities(true)
      try {
        const res = await api.get(`/public/packs/${pack.idpack}`)
        setFeaturedActivities(res.data.data?.activities || [])
      } catch {
        setFeaturedActivities([])
      } finally {
        setLoadingActivities(false)
      }
    }
    fetchActivities()
  }, [packs, featuredIndex])

  const handlePageChange = (newPage: number) => {
    if (!meta || newPage < 1 || newPage > meta.last_page) return
    setPage(newPage)
    setFeaturedIndex(0)
    setTimeout(() => {
      const firstCard = carouselRef.current?.children[0] as HTMLElement
      firstCard?.scrollIntoView({ behavior: "smooth", inline: "center" })
    }, 50)
  }


  const handleCarouselScroll = () => {
    if (!carouselRef.current) return
    const { scrollLeft, children } = carouselRef.current
    let closest = 0
    let minDist = Infinity
    Array.from(children).forEach((child, i) => {
      const el = child as HTMLElement
      const dist = Math.abs(el.offsetLeft - scrollLeft)
      if (dist < minDist) { minDist = dist; closest = i }
    })
    setFeaturedIndex(closest)
  }

  const featuredPack = useMemo(
    () => (packs.length ? packs[featuredIndex] : null),
    [packs, featuredIndex]
  )

  const featuredBullets = useMemo(() => {
    if (!featuredPack?.description) return []
    return featuredPack.description.split(/[.,;]/).filter((s) => s.trim().length > 4).slice(0, 5)
  }, [featuredPack])

  const featuredColor = CARD_THEME_COLORS[featuredIndex % CARD_THEME_COLORS.length]

  const handleAddToCart = async () => {
    if (!featuredPack) return
    if (!user) { navigate("/login", { state: { redirectAfter: "/packs" } }); return }
    setAddingToCart(true)
    setCartMessage(null)
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
      setTimeout(() => setCardMessages((prev) => { const n = { ...prev }; delete n[pack.idpack]; return n }), 2000)
    } catch {
      setCardMessages((prev) => ({ ...prev, [pack.idpack]: "!" }))
      setTimeout(() => setCardMessages((prev) => { const n = { ...prev }; delete n[pack.idpack]; return n }), 2000)
    } finally {
      setAddingCardId(null)
    }
  }

  const MAX_GRID = 8
  const totalActivities = featuredActivities.length
  const ACTIVITY_SLOTS = Math.min(totalActivities, MAX_GRID)
  const ACTIVITY_VISIBLE = totalActivities > MAX_GRID ? MAX_GRID - 1 : ACTIVITY_SLOTS
  const extraCount = Math.max(0, totalActivities - ACTIVITY_VISIBLE)

  return (
    <>
      <div className="min-h-screen overflow-x-hidden bg-white text-[#21164F]">

        {/* ── HERO ── */}
        <section className="relative overflow-hidden bg-white">

          {/* Image desktop — collée au bord droit, hors du conteneur max-w */}
          <div className="absolute right-0 top-0 hidden h-full w-[48%] lg:block">
            <img
              src={illuHero}
              alt="Illustration activités"
              className="h-full w-full object-contain object-right-top"
            />
          </div>

          {/* Image mobile — fond plein écran */}
          <div className="absolute inset-0 z-0 opacity-100 lg:hidden">
            <img
              src={illuHero}
              alt=""
              aria-hidden="true"
              className="h-full w-full object-contain object-right"
            />
          </div>

          {/* Texte */}
          <div className="relative z-10 mx-auto max-w-7xl pl-6 pb-0 pt-20 md:pt-28">
            <div className="max-w-[540px]">
              <h1 className="text-[32px] font-black leading-[1.12] text-[#2F236D] md:text-[44px]">
                Nos packs d'activités
                <br />
                pour toutes les envies
              </h1>

              <p className="mt-5 max-w-[450px] text-[16px] leading-7 text-[#4F5F45]">
                Des activités clés en main pour éveiller la curiosité,
                créer et s'amuser à chaque saison!
              </p>

              <div className="mt-8 flex flex-nowrap gap-x-5">
                {[
                  { title: "Des activités pour tous les âges",  description: "De 2 à 10 ans",       icon: iconSteam },
                  { title: "Imprimables et faciles à réaliser", description: "Prêtes à l'emploi",   icon: iconFilters },
                  { title: "Activités prêtes à l'emploi",       description: "Toujours du contenu", icon: iconAward },
                ].map((item) => (
                  <div key={item.title} className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center">
                      <img src={item.icon} alt="" className="h-8 w-8 object-contain" />
                    </div>
                    <div>
                     <p className="max-w-[150px] text-[13px] font-semibold leading-5 text-[#273068]">
                        {item.title}
                      </p>
                      <p className="mt-1 text-[11px] leading-4 text-[#4F5F45]">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </section>

        {/* ── FILTRES ── */}
        <div className="mx-auto my-5 flex w-full max-w-4xl flex-col items-center ">
        <div className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[#E8DDD0] bg-white px-16 py-5 shadow-md">
          <div className="rounded-xl border border-[#E8DDD0]">
            <select value={selectedAge} onChange={(e) => { setPage(1); setSelectedAge(e.target.value) }}
              className="h-9 min-w-[90px] bg-transparent px-3 text-sm text-[#4F5F45] outline-none">
              <option value="">Âge</option>
              {filterOptions.age_ranges.map((a) => <option key={a} value={a}>{a.replace(/-/g, " - ")} ans</option>)}
            </select>
          </div>
          <div className="rounded-xl border border-[#E8DDD0]">
            <select value={selectedTheme} onChange={(e) => { setPage(1); setSelectedTheme(e.target.value) }}
              className="h-9 min-w-[100px] bg-transparent px-3 text-sm text-[#4F5F45] outline-none">
              <option value="">Thème</option>
              {filterOptions.themes.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="rounded-xl border border-[#E8DDD0]">
            <select value={selectedSeason} onChange={(e) => { setPage(1); setSelectedSeason(e.target.value) }}
              className="h-9 min-w-[100px] bg-transparent px-3 text-sm text-[#4F5F45] outline-none">
              <option value="">Saison</option>
              {filterOptions.seasons.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="rounded-xl border border-[#E8DDD0]">
            <select value={selectedType} onChange={(e) => { setPage(1); setSelectedType(e.target.value) }}
              className="h-9 min-w-[130px] bg-transparent px-3 text-sm text-[#4F5F45] outline-none">
              <option value="">Type d'activité</option>
              {filterOptions.types.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
          <button
            onClick={() => { setSelectedAge(""); setSelectedTheme(""); setSelectedSeason(""); setSelectedType(""); setPage(1) }}
            className="text-xs font-semibold text-[#E94E6F] hover:underline"
          >
            Réinitialiser les filtres
          </button>
        </div>

        <main className="mx-auto max-w-7xl px-6 pb-20">

          {/* ── CAROUSEL DE CARDS ── */}
          {loading ? (
            <div className="py-16 text-center text-[#6F8D4C]">Chargement des packs...</div>
          ) : packs.length === 0 ? (
            <div className="py-16 text-center text-[#6F8D4C]">Aucun pack public trouvé.</div>
          ) : (
            <>
              {/* Piste défilante */}
              <div
                ref={carouselRef}
                onScroll={handleCarouselScroll}
                className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide"
                style={{ scrollSnapType: "x mandatory" }}
              >
                {packs.map((pack, index) => {
                  const image = mediaUrl(pack.illustration)
                  const color = CARD_THEME_COLORS[index % CARD_THEME_COLORS.length]
                  const isActive = index === featuredIndex

                  return (
                    <article
                      key={pack.idpack}
                      onClick={() => setFeaturedIndex(index)}
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
                      </div>

                      <div className="flex flex-1 flex-col p-4">
                        <h2
                          className="mb-1 text-sm font-black leading-snug"
                          style={{ color: color.badge }}
                        >
                          {pack.title}
                        </h2>

                        <p className="line-clamp-2 text-xs leading-5 text-[#4F5F45]">
                          {pack.description}
                        </p>

                        <div className="mt-auto pt-3">
                          <p className="mb-1 text-[11px] text-[#4F5F45]">
                            Pour les 3-7 ans
                          </p>

                          <p className="mb-3 text-2xl font-black tracking-tight "style={{ color: color.badge }}>
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
                            onClick={(e) => addPackToCart(pack, e)}
                            disabled={addingCardId === pack.idpack}
                            className="mt-1.5 flex w-full items-center justify-center gap-1.5 rounded-full border px-4 py-2 text-xs font-bold transition disabled:opacity-60"
                            style={{ borderColor: color.button, color: color.button }}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = color.button + "15" }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent" }}
                          >
                            {addingCardId === pack.idpack ? "…" : cardMessages[pack.idpack] === "✓" ? "Ajouté ✓" : (
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
                })}
              </div>

              {/* Pagination bullets */}
              {meta && meta.last_page > 1 && (
                <div className="mt-4 flex items-center justify-center gap-2">
                  {Array.from({ length: meta.last_page }, (_, i) => {
                    const p = i + 1
                    const isActive = p === page
                    return (
                      <button
                        key={p}
                        onClick={() => handlePageChange(p)}
                        aria-label={`Aller à la page ${p}`}
                      >
                        {isActive && loading ? (
                          <div className="h-3 w-3 animate-ping rounded-full bg-[#E94E6F]" />
                        ) : (
                          <div className={`h-3 w-3 rounded-full transition-all duration-300 ${
                            isActive
                              ? "scale-125 bg-[#E94E6F] shadow-md"
                              : "bg-[#E94E6F]/30 hover:bg-[#E94E6F]/60"
                          }`} />
                        )}
                      </button>
                    )
                  })}
                </div>
              )}

              {/* Carousel indicator dots (une seule page API) */}
              {packs.length > 1 && !(meta && meta.last_page > 1) && (
                <div className="mt-4 flex items-center justify-center gap-2">
                  {packs.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setFeaturedIndex(i)
                        const card = carouselRef.current?.children[i] as HTMLElement
                        card?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" })
                      }}
                      aria-label={`Pack ${i + 1}`}
                      className={`rounded-full transition-all duration-300 ${
                        i === featuredIndex
                          ? "h-3 w-3 bg-[#E94E6F]"
                          : "h-2.5 w-2.5 bg-[#E94E6F]/30 hover:bg-[#E94E6F]/60"
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* ── APERÇU DU PACK ── */}
              {featuredPack && (
                <section className="mt-12 overflow-hidden rounded-3xl border border-[#F1D9B5] bg-white shadow-sm">
                  <div className="border-b border-[#F1D9B5] px-6 py-4">
                    <p className="text-sm font-black text-[#2F236D]">
                      Aperçu du pack —{" "}
                      <span style={{ color: featuredColor.badge }}>{featuredPack.title}</span>
                    </p>
                  </div>

                  <div className="grid gap-8 p-6 md:grid-cols-[1fr_280px]">
                    {/* Grille activités réelles */}
                    <div>
                      {!loadingActivities && featuredActivities.length === 0 && (
                        <div className="flex h-40 items-center justify-center rounded-2xl border border-dashed border-[#E8DDD0] bg-[#F7F3EE] text-sm text-[#4F5F45]">
                          Aucune activité liée à ce pack pour le moment.
                        </div>
                      )}
                      <div className="grid grid-cols-4 gap-2">
                        {loadingActivities ? (
                          Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="animate-pulse rounded-xl bg-[#EDE7DA]" style={{ aspectRatio: "1" }} />
                          ))
                        ) : (
                          featuredActivities.slice(0, ACTIVITY_SLOTS).map((activity, i) => {
                            const isExtra = i === ACTIVITY_VISIBLE && extraCount > 0
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
                        )}
                      </div>
                      {/* Barre progression */}
                      <div className="relative mt-3 h-2 overflow-hidden rounded-full bg-[#F1D9B5]">
                        <div
                          className="absolute inset-y-0 left-0 rounded-full transition-all"
                          style={{
                            width: `${Math.min(100, (ACTIVITY_VISIBLE / Math.max(featuredPack.duration, ACTIVITY_VISIBLE)) * 100)}%`,
                            backgroundColor: featuredColor.badge,
                          }}
                        />
                      </div>
                      <p className="mt-1 text-right text-[10px] text-[#4F5F45]">
                        {ACTIVITY_VISIBLE}/{totalActivities} activités affichées
                      </p>
                    </div>

                    {/* Colonne droite — détails */}
                    <div className="flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl font-black text-[#2F236D]">{featuredPack.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-[#4F5F45]">
                          {featuredPack.description || "Un pack créatif prêt à l'emploi."}
                        </p>

                        {featuredBullets.length > 0 && (
                          <ul className="mt-3 space-y-1.5">
                            {featuredBullets.map((bullet, i) => (
                              <li key={i} className="flex items-start gap-2 text-xs text-[#4F5F45]">
                                <span
                                  className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full"
                                  style={{ backgroundColor: featuredColor.badge }}
                                />
                                {bullet.trim()}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>

                      <div className="mt-6">
                        <p className="mb-3 text-2xl font-black" style={{ color: featuredColor.badge }}>
                          {formatPrice(featuredPack.tarification)}
                        </p>
                        <button
                          onClick={handleAddToCart}
                          disabled={addingToCart}
                          className="block w-full rounded-full px-5 py-3 text-center text-sm font-bold text-white transition disabled:opacity-60"
                          style={{ backgroundColor: "#E94E6F" }}
                          onMouseEnter={(e) => { if (!addingToCart) e.currentTarget.style.backgroundColor = "#d63f5f" }}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#E94E6F")}
                        >
                          {addingToCart ? "Ajout en cours..." : "Ajouter au panier"}
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
              )}
            </>
          )}

          {/* ── BANDEAU NEWSLETTER ── */}
          <section className="relative mt-16 overflow-hidden rounded-3xl shadow-lg">
            {/* Image fond plein */}
            <img
              src={ctaPack}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover"
            />

            {/* Contenu centré entre les décorations gauche/droite */}
            <div className="relative z-10 flex flex-col items-center justify-center gap-4 px-[18%] py-10 md:flex-row md:gap-8">
              {/* Texte */}
              <div className="shrink-0 text-center md:text-left">
                <h2 className="text-lg font-black leading-snug text-white md:text-xl">
                  Ne ratez aucune nouveauté !
                </h2>
                <p className="mt-1 text-xs leading-5 text-white/80">
                  Recevez nos nouveaux packs et idées créatives.
                </p>
              </div>

              {/* Formulaire horizontal */}
              <form
                onSubmit={handleNewsletter}
                className="flex shrink-0 items-center overflow-hidden rounded-full bg-white shadow-sm"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={newsletterStatus === "success" ? "Inscrit ✓" : "Votre email"}
                  required
                  disabled={newsletterStatus === "loading" || newsletterStatus === "success"}
                  className="w-44 bg-transparent px-4 py-2.5 text-sm text-[#2F236D] placeholder-[#9B8FBF] outline-none disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={newsletterStatus === "loading" || newsletterStatus === "success"}
                  className="shrink-0 rounded-full bg-[#E94E6F] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#d63f5f] disabled:opacity-60"
                >
                  {newsletterStatus === "loading" ? "..." : newsletterStatus === "success" ? "✓" : "S'inscrire"}
                </button>
              </form>
            </div>
          </section>
        </main>
      </div>
    </>
  )
}
