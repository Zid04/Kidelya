import type { ReactNode } from "react"
import { useSubscription } from "../hooks/useSubscription"

interface Props {
  children: ReactNode
}

export default function ProtectedSubscription({ children }: Props) {
  const { isActive, loading } = useSubscription()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#6F8D4C]">
        Vérification de votre abonnement…
      </div>
    )
  }

  if (!isActive) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
        <h2 className="text-2xl font-bold text-[#E94E6F] mb-4">
          Accès réservé 🔒
        </h2>

        <p className="text-[#6F8D4C] mb-6">
          Cette fonctionnalité est disponible uniquement avec un abonnement actif.
        </p>

        <a
          href="/abonnements"
          className="px-6 py-3 bg-[#E94E6F] text-white rounded-lg font-semibold"
        >
          Voir les abonnements
        </a>
      </div>
    )
  }

  return <>{children}</>
}
