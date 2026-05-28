import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import api from "@/api/axios"
import { PackArtwork } from "@/components/kidelya/PackArtwork"
import { formatPrice, mediaUrl } from "@/utils/media"

type Activity = {
  idactivities: number
  title: string
  duration: number
  agemin: number
  agemax: number
  photourl: string | null
}

type Competence = {
  idcompetence: number
  name: string
}

type Pack = {
  idpack: number
  title: string
  description: string | null
  tarification: number | string
  duration: number
  illustration: string | null
  min_age?: number | null
  max_age?: number | null
  level?: string | null
  activities?: Activity[]
  competences?: Competence[]
}

export default function PackDetail() {
  const { idpack } = useParams()
  const [pack, setPack] = useState<Pack | null>(null)
  const [relatedPacks, setRelatedPacks] = useState<Pack[]>([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)

  const durations = pack?.activities?.map((a) => a.duration) ?? []
  const minDuration = durations.length ? Math.min(...durations) : null
  const maxDuration = durations.length ? Math.max(...durations) : null

  useEffect(() => {
    const fetchPack = async () => {
      setLoading(true)
      try {
        const res = await api.get(`/public/packs/${idpack}`)
        setPack(res.data.data || res.data)

        const relatedRes = await api.get("/public/packs?per_page=50")
        setRelatedPacks(relatedRes.data.data || [])
      } catch (e) {
        console.error(e)
        setPack(null)
        setRelatedPacks([])
      } finally {
        setLoading(false)
      }
    }

    fetchPack()
  }, [idpack])

  const addToCart = async () => {
    if (!pack) return
    setAdding(true)

    try {
      await api.post("/cart/add", { idpack: pack.idpack, quantity: 1 })
      alert("Pack ajoute au panier !")
    } catch (e) {
      console.error(e)
      alert("Erreur lors de l'ajout au panier.")
    } finally {
      setAdding(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FFF9F0] text-[#6F8D4C]">
        Chargement du pack...
      </div>
    )
  }

  if (!pack) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FFF9F0] text-[#6F8D4C]">
        Pack introuvable.
      </div>
    )
  }

  const packImage = mediaUrl(pack.illustration)
  const activitiesCount = pack.activities?.length ?? 0

  return (
    <div className="min-h-screen bg-[#FFF9F0] text-[#21164F]">
      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 text-sm text-[#6F8D4C]">
          <Link to="/" className="hover:text-[#E94E6F]">Accueil</Link>
          <span className="mx-2">/</span>
          <Link to="/packs" className="hover:text-[#E94E6F]">Packs d'activites</Link>
          <span className="mx-2">/</span>
          <span className="font-semibold text-[#2F236D]">{pack.title}</span>
        </div>

        <section className="grid gap-10 lg:grid-cols-[1.1fr,1fr,0.9fr]">
          <div>
            <div className="overflow-hidden rounded-3xl border border-[#F1D9B5] bg-white shadow-md">
              {packImage ? (
                <img
                  src={packImage}
                  alt={pack.title}
                  className="h-96 w-full object-cover"
                />
              ) : (
                <PackArtwork title={pack.title} className="h-96" />
              )}
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <p className="mb-3 text-sm font-black uppercase tracking-wide text-[#E94E6F]">
              Pack thematique
            </p>
            <h1 className="mb-5 text-4xl font-black leading-tight text-[#2F236D]">
              {pack.title}
            </h1>
            <p className="mb-7 text-base leading-7 text-[#4F5F45]">
              {pack.description}
            </p>

            <div className="grid gap-4 text-sm text-[#2F236D] sm:grid-cols-2">
              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <span className="block text-xs font-bold text-[#6F8D4C]">Age</span>
                {pack.min_age ?? 3} - {pack.max_age ?? 8} ans
              </div>
              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <span className="block text-xs font-bold text-[#6F8D4C]">Activites</span>
                {minDuration && maxDuration ? `${minDuration} - ${maxDuration} min` : "Duree variable"}
              </div>
              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <span className="block text-xs font-bold text-[#6F8D4C]">Niveau</span>
                {pack.level ?? "Facile"}
              </div>
              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <span className="block text-xs font-bold text-[#6F8D4C]">Contenu</span>
                {activitiesCount} activites incluses
              </div>
            </div>
          </div>

          <aside className="h-fit rounded-3xl border border-[#F1D9B5] bg-white p-7 shadow-lg">
            <h2 className="mb-3 text-lg font-bold text-[#2F236D]">Prix</h2>
            <p className="mb-6 text-4xl font-black text-[#E94E6F]">
              {formatPrice(pack.tarification)}
            </p>
            <div className="mb-5 rounded-2xl border border-[#E94E6F]/40 bg-[#FFF5F7] p-4 text-sm">
              <div className="flex items-center justify-between font-bold text-[#2F236D]">
                <span>Achat unique</span>
                <span>{formatPrice(pack.tarification)}</span>
              </div>
              <p className="mt-1 text-xs text-[#6F8D4C]">Acces au pack apres achat.</p>
            </div>
            <button
              onClick={addToCart}
              disabled={adding}
              className="mb-3 w-full rounded-xl bg-[#E94E6F] px-4 py-3 text-sm font-bold text-white shadow transition hover:bg-[#d63f5f] disabled:opacity-50"
            >
              {adding ? "Ajout..." : "Ajouter au panier"}
            </button>
            <Link
              to="/abonnements"
              className="block w-full rounded-xl border border-[#8F6BC8] bg-white px-4 py-3 text-center text-sm font-bold text-[#2F236D] hover:bg-[#F5F0FF]"
            >
              Voir les abonnements
            </Link>
            <p className="mt-5 text-center text-xs font-semibold text-[#6F8D4C]">
              Paiement securise
            </p>
          </aside>
        </section>

        <section className="mt-10 grid gap-4 rounded-3xl border border-[#F1D9B5] bg-white/80 p-5 shadow-sm md:grid-cols-4">
          {[
            ["Activites variees", "Des activites pretes a realiser."],
            ["Telechargement", "Acces rapide apres achat."],
            ["Imprimables", "Fiches utiles et pratiques."],
            ["Adapte enfants", "Pense pour un usage simple."],
          ].map(([title, text]) => (
            <div key={title} className="rounded-2xl bg-white p-4">
              <h3 className="font-black text-[#2F236D]">{title}</h3>
              <p className="mt-1 text-xs leading-5 text-[#6F8D4C]">{text}</p>
            </div>
          ))}
        </section>

        <section className="mt-10 grid gap-8 lg:grid-cols-[1.35fr,0.65fr]">
          <div className="rounded-3xl border border-[#F1D9B5] bg-white p-6 shadow-md">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-black text-[#2F236D]">
                Ce pack contient {activitiesCount} activites
              </h2>
              <span className="text-sm font-bold text-[#8F6BC8]">Apercu</span>
            </div>

            {pack.activities && pack.activities.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {pack.activities.map((activity, index) => {
                  const image = mediaUrl(activity.photourl)
                  return (
                    <Link
                      key={activity.idactivities}
                      to={`/activities/pack/${activity.idactivities}`}
                      className="flex items-center gap-4 rounded-2xl border border-[#F1D9B5] p-3 transition hover:bg-[#FFF9F0]"
                    >
                      {image ? (
                        <img src={image} alt={activity.title} className="h-16 w-16 rounded-xl object-cover" />
                      ) : (
                        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[#FFF3E0] text-sm font-black text-[#E94E6F]">
                          {index + 1}
                        </div>
                      )}
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-black text-[#2F236D]">
                          {activity.title}
                        </h3>
                        <p className="text-xs text-[#6F8D4C]">
                          {activity.agemin}-{activity.agemax} ans · {activity.duration} min
                        </p>
                      </div>
                    </Link>
                  )
                })}
              </div>
            ) : (
              <p className="text-sm text-[#6F8D4C]">
                Les activites de ce pack seront bientot disponibles.
              </p>
            )}
          </div>

          <aside className="rounded-3xl bg-[#FFF0F2] p-7">
            <h2 className="mb-4 text-xl font-black text-[#2F236D]">
              A propos de ce pack
            </h2>
            <p className="text-sm leading-7 text-[#4F5F45]">
              {pack.description || "Un pack Kidelya pense pour proposer des moments creatifs, simples et adaptes aux enfants."}
            </p>
            <div className="mt-6 space-y-3 text-sm text-[#2F236D]">
              {["Occuper les enfants a la maison", "Activites en famille", "Ateliers en groupe", "Moments creatifs"].map((item) => (
                <p key={item} className="font-semibold">✓ {item}</p>
              ))}
            </div>
          </aside>
        </section>

        <section className="mt-10">
          <h2 className="mb-5 text-xl font-black text-[#2F236D]">
            Ils ont aussi aime
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {relatedPacks
              .filter((p) => p.idpack !== pack.idpack)
              .slice(0, 4)
              .map((p) => {
                const image = mediaUrl(p.illustration)
                return (
                  <Link
                    key={p.idpack}
                    to={`/packs/${p.idpack}`}
                    className="overflow-hidden rounded-2xl border border-[#F1D9B5] bg-white shadow-md"
                  >
                    {image ? (
                      <img src={image} alt={p.title} className="h-36 w-full object-cover" />
                    ) : (
                      <PackArtwork title={p.title} compact className="h-36" />
                    )}
                    <div className="p-4">
                      <p className="text-xs font-black uppercase text-[#E94E6F]">Pack thematique</p>
                      <h3 className="mt-1 font-black text-[#2F236D]">{p.title}</h3>
                      <p className="mt-2 text-sm font-bold text-[#E94E6F]">
                        {formatPrice(p.tarification)}
                      </p>
                    </div>
                  </Link>
                )
              })}
          </div>
        </section>
      </main>
    </div>
  )
}
