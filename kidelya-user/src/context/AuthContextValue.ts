import type { Dispatch, SetStateAction } from "react"
import type { User } from "../types/User"

export interface AuthContextValue {
  user: User | null
  loading: boolean
  login: (token: string) => Promise<void>
  logout: () => void
  setUser: Dispatch<SetStateAction<User | null>>
}