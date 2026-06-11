// Formule tarifaire proposée sur la page abonnements
export interface SubscriptionPlan {
  idplan: number
  name: "Free" | "Monthly" | "Annual"
  price: number | string
  interval: "none" | "month" | "year"
  interval_count: number
  has_all_packs: boolean
  has_planning: boolean
  is_active: boolean
}

// Abonnement actif d'un utilisateur (stocké en DB)
export interface UserSubscription {
  idsubscription: number
  iduser: number
  idplan: number
  starts_at: string | null
  ends_at: string | null
  status: "active" | "inactive" | "expired" | "canceled"
  created_at?: string
  updated_at?: string
}
