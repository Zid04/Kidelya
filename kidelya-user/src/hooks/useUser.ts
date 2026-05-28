import { useEffect, useState } from "react"
import api from "../api/axios"
import { getApiError } from "../utils/api-error"
import type { User } from "@/types/User"

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState<string[]>([])

  async function refreshUser() {
    try {
      const res = await api.get<User>("/users/me")
      setUser(res.data)
    } catch (err) {
      setErrors(getApiError(err))
    }
  }

  useEffect(() => {
    // On met la logique ici pour éviter les warnings React
    async function load() {
      try {
        const res = await api.get<User>("/users/me")
        setUser(res.data)
      } catch (err) {
        setErrors(getApiError(err))
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  return { user, loading, errors, refreshUser }
}
