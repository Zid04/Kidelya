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

export default function PacksSection() {
  const [packs, setPacks] = useState<Pack[]>([])

  useEffect(() => {
    const fetchPacks = async () => {
      try {
        const res = await api.get("/public/packs?per_page=50")
        const published = Array.isArray(res.data?.data)
          ? res.data.data.filter((p: Pack) => p.is_published)
          : []

        setPacks(published.sort(() => Math.random() - 0.5).slice(0, 4))
      } catch (err) {
        console.error("Erreur recuperation packs :", err)
        setPacks([])
      }
    }

    fetchPacks()
  }, [])

  return (
    <section className="bg-transparent py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-9 text-center">
          <h2 className="text-2xl font-extrabold text-[#273068] md:text-[26px]">
            Nos packs d’activités
          </h2>

          <div className="mx-auto mt-3 h-[3px] w-12 rounded-full bg-[#E94E6F]" />

          <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[#5F5F5F]">
            Des thèmes variés pour toutes les saisons et toutes les envies !
          </p>
        </div>

        <div className="mx-auto flex max-w-5xl flex-wrap justify-center gap-5">
          {packs.map((pack) => {
            const image = mediaUrl(pack.illustration)

            return (
              <article
                key={pack.idpack}
                className="flex min-h-[300px] w-full max-w-[230px] flex-col overflow-hidden rounded-lg border border-[#F2DEC2] bg-[#FFFDF8] shadow-[0_4px_14px_rgba(39,48,104,0.08)] sm:w-[230px]"
              >
                <div className="h-[150px] w-full overflow-hidden bg-[#F7EFCF]">
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
                  <h3 className="text-[13px] font-extrabold leading-5 text-[#273068]">
                    {pack.title}
                  </h3>

                  <p className="mt-2 line-clamp-3 flex-1 text-[11px] leading-5 text-[#333333]">
                    {pack.description}
                  </p>

                  <Link
                    to={`/packs/${pack.idpack}`}
                    className="mt-4 text-[12px] font-bold text-[#E94E6F] hover:text-[#d63f5f]"
                  >
                    Voir le pack →
                  </Link>
                </div>
              </article>
            )
          })}
        </div>

        <div className="mt-9 flex justify-center">
          <Link
            to="/packs"
            className="rounded-[9px] bg-[#E94E6F] px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#d63f5f]"
          >
            Voir tous les packs
          </Link>
        </div>
      </div>
    </section>
  )
}