import { useNavigate } from "react-router-dom"
import { useState } from "react"
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

export default function Register() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    password_confirmation: "",
  })
  const [errors, setErrors] = useState<{
    firstname?: string; lastname?: string; email?: string
    password?: string; password_confirmation?: string
  }>({})
  const [acceptCGU, setAcceptCGU] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: { target: { name: string; value: string } }) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})
    try {
      const res = await api.post("/register", form)
      await login(res.data.token)
      navigate("/dashboard")
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: { data?: { errors?: { firstname?: string[]; lastname?: string[]; email?: string[]; password?: string[]; password_confirmation?: string[] } } }
      }
      const e = axiosErr.response?.data?.errors || {}
      setErrors({
        firstname: e.firstname?.[0], lastname: e.lastname?.[0],
        email: e.email?.[0], password: e.password?.[0],
        password_confirmation: e.password_confirmation?.[0],
      })
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

      <div className="flex w-full max-w-[960px] overflow-hidden rounded-[20px] shadow-lg">

        {/* ── Colonne gauche ── */}
        <div className="flex w-[38%] shrink-0 flex-col bg-[#D5CDE2]">
          <div className="flex flex-col p-6 pb-0">
            <h2 className="text-xl font-black leading-snug text-[#7C67B2]">
              Rejoignez Kidelya{" "}
              <span className="text-[#E94E6F]">et profitez d'activités créatives et ludiques&nbsp;!</span>
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#273068]">
              Créez votre compte et accédez à des centaines d'activités adaptées à chaque âge.
            </p>

            <ul className="mt-6 space-y-4">
              <li className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#7C67B2]">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 text-white" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16v16H4z M8 12h8M8 8h8M8 16h4" />
                  </svg>
                </span>
                <div>
                  <p className="text-sm font-bold text-[#273068]">Des activités variées</p>
                  <p className="text-xs text-[#273068]">Des centaines d'activités prêtes à l'emploi ou à créer vous-même.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F1B9C3]">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 text-[#E94E6F]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="5" y="2" width="14" height="20" rx="2" /><path d="M9 12h6M9 16h4" />
                  </svg>
                </span>
                <div>
                  <p className="text-sm font-bold text-[#273068]">Organisation simplifiée</p>
                  <p className="text-xs text-[#273068]">Du lundi au vendredi, 9h à 18h.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FEF3CC]">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 text-[#F4BB48]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" />
                  </svg>
                </span>
                <div>
                  <p className="text-sm font-bold text-[#273068]">Des souvenirs précieux</p>
                  <p className="text-xs text-[#273068]">Vous y trouverez les réponses à vos questions.</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="mt-auto flex items-end justify-center overflow-hidden px-4">
            <img src={fontLogin} alt="Illustration Kidelya" className="w-full max-h-[240px] object-contain object-bottom" />
          </div>
        </div>

        {/* ── Colonne droite ── */}
        <div className="flex flex-1 flex-col justify-center overflow-y-auto bg-[#FFFEFA] px-8 py-8">
          <h1 className="text-3xl font-black text-[#7C67B2]">Créer votre compte</h1>
          <p className="mt-2 text-sm text-[#273068]">
            Déjà un compte ?{" "}
            <TextLink href="/login" className="font-bold text-[#E94E6F]">Se connecter</TextLink>
          </p>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-1.5">
                <Label htmlFor="firstname" className="font-semibold text-[#273068]">Prénom</Label>
                <Input id="firstname" name="firstname" type="text" placeholder="Votre prénom" value={form.firstname} onChange={handleChange} required className="h-11 rounded-xl border border-[#D5CDE2] bg-[#FFFEFA]" />
                <InputError message={errors.firstname ?? null} />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="lastname" className="font-semibold text-[#273068]">Nom</Label>
                <Input id="lastname" name="lastname" type="text" placeholder="Votre nom" value={form.lastname} onChange={handleChange} required className="h-11 rounded-xl border border-[#D5CDE2] bg-[#FFFEFA]" />
                <InputError message={errors.lastname ?? null} />
              </div>
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="email" className="font-semibold text-[#273068]">Adresse e-mail</Label>
              <Input id="email" name="email" type="email" placeholder="votre@email.com" value={form.email} onChange={handleChange} required className="h-11 rounded-xl border border-[#D5CDE2] bg-[#FFFEFA]" />
              <InputError message={errors.email ?? null} />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="password" className="font-semibold text-[#273068]">Mot de passe</Label>
              <PasswordInput id="password" name="password" placeholder="Créez votre mot de passe" value={form.password} onChange={handleChange} required className="h-11 rounded-xl border border-[#D5CDE2] bg-[#FFFEFA]" />
              <p className="text-xs text-[#273068]/60">Minimum 8 caractères, une majuscule, un chiffre et un symbole.</p>
              <InputError message={errors.password ?? null} />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="password_confirmation" className="font-semibold text-[#273068]">Confirmer le mot de passe</Label>
              <PasswordInput id="password_confirmation" name="password_confirmation" placeholder="Confirmez votre mot de passe" value={form.password_confirmation} onChange={handleChange} required className="h-11 rounded-xl border border-[#D5CDE2] bg-[#FFFEFA]" />
              <InputError message={errors.password_confirmation ?? null} />
            </div>

            <div className="flex items-start gap-3 pt-1">
              <input type="checkbox" id="cgu" checked={acceptCGU} onChange={(e) => setAcceptCGU(e.target.checked)} className="mt-0.5 h-4 w-4 accent-[#E94E6F]" />
              <label htmlFor="cgu" className="text-xs leading-5 text-[#273068]">
                J'accepte les{" "}
                <TextLink href="/CGU" className="font-semibold text-[#E94E6F] underline">Conditions Générales d'Utilisation</TextLink>{" "}
                et la{" "}
                <TextLink href="/Confidentialite" className="font-semibold text-[#E94E6F] underline">Politique de confidentialité.</TextLink>
              </label>
            </div>

            <Button type="submit" className="h-12 w-full rounded-xl bg-[#E94E6F] text-sm font-black text-white hover:bg-[#d63f5f]" disabled={loading || !acceptCGU}>
              {loading && <Spinner />}
              Créer mon compte
            </Button>

            <button
              type="button"
              onClick={() => { window.location.href = "http://localhost:8000/auth/google" }}
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

          <div className="mt-5 flex items-center justify-center gap-2 text-xs text-[#273068]/60">
            <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M12 3l7 3v5c0 4.7-2.9 8.8-7 10-4.1-1.2-7-5.3-7-10V6l7-3z" />
            </svg>
            <span>Vos données sont sécurisées et protégées. Nous ne partageons jamais vos informations.</span>
          </div>
        </div>

      </div>
    </main>
  )
}
