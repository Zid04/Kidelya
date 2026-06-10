export interface User {
  iduser: number
  firstname: string
  lastname: string
  email: string
  password: string
  is_active: boolean
  role?: string
    is_two_factor_enabled?: boolean
  created_at?: string
  updated_at?: string

  plan?: {
    name: string
    price: number
  }
  subscription?: {
    starts_at: string
    ends_at: string
    status: string
  }
}
