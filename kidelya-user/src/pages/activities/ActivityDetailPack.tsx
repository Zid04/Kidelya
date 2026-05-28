import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import api from "@/api/axios"
import { PackArtwork } from "@/components/kidelya/PackArtwork"
import { mediaUrl } from "@/utils/media"

interface Activity {
  idactivities: number
  title: string
  description?: string | null
  agemin?: number | null
  agemax?: number | null
  duration?: number | null
  photourl?: string | null
  steps?: string | null
  category?: string | null
  difficulty?: string | null
  materials?: string[] | null
  competences?: { idcompetence: number; name: string }[]
  created_at?: string
  is_owned?: boolean
  has_subscription?: boolean
}

export default function ActivityDetailPack() {
  const { idactivities } = useParams()
  const [activity, setActivity] = useState<Activity | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchActivity = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await api.get(`/activities/${idactivities}`)
        const act = res.data.data || res.data

        if (act.is_owned === false && act.has_subscription === false) {
          setError("Vous n'avez pas encore acces a cette activite.")
        }

        setActivity(act)
      } catch (e) {
        console.error(e)
        setError("Impossible de charger cette activite.")
      } finally {
        setLoading(false)
      }
    }

    fetchActivity()
  }, [idactivities])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FFF9F0] text-[#6F8D4C]">
        Chargement...
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#FFF9F0] px-6 text-center">
        <h2 className="mb-4 text-2xl font-black text-[#E94E6F]">Acces refuse</h2>
        <p className="mb-6 text-[#6F8D4C]">{error}</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/packs" className="rounded-xl bg-[#E94E6F] px-6 py-3 font-bold text-white">
            Voir les packs
          </Link>
          <Link to="/abonnements" className="rounded-xl border border-[#E94E6F] bg-white px-6 py-3 font-bold text-[#E94E6F]">
            Voir les abonnements
          </Link>
        </div>
      </div>
    )
  }

  if (!activity) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FFF9F0] text-[#6F8D4C]">
        Activite introuvable.
      </div>
    )
  }

  const image = mediaUrl(activity.photourl)

  return (
    <div className="min-h-screen bg-[#FFF9F0] text-[#21164F]">
      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 text-sm text-[#6F8D4C]">
          <Link to="/packs" className="font-semibold hover:text-[#E94E6F]">Retour aux packs</Link>
        </div>

        <section className="grid gap-10 lg:grid-cols-[1fr,1fr]">
          <div className="overflow-hidden rounded-3xl border border-[#F1D9B5] bg-white shadow-md">
            {image ? (
              <img src={image} alt={activity.title} className="h-[430px] w-full object-cover" />
            ) : (
              <PackArtwork title={activity.title} className="h-[430px]" />
            )}
          </div>

          <div className="flex flex-col justify-center">
            <p className="mb-3 text-sm font-black uppercase tracking-wide text-[#E94E6F]">
              Activite du pack
            </p>
            <h1 className="mb-5 text-4xl font-black leading-tight text-[#2F236D]">
              {activity.title}
            </h1>
            <p className="mb-7 text-base leading-7 text-[#4F5F45]">
              {activity.description}
            </p>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <span className="block text-xs font-bold text-[#6F8D4C]">Age</span>
                {activity.agemin ?? "?"} - {activity.agemax ?? "?"} ans
              </div>
              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <span className="block text-xs font-bold text-[#6F8D4C]">Duree</span>
                {activity.duration ? `${activity.duration} min` : "Variable"}
              </div>
              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <span className="block text-xs font-bold text-[#6F8D4C]">Niveau</span>
                {activity.difficulty ?? "Facile"}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-8 lg:grid-cols-[1.35fr,0.65fr]">
          <div className="rounded-3xl border border-[#F1D9B5] bg-white p-7 shadow-md">
            <h2 className="mb-4 text-xl font-black text-[#2F236D]">Description</h2>
            <p className="leading-7 text-[#4F5F45]">{activity.description}</p>

            {activity.steps && (
              <div className="mt-8">
                <h3 className="mb-3 text-lg font-black text-[#2F236D]">Etapes</h3>
                <p className="whitespace-pre-line text-sm leading-7 text-[#4F5F45]">
                  {activity.steps}
                </p>
              </div>
            )}
          </div>

          <aside className="rounded-3xl bg-[#FFF0F2] p-7">
            <h2 className="mb-4 text-xl font-black text-[#2F236D]">Infos utiles</h2>
            <div className="space-y-3 text-sm text-[#4F5F45]">
              <p><strong>Categorie :</strong> {activity.category ?? "Non precise"}</p>
              <p><strong>Materiel :</strong> {activity.materials?.length ? `${activity.materials.length} elements` : "Non precise"}</p>
              <p><strong>Competences :</strong> {activity.competences?.length ?? 0}</p>
            </div>
          </aside>
        </section>
      </main>
    </div>
  )
}
