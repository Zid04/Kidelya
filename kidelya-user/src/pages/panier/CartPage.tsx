import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"

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
  tarification: number
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

  // Calcul durée min/max
  const getMinDuration = () =>
    pack?.activities?.length
      ? Math.min(...pack.activities.map((a) => a.duration))
      : null

  const getMaxDuration = () =>
    pack?.activities?.length
      ? Math.max(...pack.activities.map((a) => a.duration))
      : null

  useEffect(() => {
    const fetchPack = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/packs/${idpack}`)
        const data = await res.json()
        setPack(data.data || data)

        const relatedRes = await fetch(`/api/packs?limit=4`)
        const relatedData = await relatedRes.json()
        setRelatedPacks(relatedData.data || [])
      } catch (e) {
        console.error(e)
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
      await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idpack: pack.idpack,
          quantity: 1,
        }),
      })
      alert("Pack ajouté au panier !")
    } catch (e) {
      console.error(e)
      alert("Erreur lors de l'ajout au panier.")
    } finally {
      setAdding(false)
    }
  }

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-[#6F8D4C]">
        Chargement du pack…
      </div>
    )

  if (!pack)
    return (
      <div className="min-h-screen flex items-center justify-center text-[#6F8D4C]">
        Pack introuvable.
      </div>
    )

  return (
    <div className="min-h-screen bg-[#FFF9F0]">

      {/* HERO */}
      <div className="max-w-6xl mx-auto px-6 py-10 grid lg:grid-cols-3 gap-10">

        {/* COLONNE GAUCHE : illustration */}
        <div>
          {pack.illustration && (
            <img
              src={pack.illustration}
              alt={pack.title}
              className="rounded-2xl shadow-md w-full h-80 object-cover"
            />
          )}
        </div>

        {/* COLONNE CENTRALE : infos */}
        <div className="flex flex-col justify-center">
          <span className="px-4 py-1 bg-[#E94E6F] text-white text-xs font-semibold rounded-full w-fit mb-3">
            Pack thématique
          </span>

          <h1 className="text-3xl font-bold text-[#93197D] mb-4">
            {pack.title}
          </h1>

          <div className="space-y-2 text-[#6F8D4C] text-sm">
            <p>👶 Âge recommandé : {pack.min_age ?? 3}–{pack.max_age ?? 8} ans</p>
            {pack.level && <p>🌼 Niveau : {pack.level}</p>}
            <p>
              ⏱️ Durée des activités : {getMinDuration()}–{getMaxDuration()} min
            </p>
          </div>
        </div>

        {/* COLONNE DROITE : prix + actions */}
        <div className="bg-white rounded-2xl shadow-md border border-[#FDC600]/40 p-6">
          <h3 className="text-lg font-semibold text-[#93197D] mb-2">Prix</h3>

          <p className="text-3xl font-bold text-[#E94E6F] mb-4">
            {pack.tarification.toFixed(2)} €
          </p>

          <div className="text-sm text-[#6F8D4C] mb-4">
            Paiement unique :{" "}
            <span className="font-semibold text-[#93197D]">
              {pack.tarification.toFixed(2)} €
            </span>
          </div>

          <button
            onClick={addToCart}
            disabled={adding}
            className="w-full px-4 py-3 bg-[#E94E6F] hover:bg-[#d63f5f] text-white text-sm font-semibold rounded-lg shadow transition-colors mb-3 disabled:opacity-50"
          >
            {adding ? "Ajout..." : "Mettre dans le panier"}
          </button>

          <Link
            to="/abonnements"
            className="block w-full text-center px-4 py-3 bg-white border border-[#E94E6F]/40 text-[#E94E6F] text-sm font-semibold rounded-lg hover:bg-[#FFF5F7] transition-colors"
          >
            Voir les abonnements
          </Link>

          <p className="text-xs text-[#6F8D4C] mt-3 text-center">
            Paiement sécurisé
          </p>
        </div>
      </div>

      {/* BANDEAU HORIZONTAL */}
      <div className="max-w-6xl mx-auto px-6 py-6 grid md:grid-cols-2 gap-4">

        <div className="bg-white rounded-xl shadow-sm border border-[#FDC600]/40 p-4 text-center">
          <h4 className="text-[#93197D] font-semibold mb-1">
            Plusieurs activités
          </h4>
          <p className="text-xs text-[#6F8D4C]">
            Des activités variées, adaptées et prêtes à l’emploi pas à pas.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-[#FDC600]/40 p-4 text-center">
          <h4 className="text-[#93197D] font-semibold mb-1">
            Adapté aux enfants
          </h4>
          <p className="text-xs text-[#6F8D4C]">
            Activités testées et approuvées de tous.
          </p>
        </div>
      </div>

      {/* ACTIVITÉS */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h2 className="text-xl font-semibold text-[#93197D] mb-4">
          {pack.activities?.length ?? 0} activités incluses
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          {pack.activities?.map((activity) => (
            <div
              key={activity.idactivities}
              className="bg-white rounded-xl shadow-sm border border-[#FDC600]/40 p-4 flex items-center gap-4"
            >
              {activity.photourl && (
                <img
                  src={activity.photourl}
                  alt={activity.title}
                  className="w-16 h-16 rounded-lg object-cover"
                />
              )}
              <div className="flex-1">
                <h3 className="text-[#93197D] font-semibold text-sm mb-1">
                  {activity.title}
                </h3>
                <p className="text-xs text-[#6F8D4C]">
                  {activity.agemin}–{activity.agemax} ans • {activity.duration} min
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* COMPÉTENCES */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h3 className="text-xl font-semibold text-[#93197D] mb-4">
          Ce pack développe :
        </h3>

        {pack.competences && pack.competences.length > 0 ? (
          <ul className="text-sm text-[#6F8D4C] list-disc list-inside space-y-1">
            {pack.competences.map((c) => (
              <li key={c.idcompetence}>{c.name}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-[#6F8D4C]">Aucune compétence associée.</p>
        )}
      </div>

      {/* PACKS SIMILAIRES */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h3 className="text-xl font-semibold text-[#93197D] mb-6">
          Ils ont aussi aimé
        </h3>

        <div className="grid md:grid-cols-4 gap-6">
          {relatedPacks.map((p) => (
            <Link
              key={p.idpack}
              to={`/packs/${p.idpack}`}
              className="bg-white rounded-xl shadow-md border border-[#FDC600]/40 overflow-hidden hover:scale-[1.02] transition-transform"
            >
              {p.illustration && (
                <img
                  src={p.illustration}
                  alt={p.title}
                  className="h-32 w-full object-cover"
                />
              )}
              <div className="p-4">
                <h4 className="text-[#93197D] font-semibold text-sm mb-1">
                  {p.title}
                </h4>
                <p className="text-xs text-[#6F8D4C]">
                  {p.tarification.toFixed(2)} €
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  )
}
