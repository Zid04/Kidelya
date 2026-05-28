import {  useNavigate } from "react-router-dom"
import { useState } from "react"
import InputError from "@/components/InputError"
import PasswordInput from "@/components/password-input"
import TextLink from "@/components/text-link"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/Spinner"
import api from "@/api/axios"
import bgLogin from "@/assets/arriere-plan-log.png"

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    password_confirmation: "",
  })

  const [errors, setErrors] = useState<{
    firstname?: string
    lastname?: string
    email?: string
    password?: string
    password_confirmation?: string
  }>({})

  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    try {
      await api.post("/register", form)
      navigate("/dashboard")
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: {
          data?: {
            errors?: {
              firstname?: string[]
              lastname?: string[]
              email?: string[]
              password?: string[]
              password_confirmation?: string[]
            }
          }
        }
      }

      const backendErrors = axiosErr.response?.data?.errors || {}

      setErrors({
        firstname: backendErrors.firstname?.[0],
        lastname: backendErrors.lastname?.[0],
        email: backendErrors.email?.[0],
        password: backendErrors.password?.[0],
        password_confirmation: backendErrors.password_confirmation?.[0],
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

      {/* Bouton fermeture */}
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
        {/* Form plus petit */}
        <section className="w-full max-w-[500px] rounded-[24px] bg-transparent px-6 py-8 text-center md:px-10">
          <h1 className="text-3xl font-black text-black">Inscription</h1>
          <p className="mt-4 text-sm font-medium text-[#4F4F4F]">
            Creez votre compte pour acceder aux packs et activites Kidelya.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-left">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="firstname" className="font-semibold text-[#222]">Prenom*</Label>
                <Input
                  id="firstname"
                  name="firstname"
                  type="text"
                  value={form.firstname}
                  onChange={handleChange}
                  required
                  className="h-11 rounded-xl border border-[#F2A6B4] bg-transparent"
                />
                <InputError message={errors.firstname ?? null} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="lastname" className="font-semibold text-[#222]">Nom*</Label>
                <Input
                  id="lastname"
                  name="lastname"
                  type="text"
                  value={form.lastname}
                  onChange={handleChange}
                  required
                  className="h-11 rounded-xl border border-[#F2A6B4] bg-transparent"
                />
                <InputError message={errors.lastname ?? null} />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email" className="font-semibold text-[#222]">Email*</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                className="h-11 rounded-xl border border-[#F2A6B4] bg-transparent"
              />
              <InputError message={errors.email ?? null} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password" className="font-semibold text-[#222]">Mot de passe*</Label>
              <PasswordInput
                id="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="h-11 rounded-xl border border-[#F2A6B4] bg-transparent"
              />
              <InputError message={errors.password ?? null} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password_confirmation" className="font-semibold text-[#222]">
                Confirmer le mot de passe*
              </Label>
              <PasswordInput
                id="password_confirmation"
                name="password_confirmation"
                value={form.password_confirmation}
                onChange={handleChange}
                required
                className="h-11 rounded-xl border border-[#F2A6B4] bg-transparent"
              />
              <InputError message={errors.password_confirmation ?? null} />
            </div>

            <Button
              type="submit"
              className="h-12 w-full rounded-xl bg-[#E94E6F] text-sm font-black text-white hover:bg-[#d63f5f]"
              disabled={loading}
            >
              {loading && <Spinner />}
              Inscription
            </Button>

            <button
              type="button"
              className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-[#F2A6B4] bg-transparent text-sm font-bold text-[#222]"
            >
              <span className="text-lg font-black">G</span>
              Inscription avec Google
            </button>
          </form>

          <p className="mt-5 text-sm font-medium text-[#444]">
            Vous avez deja un compte ?{" "}
            <TextLink href="/login" className="font-black text-[#E94E6F]">
              Connexion
            </TextLink>
          </p>
        </section>
      </div>
    </main>
  )
}