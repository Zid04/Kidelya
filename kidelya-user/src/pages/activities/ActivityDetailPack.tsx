import { useEffect, useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import api from "@/api/axios"
import { mediaUrl } from "@/utils/media"
import { createPackCheckout } from "@/services/ActivityService"
import { ActivityHero } from "./components/ActivityHero"
import { OverviewTab } from "./components/OverviewTab"
import { StepsTab } from "./components/StepsTab"
import { MaterialTab } from "./components/MaterialTab"
import { InformationsTab } from "./components/InformationsTab"
import { CompetencesTab } from "./components/CompetencesTab"
import type { Activity, Tab } from "./components/types"

const TABS: { key: Tab; label: string }[] = [
  { key: "apercu",       label: "Aperçu" },
  { key: "etapes",       label: "Étapes" },
  { key: "materiel",     label: "Matériel" },
  { key: "informations", label: "Informations" },
  { key: "competences",  label: "Compétences" },
]

export default function ActivityDetailPack() {
  const { idactivities } = useParams()
  const navigate = useNavigate()
  const [activity, setActivity] = useState<Activity | null>(null)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<Tab>("apercu")
  const [buying, setBuying]     = useState(false)

  useEffect(() => {
    setLoading(true)
    setError(null)
    api.get(`/activities/${idactivities}`)
      .then((res) => setActivity(res.data.data || res.data))
      .catch(() => setError("Impossible de charger cette activité."))
      .finally(() => setLoading(false))
  }, [idactivities])

  async function handleGoToPack() {
    const packId = activity?.packs?.[0]?.idpack
    if (!packId) { navigate("/packs"); return }
    setBuying(true)
    try {
      const url = await createPackCheckout(packId)
      window.location.href = url
    } catch {
      setError("Impossible de lancer le paiement. Veuillez réessayer.")
      setBuying(false)
    }
  }

  if (loading) return (
    <div className="flex min-h-[60vh] items-center justify-center text-[#8F6BC8]">Chargement…</div>
  )

  if (error) return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <h2 className="text-2xl font-black text-[#E94E6F]">Erreur</h2>
      <p className="text-gray-400">{error}</p>
      <Link to="/packs" className="rounded-xl bg-[#E94E6F] px-6 py-3 text-sm font-bold text-white">Retour aux packs</Link>
    </div>
  )

  if (!activity) return (
    <div className="flex min-h-[60vh] items-center justify-center text-gray-400">Activité introuvable.</div>
  )

  const canAccess = activity.is_owned === true || activity.has_subscription === true
  const materials = Array.isArray(activity.materials) ? activity.materials : []
  const image     = mediaUrl(activity.photourl)

  return (
    <div className="min-h-screen bg-[#FFFEFA]">
      <ActivityHero
        activity={activity}
        canAccess={canAccess}
        buying={buying}
        image={image}
        onBuyPack={handleGoToPack}
        onBack={() => navigate(-1)}
      />

      {/* Onglets */}
      <div className="mb-6 border-b border-[#D5CDE2]">
        <div className="flex gap-6">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`pb-3 text-sm font-semibold transition-colors ${
                activeTab === t.key
                  ? "border-b-2 border-[#7C67B2] text-[#7C67B2]"
                  : "text-[#273068] hover:text-[#7C67B2]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "apercu"       && <OverviewTab activity={activity} canAccess={canAccess} materials={materials} onBuyPack={handleGoToPack} buying={buying} />}
      {activeTab === "etapes"       && <StepsTab steps={activity.steps} canAccess={canAccess} onBuyPack={handleGoToPack} buying={buying} />}
      {activeTab === "materiel"     && <MaterialTab materials={materials} canAccess={canAccess} onBuyPack={handleGoToPack} buying={buying} />}
      {activeTab === "informations" && <InformationsTab activity={activity} />}
      {activeTab === "competences"  && <CompetencesTab competences={activity.competences ?? []} />}
    </div>
  )
}
