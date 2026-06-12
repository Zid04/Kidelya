import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import api from "@/api/axios"

interface Transaction {
  id: number
  type: "activity" | "pack" | "credits" | "subscription"
  title: string
  amount: number
  status: "success" | "refunded" | "failed"
  created_at: string
  payment_ref?: string | null
}

const TYPE_LABEL: Record<Transaction["type"], string> = {
  activity:     "Activité",
  pack:         "Pack",
  credits:      "Crédits",
  subscription: "Abonnement",
}

export default function HistoriqueAchats() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/me/transactions")
        setTransactions(res.data.data || res.data)
      } catch {
        setError("Impossible de charger l'historique.")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#7C67B2]">
        Chargement de l'historique…
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white px-6 py-10 max-w-5xl mx-auto">

      {error && (
        <div className="mb-6 rounded-xl bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">{error}</div>
      )}

      {/* En-tête */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-black text-[#7C67B2]">Historique d'achat</h1>
        <Link
          to="/mes-achats"
          className="-ml-0 px-4 py-2 bg-[#E94E6F] text-white rounded-lg font-semibold hover:bg-[#d63f5f]"
        >
          Retour
        </Link>
      </div>

      {transactions.length === 0 && (
        <p className="text-[#273068] text-center py-10">Aucun achat pour le moment.</p>
      )}

      <div className="space-y-4">
        {transactions.map((t) => (
          <div
            key={t.id}
            className="bg-[#FFFEFA] rounded-xl shadow-sm p-5 flex justify-between items-center"
          >
            <div>
              <h3 className="text-lg font-semibold text-[#7C67B2]">{t.title}</h3>
              <p className="text-sm text-[#273068] mt-0.5">
                {new Date(t.created_at).toLocaleDateString("fr-FR")} · {TYPE_LABEL[t.type]}
              </p>
              {t.payment_ref && (
                <p className="text-xs text-[#273068] mt-1">Référence : {t.payment_ref}</p>
              )}
            </div>

            <div className="text-right">
              <p className="text-xl font-black text-[#E94E6F]">{t.amount.toFixed(2)} €</p>
              <span className={`mt-1 inline-block text-xs px-3 py-0.5 rounded-full font-semibold ${
                t.status === "success"  ? "bg-[#D5CDE2] text-[#7C67B2]" :
                t.status === "refunded" ? "bg-[#F4BB48]/30 text-[#273068]" :
                "bg-[#F1B9C3] text-[#E94E6F]"
              }`}>
                {t.status === "success" ? "Succès" : t.status === "refunded" ? "Remboursé" : "Échoué"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
