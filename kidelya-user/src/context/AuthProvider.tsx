import type { ReactNode } from "react"
import { useEffect, useState } from "react"
import type { User } from "../types/User"
import { usersApi } from "@/api/user"
import { load, save, remove } from "@/utils/storage"
import { AuthContext } from "./AuthContext"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Chargement initial — exécuté une seule fois au montage
  useEffect(() => {
    const token = load("token", null)
    if (!token) {
      setLoading(false)
      return
    }

    let mounted = true
    usersApi
      .me()
      .then((res) => { if (mounted) setUser(res.data) })
      .catch(() => { if (mounted) setUser(null) })
      .finally(() => { if (mounted) setLoading(false) })

    return () => { mounted = false }
  }, [])

  const login = async (token: string) => {
    // On vide l'ancien utilisateur et on signale le chargement
    setUser(null)
    setLoading(true)
    save("token", token)
    try {
      const res = await usersApi.me()
      setUser(res.data)
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await usersApi.logout()
    } catch { /* on continue même si l'appel échoue */ }
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
