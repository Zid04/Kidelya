import { useEffect, useMemo, useState } from "react"

export interface Subscription {
  idsubscription: number
  type: "monthly" | "annual" | "trial"
  status: "active" | "expired" | "canceled"
  start_date: string
  end_date: string
}

interface SubscriptionResponse {
  subscription: Subscription | null
}

export function useSubscription() {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/me/subscription")
        const json: SubscriptionResponse = await res.json()
        setSubscription(json.subscription)
      } catch (e) {
        console.error("Erreur abonnement :", e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // Calcul pur, sans Date.now(), dans un useMemo
  const isActive = useMemo(() => {
    if (!subscription) return false
    if (subscription.status !== "active") return false

    const end = new Date(subscription.end_date).getTime()
    const now = new Date().getTime() 

    return end > now
  }, [subscription])

  return { subscription, isActive, loading }
}
