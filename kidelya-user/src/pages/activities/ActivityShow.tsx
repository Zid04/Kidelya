import { useEffect, useState } from "react"
import { useNavigate, useParams, Link } from "react-router-dom"
import { getMyActivity } from "../../services/ActivityService"
import type { Activity } from "@/types/Activity"

export default function ActivityShow() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [activity, setActivity] = useState<Activity | null>(null)
  const [loading, setLoading] = useState(true)
  const [accessDenied, setAccessDenied] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const data = await getMyActivity(Number(id))

        // 🔒 Vérification d’accès
        if (!data.is_owned && !data.has_subscription) {
          setAccessDenied(true)
          return
        }

        setActivity(data)
      } catch (err) {
        console.error("Erreur chargement activité :", err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  // ⏳ Chargement
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-[#6F8D4C]">
        Chargement de l’activité…
      </div>
    )
  }

  // ❌ ACCÈS REFUSÉ
  if (accessDenied) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
        <h2 className="text-2xl font-bold text-[#E94E6F] mb-4">Accès refusé</h2>
        <p className="text-[#6F8D4C] mb-6">
          Vous n’avez pas encore acheté cette activité.
        </p>

        <Link
          to="/packs"
          className="px-6 py-3 bg-[#E94E6F] text-white rounded-lg font-semibold"
        >
          Voir les packs
        </Link>

        <Link
          to="/abonnements"
          className="mt-3 px-6 py-3 bg-white border border-[#E94E6F] text-[#E94E6F] rounded-lg font-semibold"
        >
          Voir les abonnements
        </Link>
      </div>
    )
  }

  // ❓ Activité introuvable
  if (!activity) {
    return (
      <div className="text-center text-[#6F8D4C] mt-20">
        Activité introuvable.
      </div>
    )
  }

  // ✔️ ACCÈS AUTORISÉ → Affichage complet
  return (
    <div className="min-h-screen bg-[#FFF9F0] px-6 py-10 max-w-4xl mx-auto">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#93197D] flex items-center gap-2">
          {activity.title} <span className="text-[#FDC600]">🌸</span>
        </h1>

        <Link
          to={`/activites/${activity.idactivities}/edit`}
          className="px-4 py-2 bg-[#E94E6F] text-white rounded-lg font-semibold hover:bg-[#d63f5f]"
        >
          Modifier
        </Link>
      </div>

      {/* IMAGE */}
      {activity.photourl && (
        <img
          src={activity.photourl}
          alt={activity.title}
          className="rounded-xl w-full h-64 object-cover shadow mb-8"
        />
      )}

      {/* INFOS PRINCIPALES */}
      <div className="bg-white rounded-xl shadow-sm border border-[#FDC600]/40 p-6 mb-8">
        <h2 className="text-xl font-semibold text-[#93197D] mb-4">
          Informations générales
        </h2>

        <div className="grid grid-cols-2 gap-4 text-[#6F8D4C]">
          <p><strong>Âge :</strong> {activity.agemin ?? "?"}–{activity.agemax ?? "?"} ans</p>
          <p><strong>Durée :</strong> {activity.duration ? `${activity.duration} min` : "Non précisé"}</p>
          <p><strong>Catégorie :</strong> {activity.category ?? "Non précisé"}</p>
          <p><strong>Saison :</strong> {activity.season ?? "Non précisé"}</p>
          <p><strong>Lieu :</strong> {activity.location ?? "Non précisé"}</p>
        </div>
      </div>

      {/* DESCRIPTION */}
      {activity.description && (
        <div className="bg-white rounded-xl shadow-sm border border-[#FDC600]/40 p-6 mb-8">
          <h2 className="text-xl font-semibold text-[#93197D] mb-3">Description</h2>
          <p className="text-[#6F8D4C] whitespace-pre-line">{activity.description}</p>
        </div>
      )}

      {/* MATÉRIAUX */}
      {activity.materials && activity.materials.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-[#FDC600]/40 p-6 mb-8">
          <h2 className="text-xl font-semibold text-[#93197D] mb-3">Matériaux nécessaires</h2>
          <ul className="list-disc pl-6 text-[#6F8D4C]">
            {activity.materials.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        </div>
      )}

      {/* ÉTAPES */}
      {activity.steps && (
        <div className="bg-white rounded-xl shadow-sm border border-[#FDC600]/40 p-6 mb-8">
          <h2 className="text-xl font-semibold text-[#93197D] mb-3">Étapes</h2>
          <p className="text-[#6F8D4C] whitespace-pre-line">{activity.steps}</p>
        </div>
      )}

      {/* THÈMES */}
      {activity.themes && activity.themes.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-[#FDC600]/40 p-6 mb-8">
          <h2 className="text-xl font-semibold text-[#93197D] mb-3">Thèmes associés</h2>
          <div className="flex flex-wrap gap-2">
            {activity.themes.map((t) => (
              <span
                key={t.idtheme}
                className="px-3 py-1 bg-[#FFF3E0] text-[#6F8D4C] rounded-lg text-sm font-semibold"
              >
                {t.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* COMPÉTENCES */}
      {activity.competences && activity.competences.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-[#FDC600]/40 p-6 mb-8">
          <h2 className="text-xl font-semibold text-[#93197D] mb-3">Compétences associées</h2>
          <div className="flex flex-wrap gap-2">
            {activity.competences.map((c) => (
              <span
                key={c.idcompetence}
                className="px-3 py-1 bg-[#DFFFD6] text-[#4C8D4C] rounded-lg text-sm font-semibold"
              >
                {c.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* BOUTON RETOUR */}
      <div className="text-center mt-10">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-[#93197D] text-white rounded-lg font-semibold hover:bg-[#7a1467]"
        >
          Retour
        </button>
      </div>
    </div>
  )
}
