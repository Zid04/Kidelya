import { useEffect, useState, useMemo, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { getLibraryActivities } from "@/services/ActivityService"
import { formatPrice, mediaUrl } from "@/utils/media"
import api from "@/api/axios"
import type { Activity } from "@/types/Activity"
import { useFavorites } from "@/hooks/useFavorites"
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
  illustration: string | null
}

const CARD_COLORS = [
  { badge: "#6F8D4C", button: "#6F8D4C", hover: "#5a7a3a" },
  { badge: "#E98B2A", button: "#E98B2A", hover: "#c9751f" },
  { badge: "#E94E6F", button: "#E94E6F", hover: "#d63f5f" },
  { badge: "#7C5CBF", button: "#7C5CBF", hover: "#6748a8" },
  { badge: "#4A90C4", button: "#4A90C4", hover: "#357aad" },
]

export default function BibliothequeIndex() {
  const navigate = useNavigate()
  const carouselRef = useRef<HTMLDivElement>(null)
  const { favActivityIds, favPackIds, toggleActivity, togglePack } = useFavorites()

  const [activities, setActivities] = useState<Activity[]>([])
  const [packs, setPacks] = useState<Pack[]>([])
  const [loading, setLoading] = useState(true)
  const [cartIds, setCartIds] = useState<Record<number, "adding" | "done">>({})

  async function handleAddToCart(activity: Activity, e: React.MouseEvent) {
    e.stopPropagation()
    setCartIds((prev) => ({ ...prev, [activity.idactivities]: "adding" }))
    try {
      await api.post("/cart/add", { idactivity: activity.idactivities })
      setCartIds((prev) => ({ ...prev, [activity.idactivities]: "done" }))
      setTimeout(() => setCartIds((prev) => { const n = { ...prev }; delete n[activity.idactivities]; return n }), 2000)
    } catch {
      setCartIds((prev) => { const n = { ...prev }; delete n[activity.idactivities]; return n })
    }
  }
  const [featuredIndex, setFeaturedIndex] = useState(0)
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

  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [themeFilter, setThemeFilter] = useState("all")
  const [ageFilter, setAgeFilter] = useState("all")
  const [seasonFilter, setSeasonFilter] = useState("all")

  useEffect(() => {
    async function load() {
      try {
        const [activitiesRes, packsRes] = await Promise.all([
          getLibraryActivities(),
          api.get("/public/packs?per_page=3"),
        ])
        setActivities(activitiesRes)
        const raw = packsRes.data
        setPacks(Array.isArray(raw?.data) ? raw.data : Array.isArray(raw) ? raw : [])
      } catch (err) {
        console.error("Erreur chargement bibliothèque :", err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

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

  const categories = useMemo(() => {
    const set = new Set<string>()
    activities.forEach((a) => a.category && set.add(a.category))
    return Array.from(set)
  }, [activities])

  const themes = useMemo(() => {
    const set = new Set<string>()
    activities.forEach((a) => a.themes?.forEach((t) => set.add(t.name)))
    return Array.from(set)
  }, [activities])

  const ageRanges = useMemo(() => {
    const set = new Set<string>()
    activities.forEach((a) => {
      if (a.agemin != null && a.agemax != null) set.add(`${a.agemin}-${a.agemax}`)
    })
    return Array.from(set)
  }, [activities])

  const seasons = useMemo(() => {
    const set = new Set<string>()
    activities.forEach((a) => a.season && set.add(a.season))
    return Array.from(set)
  }, [activities])

  const filtered = activities.filter((a) => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase())
    const matchCategory = categoryFilter === "all" || a.category === categoryFilter
    const matchTheme = themeFilter === "all" || a.themes?.some((t) => t.name === themeFilter)
    const matchAge = ageFilter === "all" || `${a.agemin}-${a.agemax}` === ageFilter
    const matchSeason = seasonFilter === "all" || a.season === seasonFilter
    return matchSearch && matchCategory && matchTheme && matchAge && matchSeason
  })

  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-[#21164F]">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-white">
        <div className="absolute right-0 top-0 hidden h-full w-[48%] lg:block">
          <img src={illuHero} alt="" aria-hidden="true" className="h-full w-full object-contain object-right-top" />
        </div>
        <div className="absolute inset-0 z-0 opacity-100 lg:hidden">
          <img src={illuHero} alt="" aria-hidden="true" className="h-full w-full object-contain object-right" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl pl-6 pb-0 pt-20 md:pt-28">
          <div className="max-w-[540px]">
            <h1 className="text-[32px] font-black leading-[1.12] text-[#2F236D] md:text-[44px]">
              Nos activités éducatives
              <br />
              pour vos enfants
            </h1>
            <p className="mt-5 max-w-[450px] text-[16px] leading-7 text-[#4F5F45]">
              Achetez des activités à l'unité, explorez nos packs thématiques ou débloquez tout avec l'abonnement.
            </p>

            <div className="mt-8 flex flex-nowrap gap-x-5">
              {[
                { title: "Des activités pour tous les âges",  description: "De 2 à 14 ans",      icon: iconSteam },
                { title: "Prêtes à l'emploi",                 description: "Faciles à réaliser", icon: iconFilters },
                { title: "Achat à l'unité",                   description: "Payez ce que vous aimez", icon: iconAward },
              ].map((item) => (
                <div key={item.title} className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center">
                    <img src={item.icon} alt="" className="h-8 w-8 object-contain" />
                  </div>
                  <div>
                    <p className="max-w-[150px] text-[13px] font-semibold leading-5 text-[#273068]">{item.title}</p>
                    <p className="mt-1 text-[11px] leading-4 text-[#4F5F45]">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FILTRES ── */}
      <div className="mx-auto my-5 flex w-full max-w-4xl flex-col items-center">
        <div className="flex w-full flex-wrap items-center justify-center gap-2 rounded-2xl border border-[#E8DDD0] bg-white px-6 py-5 shadow-md md:flex-nowrap md:px-16">

          <input
            type="text"
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 rounded-xl border border-[#E8DDD0] bg-transparent px-3 text-sm text-[#4F5F45] outline-none"
          />

          <div className="rounded-xl border border-[#E8DDD0]">
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-9 min-w-[110px] bg-transparent px-3 text-sm text-[#4F5F45] outline-none">
              <option value="all">Catégorie</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="rounded-xl border border-[#E8DDD0]">
            <select value={themeFilter} onChange={(e) => setThemeFilter(e.target.value)}
              className="h-9 min-w-[100px] bg-transparent px-3 text-sm text-[#4F5F45] outline-none">
              <option value="all">Thème</option>
              {themes.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div className="rounded-xl border border-[#E8DDD0]">
            <select value={ageFilter} onChange={(e) => setAgeFilter(e.target.value)}
              className="h-9 min-w-[90px] bg-transparent px-3 text-sm text-[#4F5F45] outline-none">
              <option value="all">Âge</option>
              {ageRanges.map((r) => <option key={r} value={r}>{r.replace("-", " - ")} ans</option>)}
            </select>
          </div>

          <div className="rounded-xl border border-[#E8DDD0]">
            <select value={seasonFilter} onChange={(e) => setSeasonFilter(e.target.value)}
              className="h-9 min-w-[100px] bg-transparent px-3 text-sm text-[#4F5F45] outline-none">
              <option value="all">Saison</option>
              {seasons.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <button
          onClick={() => { setSearch(""); setCategoryFilter("all"); setThemeFilter("all"); setAgeFilter("all"); setSeasonFilter("all") }}
          className="mt-2 text-xs font-semibold text-[#E94E6F] hover:underline"
        >
          Réinitialiser les filtres
        </button>
      </div>

      <main className="mx-auto max-w-7xl px-6 pb-20">

        {/* ── CAROUSEL D'ACTIVITÉS ── */}
        {loading ? (
          <div className="py-16 text-center text-[#6F8D4C]">Chargement des activités...</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-[#6F8D4C]">Aucune activité trouvée.</div>
        ) : (
          <>
            <div
              ref={carouselRef}
              onScroll={handleCarouselScroll}
              className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide"
              style={{ scrollSnapType: "x mandatory" }}
            >
              {filtered.map((a, index) => {
                const color = CARD_COLORS[index % CARD_COLORS.length]
                const isActive = index === featuredIndex
                const image = mediaUrl(a.photourl)

                return (
                  <article
                    key={a.idactivities}
                    onClick={() => setFeaturedIndex(index)}
                    style={{ scrollSnapAlign: "start", minWidth: "220px", maxWidth: "220px" }}
                    className={`flex cursor-pointer flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${
                      isActive ? "border-[#E94E6F] ring-2 ring-[#E94E6F]/30" : "border-[#F1D9B5]"
                    }`}
                  >
                    <div className="relative overflow-hidden">
                      {image ? (
                        <img src={image} alt={a.title} className="h-36 w-full object-cover" />
                      ) : (
                        <div className="flex h-36 w-full items-center justify-center text-3xl"
                          style={{ backgroundColor: color.badge + "20" }}>
                          🎨
                        </div>
                      )}
                      <button
                        onClick={(e) => toggleActivity(a.idactivities, e)}
                        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/80 shadow backdrop-blur-sm transition hover:bg-white"
                        title={favActivityIds.has(a.idactivities) ? "Retirer des favoris" : "Ajouter aux favoris"}
                      >
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill={favActivityIds.has(a.idactivities) ? "#E94E6F" : "none"} stroke="#E94E6F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                        </svg>
                      </button>
                    </div>

                    <div className="flex flex-1 flex-col p-4">
                      <h2 className="mb-1 text-sm font-black leading-snug" style={{ color: color.badge }}>
                        {a.title}
                      </h2>
                      <p className="line-clamp-2 text-xs leading-5 text-[#4F5F45]">
                        {a.agemin}-{a.agemax} ans • {a.duration} min • {a.category}
                      </p>

                      <div className="mt-auto pt-3">
                        <p className="mb-3 text-2xl font-black tracking-tight" style={{ color: color.badge }}>
                          {a.credit_price ? formatPrice(a.credit_price) : "Inclus"}
                        </p>

                        <div className="flex flex-col gap-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); navigate(`/library/${a.idactivities}`) }}
                            className="block rounded-full px-4 py-2 text-center text-xs font-bold text-white transition"
                            style={{ backgroundColor: color.button }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = color.hover)}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = color.button)}
                          >
                            Voir l'activité
                          </button>

                          {a.is_purchasable && a.credit_price && (
                            <button
                              onClick={(e) => handleAddToCart(a, e)}
                              disabled={cartIds[a.idactivities] === "adding"}
                              className="flex w-full items-center justify-center gap-1.5 rounded-full border px-4 py-2 text-center text-xs font-bold transition disabled:opacity-60"
                              style={{ borderColor: color.button, color: color.button }}
                              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = color.button + "15" }}
                              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent" }}
                            >
                              {cartIds[a.idactivities] === "adding" ? "…" : cartIds[a.idactivities] === "done" ? "Ajouté ✓" : (
                                <>
                                  <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                                    <path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61H19a2 2 0 001.99-1.74L22 6H6"/>
                                  </svg>
                                  Panier
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>

            {/* Dots carousel */}
            {filtered.length > 1 && (
              <div className="mt-4 flex items-center justify-center gap-2">
                {filtered.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setFeaturedIndex(i)
                      const card = carouselRef.current?.children[i] as HTMLElement
                      card?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" })
                    }}
                    aria-label={`Activité ${i + 1}`}
                    className={`rounded-full transition-all duration-300 ${
                      i === featuredIndex
                        ? "h-3 w-3 bg-[#E94E6F]"
                        : "h-2.5 w-2.5 bg-[#E94E6F]/30 hover:bg-[#E94E6F]/60"
                    }`}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* ── PACKS RECOMMANDÉS ── */}
        <section className="mt-16">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-black text-[#2F236D]">Packs recommandés 🎁</h2>
            <Link to="/packs" className="text-sm font-semibold text-[#E94E6F] hover:underline">
              Voir tous les packs →
            </Link>
          </div>

          {packs.length === 0 ? (
            <p className="text-sm text-[#6F8D4C]">Aucun pack disponible pour le moment.</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-3">
              {packs.map((pack, index) => {
                const color = CARD_COLORS[index % CARD_COLORS.length]
                const image = mediaUrl(pack.illustration)
                return (
                  <Link
                    key={pack.idpack}
                    to={`/packs/${pack.idpack}`}
                    className="relative flex flex-col overflow-hidden rounded-2xl border border-[#F1D9B5] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    {image ? (
                      <img src={image} alt={pack.title} className="h-40 w-full object-cover" />
                    ) : (
                      <div className="flex h-40 w-full items-center justify-center text-4xl"
                        style={{ backgroundColor: color.badge + "20" }}>
                        🎁
                      </div>
                    )}
                    <button
                      onClick={(e) => togglePack(pack.idpack, e)}
                      className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/80 shadow backdrop-blur-sm transition hover:bg-white"
                      title={favPackIds.has(pack.idpack) ? "Retirer des favoris" : "Ajouter aux favoris"}
                    >
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill={favPackIds.has(pack.idpack) ? "#E94E6F" : "none"} stroke="#E94E6F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                      </svg>
                    </button>
                    <div className="flex flex-1 flex-col p-4">
                      <h3 className="mb-1 font-black leading-snug" style={{ color: color.badge }}>{pack.title}</h3>
                      {pack.description && (
                        <p className="line-clamp-2 text-xs leading-5 text-[#4F5F45]">{pack.description}</p>
                      )}
                      <p className="mt-auto pt-3 text-xl font-black" style={{ color: color.badge }}>
                        {formatPrice(pack.tarification)}
                      </p>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </section>

        {/* ── BANDEAU NEWSLETTER / ABONNEMENT ── */}
        <section className="relative mt-16 overflow-hidden rounded-3xl shadow-lg">
          <img src={ctaPack} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" />
          <div className="relative z-10 flex flex-col items-center justify-center gap-4 px-[18%] py-10 md:flex-row md:gap-8">
            <div className="shrink-0 text-center md:text-left">
              <h2 className="text-lg font-black leading-snug text-white md:text-xl">
                Accédez à tout avec l'abonnement !
              </h2>
              <p className="mt-1 text-xs leading-5 text-white/80">
                Des centaines d'activités débloquées, sans limite.
              </p>
            </div>
            <div className="flex shrink-0 flex-col items-center gap-3 md:flex-row">
              <Link
                to="/abonnements"
                className="rounded-full bg-[#E94E6F] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[#d63f5f]"
              >
                S'abonner maintenant
              </Link>
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
                  className="w-40 bg-transparent px-4 py-2.5 text-sm text-[#2F236D] placeholder-[#9B8FBF] outline-none disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={newsletterStatus === "loading" || newsletterStatus === "success"}
                  className="shrink-0 rounded-full bg-[#2F236D] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#21164F] disabled:opacity-60"
                >
                  {newsletterStatus === "loading" ? "..." : newsletterStatus === "success" ? "✓" : "S'inscrire"}
                </button>
              </form>
            </div>
          </div>
        </section>

      </main>
    </div>
  )
}
