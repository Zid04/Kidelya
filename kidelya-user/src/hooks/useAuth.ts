import { useState } from "react"
import api from "../api/axios"
import { getApiError } from "../utils/api-error"
import { useLocalStorage } from "./useLocalStorage"

export function useAuth() {
  const [user, setUser] = useLocalStorage("user", null)
  const [token, setToken] = useLocalStorage("token", "")
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  async function login(email: string, password: string) {
    setLoading(true)
    setErrors([])

    try {
      const res = await api.post("/login", { email, password })
      setUser(res.data.user)
      setToken(res.data.token)
    } catch (err) {
      setErrors(getApiError(err))
    } finally {
      setLoading(false)
    }
  }

  function logout() {
    setUser(null)
    setToken("")
  }

  return { user, token, login, logout, loading, errors }
}
