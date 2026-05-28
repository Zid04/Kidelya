export interface Subscription {
  id: number
  user_id: number
  pack_id: number
  status: "active" | "inactive" | "canceled" | "expired"
  started_at?: string
  expires_at?: string
  created_at?: string
  updated_at?: string
}
