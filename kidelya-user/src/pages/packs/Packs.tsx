import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import api from "@/api/axios"
import { PackArtwork } from "@/components/kidelya/PackArtwork"
import { formatPrice, mediaUrl } from "@/utils/media"
import packsBackground from "@/assets/image-fond-packs.png"
import NavFooter from "@/components/NavFooter"

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

function ReadyIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-5 w-5" fill="none">
      <rect x="8" y="14" width="32" height="24" rx="4" fill="#273068" fillOpacity="0.12" />
      <path d="M8 20h32" stroke="#273068" strokeWidth="2" />
      <path d="M16 12v6M32 12v6" stroke="#273068" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function AgeIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-5 w-5" fill="none">
      <circle cx="24" cy="24" r="15" stroke="#273068" strokeWidth="2.5" />
      <circle cx="24" cy="24" r="4" fill="#273068" />
      <path d="M24 9v4M24 35v4M9 24h4M35 24h4" stroke="#273068" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function EasyIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-5 w-5" fill="none">
      <path d="M14 25l7 7 13-16" stroke="#273068" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="24" cy="24" r="17" stroke="#273068" strokeWidth="2" strokeOpacity="0.35" />
    </svg>
  )
}

export default function PacksPage() {
  const [packs, setPacks] = useState<Pack[]>([])
  const [meta, setMeta] = useState<PaginationMeta | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
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

  useEffect(() => {
    const fetchPacks = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams({
          page: String(page),
          per_page: "50",
          search,
        })

        if (selectedType) params.set("type", selectedType)
        if (selectedSeason) params.set("season", selectedSeason)
        if (selectedAge) params.set("age", selectedAge)
        if (selectedTheme) params.set("theme", selectedTheme)

        const res = await api.get(`/public/packs?${params.toString()}`)
        setPacks(res.data.data || [])
        setMeta(res.data.meta || null)
        setFilterOptions(
          res.data.filters || {
            types: [],
            seasons: [],
            age_ranges: [],
            themes: [],
          }
        )
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

  const handlePageChange = (newPage: number) => {
    if (!meta || newPage < 1 || newPage > meta.last_page) return
    setPage(newPage)
  }

  const featuredPack = useMemo(() => (packs.length ? packs[0] : null), [packs])

  return (
    <>
    <div
      className="min-h-screen overflow-x-hidden bg-[#FFF9F0] bg-top bg-no-repeat text-[#21164F]"
      style={{ backgroundImage: `url(${packsBackground})`, backgroundSize: "100% auto" }}
    >
      <section className="relative mx-auto grid max-w-7xl items-center gap-10 px-6 pb-8 pt-14 lg:grid-cols-[1fr,1.1fr]">
        <div>
          <h1 className="max-w-xl text-4xl font-black leading-tight text-[#2F236D] md:text-5xl">
            Nos packs d'activités
            <span className="block text-[#E94E6F]">pour toutes les envies</span>
          </h1>

          <p className="mt-5 max-w-lg text-base leading-7 text-[#4F5F45]">
            Des activités clés en main pour éveiller la curiosité, créer, jouer et s'amuser à chaque saison.
          </p>

          <div className="mt-8 grid max-w-lg grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { label: "Prêts à l'emploi", icon: <ReadyIcon /> },
              { label: "Adaptés à l'âge", icon: <AgeIcon /> },
              { label: "Faciles à réaliser", icon: <EasyIcon /> },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl p-3 text-center text-xs font-semibold text-[#2F236D]">
                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#FFF3E0]">
                  {item.icon}
                </div>
                {item.label}
              </div>
            ))}
          </div>
        </div>

        <div className="relative hidden min-h-[340px] overflow-hidden rounded-[36px] p-3 lg:block">
          <PackArtwork title="Pack de printemps créatif" className="h-full w-full rounded-[28px]" />
          <div className="absolute inset-x-0 bottom-0 rounded-b-[28px] bg-gradient-to-t from-white/95 via-white/75 to-transparent p-5">
            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-[#2F236D]">Vue d'ensemble</p>
            <p className="text-xl font-black text-[#2F236D]">Nos packs créatifs</p>
            <p className="max-w-sm text-sm leading-6 text-[#4F5F45]">
              Filtrez, comparez et choisissez les activités adaptées à vos besoins.
            </p>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-6 pb-16">
        <div className="relative z-10 mb-8">
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="text"
              placeholder="Rechercher un pack..."
              value={search}
              onChange={(e) => {
                setPage(1)
                setSearch(e.target.value)
              }}
              className="h-11 w-full flex-1 rounded-xl border border-[#F1D9B5] bg-white/90 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#E94E6F]/30"
            />

            <select
              value={selectedAge}
              onChange={(e) => {
                setPage(1)
                setSelectedAge(e.target.value)
              }}
              className="h-11 min-w-[150px] rounded-xl border border-[#F1D9B5] bg-white/90 px-4 py-3 text-sm text-[#4F5F45] outline-none"
            >
              <option value="">Age</option>
              {filterOptions.age_ranges.map((ageRange) => (
                <option key={ageRange} value={ageRange}>
                  {ageRange.replace(/\+/g, "+").replace(/-/g, " - ")} ans
                </option>
              ))}
            </select>

            <select
              value={selectedTheme}
              onChange={(e) => {
                setPage(1)
                setSelectedTheme(e.target.value)
              }}
              className="h-11 min-w-[150px] rounded-xl border border-[#F1D9B5] bg-white/90 px-4 py-3 text-sm text-[#4F5F45] outline-none"
            >
              <option value="">Thème</option>
              {filterOptions.themes.map((theme) => (
                <option key={theme} value={theme}>
                  {theme}
                </option>
              ))}
            </select>

            <select
              value={selectedSeason}
              onChange={(e) => {
                setPage(1)
                setSelectedSeason(e.target.value)
              }}
              className="h-11 min-w-[150px] rounded-xl border border-[#F1D9B5] bg-white/90 px-4 py-3 text-sm text-[#4F5F45] outline-none"
            >
              <option value="">Saison</option>
              {filterOptions.seasons.map((season) => (
                <option key={season} value={season}>
                  {season}
                </option>
              ))}
            </select>

            <select
              value={selectedType}
              onChange={(e) => {
                setPage(1)
                setSelectedType(e.target.value)
              }}
              className="h-11 min-w-[180px] rounded-xl border border-[#F1D9B5] bg-white/90 px-4 py-3 text-sm text-[#4F5F45] outline-none"
            >
              <option value="">Type d'activité</option>
              {filterOptions.types.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center text-[#6F8D4C]">Chargement des packs...</div>
        ) : packs.length === 0 ? (
          <div className="py-16 text-center text-[#6F8D4C]">Aucun pack public trouvé.</div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
              {packs.map((pack, index) => {
                const image = mediaUrl(pack.illustration)

                return (
                  <article
                    key={pack.idpack}
                    className="group flex min-h-[390px] flex-col overflow-hidden rounded-2xl border border-[#F1D9B5] bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="relative">
                      {image ? (
                        <img src={image} alt={pack.title} className="h-44 w-full object-cover" />
                      ) : (
                        <PackArtwork title={pack.title} compact className="h-44" />
                      )}
                      {index % 4 === 0 && (
                        <span className="absolute left-3 top-3 rounded-full bg-[#FDE76F] px-3 py-1 text-xs font-bold text-[#2F236D]">
                          Nouveau
                        </span>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col p-5">
                      <h2 className="mb-2 text-lg font-black text-[#2F236D]">{pack.title}</h2>
                      <p className="line-clamp-3 text-sm leading-6 text-[#4F5F45]">{pack.description}</p>

                      <div className="mt-auto pt-5">
                        <p className="mb-2 text-xs font-semibold text-[#6F8D4C]">{pack.duration} jours</p>
                        <p className="mb-4 text-2xl font-black text-[#2F236D]">{formatPrice(pack.tarification)}</p>
                        <Link
                          to={`/packs/${pack.idpack}`}
                          className="block rounded-xl bg-[#E94E6F] px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-[#d63f5f]"
                        >
                          Voir le pack
                        </Link>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>

            {featuredPack && (
              <section className="mt-12 rounded-3xl border border-[#F1D9B5] bg-white/85 p-4 md:p-6">
                <p className="text-[11px] font-black uppercase tracking-[0.3em] text-[#2F236D]">Aperçu du pack</p>
                <div className="mt-3 grid gap-5 md:grid-cols-[220px_1fr]">
                  <div className="overflow-hidden rounded-2xl bg-[#F7EFCF]">
                    {mediaUrl(featuredPack.illustration) ? (
                      <img
                        src={mediaUrl(featuredPack.illustration)!}
                        alt={featuredPack.title}
                        className="h-full min-h-[180px] w-full object-cover"
                      />
                    ) : (
                      <PackArtwork title={featuredPack.title} className="h-[220px] w-full" />
                    )}
                  </div>

                  <div className="flex flex-col justify-between">
                    <div>
                      <h3 className="text-2xl font-black text-[#2F236D]">{featuredPack.title}</h3>
                      <p className="mt-3 max-w-2xl text-sm leading-6 text-[#4F5F45]">
                        {featuredPack.description || "Un pack créatif prêt à l'emploi pour vos activités."}
                      </p>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-4">
                      <span className="text-xs font-semibold text-[#6F8D4C]">{featuredPack.duration} jours</span>
                      <span className="text-xl font-black text-[#2F236D]">{formatPrice(featuredPack.tarification)}</span>
                      <Link
                        to={`/packs/${featuredPack.idpack}`}
                        className="rounded-xl bg-[#E94E6F] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#d63f5f]"
                      >
                        Voir ce pack
                      </Link>
                    </div>
                  </div>
                </div>
              </section>
            )}
          </>
        )}

        {meta && meta.last_page > 1 && (
          <div className="mt-8 flex items-center justify-center gap-3 text-sm">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page <= 1}
              className="rounded-lg border border-[#F1D9B5] bg-white px-3 py-2 disabled:opacity-40"
            >
              Précédent
            </button>
            <span className="text-[#6F8D4C]">
              Page {meta.current_page} / {meta.last_page}
            </span>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= meta.last_page}
              className="rounded-lg border border-[#F1D9B5] bg-white px-3 py-2 disabled:opacity-40"
            >
              Suivant
            </button>
          </div>
        )}
      </main>
    </div>
    <NavFooter />
    </>
  )
}