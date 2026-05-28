import type { User } from "./User"
import type { Activity } from "./Activity"
import type { Pack } from "./Pack"

export interface Favorite {
  id: number

  iduser: number
  idactivity?: number | null
  idpack?: number | null

  created_at?: string
  updated_at?: string

  user?: User
  activity?: Activity
  pack?: Pack
}
