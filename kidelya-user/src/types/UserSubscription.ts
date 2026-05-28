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
