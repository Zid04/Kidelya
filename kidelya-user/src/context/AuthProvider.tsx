import type { ReactNode } from "react"
import { useEffect, useState } from "react"
import type { User } from "../types/User"
import { usersApi } from "@/api/user"
import { load, save, remove } from "@/utils/storage"
import { AuthContext } from "./AuthContext"

export function AuthProvider({ children }: { children: ReactNode }) {
 const initialToken = load("token", null) 

  const [loading, setLoading] = useState<boolean>(!!initialToken)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    if (!initialToken) return

    let mounted = true

    usersApi
      .me()
      .then((res) => {
        if (mounted) setUser(res.data)
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [initialToken])

  const login = async (token: string) => {
    save("token", token)
    const res = await usersApi.me()
    setUser(res.data)
  }

  const logout = () => {
    remove("token")
    setUser(null)
    window.location.href = "/login"
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}