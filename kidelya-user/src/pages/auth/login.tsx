import { useState } from "react"
import { useNavigate } from "react-router-dom"
import InputError from "@/components/InputError"
import PasswordInput from "@/components/password-input"
import TextLink from "@/components/text-link"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/Spinner"
import api from "@/api/axios"
import bgLogin from "@/assets/arriere-plan-log.png"

type Props = {
  status?: string
  canResetPassword: boolean
  canRegister: boolean
}

export default function Login({ status, canResetPassword, canRegister }: Props) {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    try {
      await api.post("/login", { email, password })
      navigate("/dashboard")
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: { data?: { errors?: { email?: string[]; password?: string[] } } }
      }
      const backendErrors = axiosErr.response?.data?.errors || {}
      setErrors({
        email: backendErrors.email?.[0],
        password: backendErrors.password?.[0],
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-white">
      <div className="absolute inset-0 flex items-center justify-center">
        <img
          src={bgLogin}
          alt=""
          className="pointer-events-none h-full w-full select-none object-contain"
        />
      </div>

      <button
        type="button"
        onClick={() => navigate(-1)}
        className="absolute right-5 top-5 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#E94E6F] text-white shadow-md hover:bg-[#d63f5f]"
        aria-label="Fermer"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
          <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      </button>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">
        <section className="w-full max-w-[500px] rounded-[24px] bg-transparent px-6 py-8 text-center md:px-10">
          <h1 className="text-3xl font-black text-black">Connexion</h1>
          <p className="mt-4 text-sm font-medium text-[#4F4F4F]">
            Connectez-vous pour retrouver vos activites, packs et souvenirs.
          </p>

          {status && (
            <div className="mt-5 rounded-xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
              {status}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-5 text-left">
            <div className="grid gap-2">
              <Label htmlFor="email" className="font-semibold text-[#222]">
                Email*
              </Label>
              <Input
                id="email"
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                className="h-11 rounded-xl border border-[#F2A6B4] bg-transparent"
              />
              <InputError message={errors.email ?? null} />
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="password" className="font-semibold text-[#222]">
                  Mot de passe*
                </Label>
                {canResetPassword && (
                  <TextLink href="/forgot-password" className="text-sm text-[#273068]">
                    Mot de passe oublie ?
                  </TextLink>
                )}
              </div>
              <PasswordInput
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11 rounded-xl border border-[#F2A6B4] bg-transparent"
              />
              <InputError message={errors.password ?? null} />
            </div>

            <Button
              type="submit"
              className="h-12 w-full rounded-xl bg-[#E94E6F] text-sm font-black text-white hover:bg-[#d63f5f]"
              disabled={loading}
            >
              {loading && <Spinner />}
              Connexion
            </Button>

            <button
              type="button"
              className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-[#F2A6B4] bg-transparent text-sm font-bold text-[#222]"
            >
              <span className="text-lg font-black">G</span>
              Connexion avec Google
            </button>
          </form>

          {canRegister && (
            <p className="mt-5 text-sm font-medium text-[#444]">
              Vous n'avez pas de compte ?{" "}
              <TextLink href="/register" className="font-black text-[#E94E6F]">
                Inscription
              </TextLink>
            </p>
          )}
        </section>
      </div>
    </main>
  )
}