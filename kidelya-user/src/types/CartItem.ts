
export interface CartItem {
  id: number

  iduser: number
  idactivity?: number | null
  idpack?: number | null

  quantity: number

  created_at?: string
  updated_at?: string
}
