import { useEffect, useMemo, useState } from "react"
import api from "@/api/axios"

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
        const res = await api.get<SubscriptionResponse>("/me/subscription")
        setSubscription(res.data.subscription)
      } catch {
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
