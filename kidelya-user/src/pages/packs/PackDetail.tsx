import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import api from "@/api/axios"
import { PackArtwork } from "@/components/kidelya/PackArtwork"
import { formatPrice, mediaUrl } from "@/utils/media"
import { useFavorites } from "@/hooks/useFavorites"

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
  const { favPackIds, togglePack } = useFavorites()

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
      alert("Pack ajouté au panier !")
    } catch (e) {
      alert("Erreur lors de l'ajout au panier.")
    } finally {
      setAdding(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FFFEFA] text-[#7C67B2]">
        Chargement du pack...
      </div>
    )
  }

  if (!pack) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FFFEFA] text-[#7C67B2]">
        Pack introuvable.
      </div>
    )
  }

  const packImage = mediaUrl(pack.illustration)
  const activitiesCount = pack.activities?.length ?? 0

  return (
    <div className="min-h-screen bg-[#FFFEFA] text-[#273068]">
      <main className="mx-auto max-w-7xl px-6 py-10">
        {/* Fil d'Ariane */}
        <div className="mb-8 text-sm text-[#273068]">
          <Link to="/" className="hover:text-[#E94E6F]">Accueil</Link>
          <span className="mx-2">/</span>
          <Link to="/packs" className="hover:text-[#E94E6F]">Packs d'activités</Link>
          <span className="mx-2">/</span>
          <span className="font-semibold text-[#7C67B2]">{pack.title}</span>
        </div>

        {/* Hero */}
        <section className="grid gap-10 lg:grid-cols-[1.1fr,1fr,0.9fr]">
          <div>
            <div className="overflow-hidden rounded-3xl bg-[#FFFEFA] shadow-md">
              {packImage ? (
                <img src={packImage} alt={pack.title} className="h-96 w-full object-cover" />
              ) : (
                <PackArtwork title={pack.title} className="h-96" />
              )}
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <p className="mb-3 text-sm font-black uppercase tracking-wide text-[#E94E6F]">
              Pack thématique
            </p>
            <h1 className="mb-5 text-4xl font-black leading-tight text-[#7C67B2]">
              {pack.title}
            </h1>
            <p className="mb-7 text-base leading-7 text-[#273068]">
              {pack.description}
            </p>

            <div className="grid gap-4 text-sm sm:grid-cols-2">
              <div className="rounded-2xl bg-[#D5CDE2] p-4">
                <span className="block text-xs font-bold text-[#7C67B2] mb-1">Âge</span>
                <span className="text-[#273068] font-semibold">{pack.min_age ?? 3} - {pack.max_age ?? 8} ans</span>
              </div>
              <div className="rounded-2xl bg-[#D5CDE2] p-4">
                <span className="block text-xs font-bold text-[#7C67B2] mb-1">Durée</span>
                <span className="text-[#273068] font-semibold">{minDuration && maxDuration ? `${minDuration} - ${maxDuration} min` : "Durée variable"}</span>
              </div>
              <div className="rounded-2xl bg-[#D5CDE2] p-4">
                <span className="block text-xs font-bold text-[#7C67B2] mb-1">Niveau</span>
                <span className="text-[#273068] font-semibold">{pack.level ?? "Facile"}</span>
              </div>
              <div className="rounded-2xl bg-[#D5CDE2] p-4">
                <span className="block text-xs font-bold text-[#7C67B2] mb-1">Contenu</span>
                <span className="text-[#273068] font-semibold">{activitiesCount} activités incluses</span>
              </div>
            </div>
          </div>

          {/* Aside achat */}
          <aside className="h-fit rounded-3xl bg-[#FFFEFA] p-7 shadow-md">
            <h2 className="mb-3 text-lg font-bold text-[#7C67B2]">Prix</h2>
            <p className="mb-6 text-4xl font-black text-[#E94E6F]">
              {formatPrice(pack.tarification)}
            </p>
            <div className="mb-5 rounded-2xl bg-[#F1B9C3]/30 p-4 text-sm">
              <div className="flex items-center justify-between font-bold text-[#273068]">
                <span>Achat unique</span>
                <span>{formatPrice(pack.tarification)}</span>
              </div>
              <p className="mt-1 text-xs text-[#6F8D4C]">Accès au pack après achat.</p>
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
              className="block w-full rounded-xl bg-[#D5CDE2] px-4 py-3 text-center text-sm font-bold text-[#7C67B2] hover:bg-[#c5bbd2]"
            >
              Voir les abonnements
            </Link>
            <button
              onClick={(e) => togglePack(pack.idpack, e)}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-[#E94E6F] px-4 py-3 text-sm font-semibold text-[#E94E6F] hover:bg-[#F1B9C3]/20 transition-colors"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill={favPackIds.has(pack.idpack) ? "#E94E6F" : "none"} stroke="#E94E6F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              {favPackIds.has(pack.idpack) ? "En favoris" : "Ajouter aux favoris"}
            </button>
            <p className="mt-5 text-center text-xs font-semibold text-[#6F8D4C]">
              Paiement sécurisé
            </p>
          </aside>
        </section>

        {/* Bénéfices */}
        <section className="mt-10 grid gap-4 rounded-3xl bg-[#D5CDE2] p-5 md:grid-cols-4">
          {[
            ["Activités variées", "Des activités prêtes à réaliser."],
            ["Téléchargement", "Accès rapide après achat."],
            ["Imprimables", "Fiches utiles et pratiques."],
            ["Adapté enfants", "Pensé pour un usage simple."],
          ].map(([title, text]) => (
            <div key={title} className="rounded-2xl bg-[#FFFEFA] p-4">
              <h3 className="font-black text-[#7C67B2]">{title}</h3>
              <p className="mt-1 text-xs leading-5 text-[#273068]">{text}</p>
            </div>
          ))}
        </section>

        {/* Activités du pack + À propos */}
        <section className="mt-10 grid gap-8 lg:grid-cols-[1.35fr,0.65fr]">
          <div className="rounded-3xl bg-[#FFFEFA] p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-black text-[#7C67B2]">
                Ce pack contient {activitiesCount} activités
              </h2>
              <span className="text-sm font-bold text-[#E94E6F]">Aperçu</span>
            </div>

            {pack.activities && pack.activities.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {pack.activities.map((activity, index) => {
                  const image = mediaUrl(activity.photourl)
                  return (
                    <Link
                      key={activity.idactivities}
                      to={`/activities/pack/${activity.idactivities}`}
                      className="flex items-center gap-4 rounded-2xl bg-[#D5CDE2] p-3 transition hover:opacity-80"
                    >
                      {image ? (
                        <img src={image} alt={activity.title} className="h-16 w-16 rounded-xl object-cover" />
                      ) : (
                        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[#7C67B2] text-sm font-black text-white">
                          {index + 1}
                        </div>
                      )}
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-black text-[#273068]">
                          {activity.title}
                        </h3>
                        <div className="mt-1 flex flex-wrap gap-1">
                          <span className="rounded-full bg-[#F1B9C3] px-2 py-0.5 text-[10px] font-bold text-[#E94E6F]">
                            {activity.agemin}-{activity.agemax} ans
                          </span>
                          <span className="rounded-full bg-[#D8EAF2] px-2 py-0.5 text-[10px] font-bold text-[#7BA7C0]">
                            {activity.duration} min
                          </span>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            ) : (
              <p className="text-sm text-[#273068]">
                Les activités de ce pack seront bientôt disponibles.
              </p>
            )}
          </div>

          <aside className="rounded-3xl bg-[#D5CDE2] p-7">
            <h2 className="mb-4 text-xl font-black text-[#7C67B2]">
              À propos de ce pack
            </h2>
            <p className="text-sm leading-7 text-[#273068]">
              {pack.description || "Un pack Kidelya pensé pour proposer des moments créatifs, simples et adaptés aux enfants."}
            </p>
            <div className="mt-6 space-y-3 text-sm text-[#273068]">
              {["Occuper les enfants à la maison", "Activités en famille", "Ateliers en groupe", "Moments créatifs"].map((item) => (
                <p key={item} className="font-semibold">✓ {item}</p>
              ))}
            </div>
          </aside>
        </section>

        {/* Packs similaires */}
        <section className="mt-10">
          <h2 className="mb-5 text-xl font-black text-[#7C67B2]">
            Ils ont aussi aimé
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
                    className="overflow-hidden rounded-2xl bg-[#FFFEFA] shadow-sm hover:shadow-md transition-shadow"
                  >
                    {image ? (
                      <img src={image} alt={p.title} className="h-36 w-full object-cover" />
                    ) : (
                      <PackArtwork title={p.title} compact className="h-36" />
                    )}
                    <div className="p-4">
                      <p className="text-xs font-black uppercase text-[#E94E6F]">Pack thématique</p>
                      <h3 className="mt-1 font-black text-[#273068]">{p.title}</h3>
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
