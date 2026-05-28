import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

interface Transaction {
  id: number
  type: "activity" | "pack" | "credits" | "subscription"
  title: string
  amount: number
  status: "success" | "refunded" | "failed"
  created_at: string
  payment_ref?: string | null
}

export default function HistoriqueAchats() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/me/transactions")
        const json = await res.json()
        setTransactions(json.data || json)
      } catch (e) {
        console.error("Erreur chargement historique :", e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#6F8D4C]">
        Chargement de l’historique…
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FFF9F0] px-6 py-10 max-w-5xl mx-auto">

      {/* TITRE */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-[#93197D]">
          Historique d’achat 🌸
        </h1>

        <Link
          to="/mes-achats"
          className="px-4 py-2 bg-[#E94E6F] text-white rounded-lg font-semibold hover:bg-[#d63f5f]"
        >
          Retour
        </Link>
      </div>

      {/* SI AUCUNE TRANSACTION */}
      {transactions.length === 0 && (
        <p className="text-[#6F8D4C] text-center">
          Aucun achat pour le moment.
        </p>
      )}

      {/* LISTE DES TRANSACTIONS */}
      <div className="space-y-4">
        {transactions.map((t) => (
          <div
            key={t.id}
            className="bg-white rounded-xl shadow-sm border border-[#FDC600]/40 p-5 flex justify-between items-center"
          >
            {/* Infos principales */}
            <div>
              <h3 className="text-lg font-semibold text-[#93197D]">
                {t.title}
              </h3>

              <p className="text-sm text-[#6F8D4C]">
                {new Date(t.created_at).toLocaleDateString("fr-FR")} •{" "}
                {t.type === "activity" && "Activité"}
                {t.type === "pack" && "Pack"}
                {t.type === "credits" && "Crédits"}
                {t.type === "subscription" && "Abonnement"}
              </p>

              {t.payment_ref && (
                <p className="text-xs text-[#6F8D4C] mt-1">
                  Référence : {t.payment_ref}
                </p>
              )}
            </div>

            {/* Montant + statut */}
            <div className="text-right">
              <p className="text-xl font-bold text-[#E94E6F]">
                {t.amount.toFixed(2)} €
              </p>

              {t.status === "success" && (
                <span className="text-xs px-3 py-1 bg-[#DFFFD6] text-[#4C8D4C] rounded-full font-semibold">
                  Succès
                </span>
              )}

              {t.status === "refunded" && (
                <span className="text-xs px-3 py-1 bg-[#FFF3E0] text-[#E94E6F] rounded-full font-semibold">
                  Remboursé
                </span>
              )}

              {t.status === "failed" && (
                <span className="text-xs px-3 py-1 bg-[#FFE0E0] text-[#E94E6F] rounded-full font-semibold">
                  Échoué
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
