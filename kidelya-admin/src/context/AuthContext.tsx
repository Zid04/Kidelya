import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import api from '../api/axios'

interface User {
  iduser: number
  firstname: string
  lastname: string
  email: string
  is_active: boolean
  idrole: number
  credit_balance: number
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)
  const isMounted = useRef(true)

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }, [])

  useEffect(() => {
    isMounted.current = true

    if (!token) {
      if (isMounted.current) setLoading(false)
      return () => { isMounted.current = false }
    }

    api.get('/users/me')
      .then(res => {
        if (isMounted.current) setUser(res.data.data)
      })
      .catch(() => {
        if (isMounted.current) logout()
      })
      .finally(() => {
        if (isMounted.current) setLoading(false)
      })

    return () => { isMounted.current = false }
  }, [token, logout])

  const login = async (email: string, password: string): Promise<void> => {
    const res = await api.post('/admin/login', { email, password })
    localStorage.setItem('token', res.data.token)
    setToken(res.data.token)
    setUser(res.data.user)
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
