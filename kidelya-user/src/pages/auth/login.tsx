import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import InputError from "@/components/InputError"
import PasswordInput from "@/components/password-input"
import TextLink from "@/components/text-link"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/Spinner"
import api from "@/api/axios"
import { useAuth } from "@/context/useAuth"
import fontLogin from "@/assets/font-login.png"

type Props = {
  status?: string
  canResetPassword: boolean
  canRegister: boolean
}

export default function Login({ status, canResetPassword, canRegister }: Props) {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const redirectAfter = (location.state as { redirectAfter?: string } | null)?.redirectAfter ?? "/dashboard"
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [generalError, setGeneralError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})
    setGeneralError("")
    try {
      const res = await api.post("/login", { email, password })
      await login(res.data.token)
      navigate(redirectAfter)
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: { status?: number; data?: { message?: string; errors?: { email?: string[]; password?: string[] } } }
      }
      const be = axiosErr.response?.data?.errors || {}
      const msg = axiosErr.response?.data?.message || ""

      if (be.email || be.password) {
        setErrors({ email: be.email?.[0], password: be.password?.[0] })
      } else if (msg) {
        setGeneralError(msg === "Invalid credentials"
          ? "Identifiants incorrects. Vérifiez votre email et votre mot de passe."
          : msg)
      } else {
        setGeneralError("Une erreur est survenue. Veuillez réessayer.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-white p-3">

      <button
        type="button"
        onClick={() => navigate("/")}
        className="fixed right-4 top-4 z-50 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-[#273068] shadow backdrop-blur hover:bg-[#E94E6F] hover:text-white"
        aria-label="Fermer"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
          <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      </button>

      <div className="flex w-full max-w-[860px] overflow-hidden rounded-[20px] shadow-lg">

        {/* ── Colonne gauche ── */}
        <div className="flex w-[38%] shrink-0 flex-col bg-[#D5CDE2]">
          <div className="flex flex-col p-6 pb-0">
            <h2 className="text-xl font-black leading-snug text-[#7C67B2]">
              Bon retour sur{" "}
              <span className="text-[#E94E6F]">Kidelya&nbsp;!</span>
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#273068]">
              Retrouvez vos activités, vos plannings et vos souvenirs en quelques secondes.
            </p>

            <ul className="mt-6 space-y-4">
              <li className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#7C67B2]">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 text-white" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 6.5A2.5 2.5 0 017.5 4H19v15H7.5A2.5 2.5 0 015 21V6.5z" />
                    <path d="M8 8h8M8 12h8" />
                  </svg>
                </span>
                <div>
                  <p className="text-sm font-bold text-[#273068]">Vos activités</p>
                  <p className="text-xs text-[#273068]">Accédez à toute votre bibliothèque.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F1B9C3]">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 text-[#E94E6F]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="4" y="5" width="16" height="15" rx="2" />
                    <path d="M4 9h16M8 3v4M16 3v4" />
                  </svg>
                </span>
                <div>
                  <p className="text-sm font-bold text-[#273068]">Votre planning</p>
                  <p className="text-xs text-[#273068]">Reprenez là où vous en étiez.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FEF3CC]">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 text-[#F4BB48]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20s-7-4.5-7-9.3A4.3 4.3 0 019.3 6c1.2 0 2.2.6 2.7 1.4.5-.8 1.5-1.4 2.7-1.4A4.3 4.3 0 0119 10.7C19 15.5 12 20 12 20z" />
                  </svg>
                </span>
                <div>
                  <p className="text-sm font-bold text-[#273068]">Vos souvenirs</p>
                  <p className="text-xs text-[#273068]">Revivez les moments précieux.</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="mt-auto flex items-end justify-center overflow-hidden px-4">
            <img src={fontLogin} alt="Illustration Kidelya" className="w-full max-h-[240px] object-contain object-bottom" />
          </div>
        </div>

        {/* ── Colonne droite ── */}
        <div className="flex flex-1 flex-col justify-center bg-[#FFFEFA] px-8 py-10">
          <h1 className="text-3xl font-black text-[#7C67B2]">Connexion</h1>
          <p className="mt-2 text-sm text-[#273068]">
            Connectez-vous pour accéder à votre espace.
          </p>

          {status && (
            <div className="mt-4 rounded-xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
              {status}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="grid gap-1.5">
              <Label htmlFor="email" className="font-semibold text-[#273068]">Adresse e-mail</Label>
              <Input id="email" type="email" name="email" placeholder="votre@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus className="h-11 rounded-xl border border-[#D5CDE2] bg-[#FFFEFA]" />
              <InputError message={errors.email ?? null} />
            </div>

            <div className="grid gap-1.5">
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor="password" className="font-semibold text-[#273068]">Mot de passe</Label>
                {canResetPassword && (
                  <TextLink href="/forgot-password" className="text-xs text-[#273068] hover:text-[#E94E6F]">Mot de passe oublié ?</TextLink>
                )}
              </div>
              <PasswordInput id="password" name="password" placeholder="Votre mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} required className="h-11 rounded-xl border border-[#D5CDE2] bg-[#FFFEFA]" />
              <InputError message={errors.password ?? null} />
            </div>

            {generalError && (
              <div className="rounded-xl bg-[#F1B9C3] px-4 py-3 text-sm font-semibold text-[#E94E6F]">
                {generalError}
              </div>
            )}

            <Button type="submit" className="h-12 w-full rounded-xl bg-[#E94E6F] text-sm font-black text-white hover:bg-[#d63f5f]" disabled={loading}>
              {loading && <Spinner />}
              Se connecter
            </Button>

            <button
              type="button"
              onClick={() => {
                const apiBase = import.meta.env.VITE_API_URL ?? "/api"
                window.location.href = apiBase.replace(/\/api$/, "") + "/auth/google"
              }}
              className="flex h-12 w-full items-center justify-center gap-3 rounded-xl bg-[#D5CDE2] text-sm font-semibold text-[#273068] hover:bg-[#c5bbd2]"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
                <path d="M21.8 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.5c-.2 1.2-1 2.2-2 2.9v2.4h3.2c1.9-1.7 3-4.3 3-7.1z" fill="#4285F4"/>
                <path d="M12 22c2.7 0 5-1 6.7-2.6l-3.2-2.5c-.9.6-2 1-3.5 1-2.7 0-5-1.8-5.8-4.3H2.9v2.5C4.6 19.7 8 22 12 22z" fill="#34A853"/>
                <path d="M6.2 13.6c-.2-.6-.3-1.2-.3-1.8s.1-1.2.3-1.8V7.5H2.9C2.3 8.8 2 10.4 2 12s.3 3.2.9 4.5l3.3-2.9z" fill="#FBBC04"/>
                <path d="M12 5.5c1.5 0 2.8.5 3.8 1.5l2.9-2.9C16.9 2.5 14.7 1.5 12 1.5 8 1.5 4.6 3.8 2.9 7.2l3.3 2.6c.8-2.5 3.1-4.3 5.8-4.3z" fill="#EA4335"/>
              </svg>
              Continuer avec Google
            </button>
          </form>

          {canRegister && (
            <p className="mt-5 text-center text-sm text-[#444]">
              Pas de compte ?{" "}
              <TextLink href="/register" className="font-black text-[#E94E6F]">Créer un compte</TextLink>
            </p>
          )}

          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-[#273068]/60">
            <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M12 3l7 3v5c0 4.7-2.9 8.8-7 10-4.1-1.2-7-5.3-7-10V6l7-3z" />
            </svg>
            <span>Connexion sécurisée. Données protégées.</span>
          </div>
        </div>

      </div>
    </main>
  )
}
