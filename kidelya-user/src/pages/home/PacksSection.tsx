import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import api from "@/api/axios"
import { PackArtwork } from "@/components/kidelya/PackArtwork"
import { mediaUrl } from "@/utils/media"

export type Pack = {
  idpack: number
  title: string
  description?: string | null
  tarification: number | string
  duration: number
  createdby: number
  illustration?: string | null
  is_published: boolean
  type?: string | null
}

const packColors = [
  { bg: "#6F8D4C", text: "#6F8D4C", imageBg: "#D6E8C0" },
  { bg: "#FDC600", text: "#FDC600", imageBg: "#FFF1A8" },
  { bg: "#E94E6F", text: "#E94E6F", imageBg: "#FDDDE4" },
  { bg: "#93197D", text: "#93197D", imageBg: "#F0C6EA" },
  { bg: "#0094A8", text: "#0094A8", imageBg: "#C2EEF4" },
]

export default function PacksSection() {
  const [packs, setPacks] = useState<Pack[]>([])

  useEffect(() => {
    const fetchPacks = async () => {
      try {
        const res = await api.get("/public/packs?per_page=50")
        const published = Array.isArray(res.data?.data)
          ? res.data.data.filter((p: Pack) => p.is_published)
          : []
        setPacks(published.sort(() => Math.random() - 0.5).slice(0, 5))
      } catch (err) {
        setPacks([])
      }
    }
    fetchPacks()
  }, [])

  return (
    <section className="bg-transparent py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-9 text-center">
          <h2 className="text-2xl font-extrabold text-[var(--app-text)] md:text-[26px]">
            Nos packs d'activités
          </h2>
          <div className="mx-auto mt-3 h-[3px] w-12 rounded-full bg-[#E94E6F]" />
          <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[var(--app-muted)]">
            Des thèmes variés pour toutes les saisons et toutes les envies !
          </p>
        </div>

        <div className="mx-auto flex max-w-5xl flex-wrap justify-center gap-5">
          {packs.map((pack, index) => {
            const image = mediaUrl(pack.illustration)
            const color = packColors[index % packColors.length]

            return (
              <article
                key={pack.idpack}
                className="flex min-h-[300px] w-full max-w-[200px] flex-col overflow-hidden rounded-xl border border-[var(--app-border)] bg-[var(--app-card)] shadow-[0_4px_14px_rgba(39,48,104,0.08)] sm:w-[200px]"
              >
                {/* Zone image avec fond coloré */}
                <div
                  className="h-[160px] w-full overflow-hidden"
                  style={{ backgroundColor: color.imageBg }}
                >
                  {image ? (
                    <img
                      src={image}
                      alt={pack.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <PackArtwork
                      title={pack.title}
                      compact
                      className="h-full w-full"
                    />
                  )}
                </div>

                <div className="flex flex-1 flex-col px-4 pb-4 pt-4 text-center">
                  <h3
                    className="text-[13px] font-extrabold leading-5"
                    style={{ color: color.text }}
                  >
                    {pack.title}
                  </h3>

                  <p className="mt-2 line-clamp-3 flex-1 text-[11px] leading-5 text-[var(--app-muted)]">
                    {pack.description}
                  </p>

                  <Link
                    to={`/packs/${pack.idpack}`}
                    className="mt-4 flex items-center justify-center gap-1 text-[12px] font-bold hover:opacity-75"
                    style={{ color: color.text }}
                  >
                    Voir le pack
                    <svg viewBox="0 0 19 19" fill="none" className="h-[14px] w-[14px]">
                      <path
                        d="M4 9.5H15M15 9.5L10.5 5M15 9.5L10.5 14"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Link>
                </div>
              </article>
            )
          })}
        </div>

        <div className="mt-9 flex justify-center">
          <Link
            to="/packs"
            className="flex items-center gap-2 rounded-[9px] bg-[#E94E6F] px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#d63f5f]"
          >
            Voir tous les packs
            <svg viewBox="0 0 19 19" fill="none" className="h-4 w-4">
              <path
                d="M4 9.5H15M15 9.5L10.5 5M15 9.5L10.5 14"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}