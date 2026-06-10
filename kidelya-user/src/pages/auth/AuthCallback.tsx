import { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useAuth } from "@/context/useAuth"

export default function AuthCallback() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { login } = useAuth()

  useEffect(() => {
    const token = searchParams.get("token")
    const error = searchParams.get("error")

    if (error || !token) {
      navigate("/login?error=google_failed")
      return
    }

    login(token).then(() => navigate("/dashboard"))
  }, [])

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="text-center">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#E94E6F] border-t-transparent" />
        <p className="text-sm text-[#273068]">Connexion avec Google en cours…</p>
      </div>
    </div>
  )
}
