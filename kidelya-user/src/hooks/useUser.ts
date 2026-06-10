import { useEffect, useState } from "react"
import api from "../api/axios"
import { getApiError } from "../utils/api-error"
import type { User } from "@/types/User"

type ApiResponse = { data: User }

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState<string[]>([])

  async function refreshUser() {
    try {
      const res = await api.get<ApiResponse>("/users/me")
      setUser(res.data.data)
    } catch (err) {
      setErrors(getApiError(err))
    }
  }

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get<ApiResponse>("/users/me")
        setUser(res.data.data)
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
