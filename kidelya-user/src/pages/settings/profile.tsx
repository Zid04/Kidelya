import { useState } from "react"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/Button"
import InputError from "@/components/InputError"
import PasswordInput from "@/components/password-input"
import DeleteUser from "@/components/DeleteUser"
import { useUser } from "@/hooks/useUser"
import { updateProfile } from "@/api/user"
import api from "@/api/axios"

type Step = "view" | "password" | "edit"

export default function ProfileSettingsPage() {
  const { user, loading, refreshUser } = useUser()
  const [step, setStep] = useState<Step>("view")

  // Étape 2 : vérification mot de passe
  const [password, setPassword] = useState("")
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [checkingPassword, setCheckingPassword] = useState(false)

  // Étape 3 : édition
  const [form, setForm] = useState({ firstname: "", lastname: "", email: "" })
  const [errors, setErrors] = useState<{ firstname?: string; lastname?: string; email?: string }>({})
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleVerifyPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setCheckingPassword(true)
    setPasswordError(null)

    try {
      await api.post("/login", { email: user?.email, password })
      // Mot de passe correct → passe en mode édition
      setForm({
        firstname: user?.firstname ?? "",
        lastname:  user?.lastname  ?? "",
        email:     user?.email     ?? "",
      })
      setStep("edit")
    } catch {
      setPasswordError("Mot de passe incorrect. Veuillez réessayer.")
    } finally {
      setCheckingPassword(false)
      setPassword("")
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    setErrors({})

    try {
      await updateProfile(user!.iduser, form)
      await refreshUser()
      setSaved(true)
      setTimeout(() => {
        setSaved(false)
        setStep("view")
      }, 1500)
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { errors?: Record<string, string[]> } } }
      setErrors(axiosErr.response?.data?.errors || {})
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setStep("view")
    setPassword("")
    setPasswordError(null)
    setErrors({})
    setSaved(false)
  }

  if (loading) {
    return <p className="text-sm text-gray-400">Chargement…</p>
  }

  return (
    <div className="mx-auto max-w-xl space-y-8">

      {/* ── ÉTAPE 1 : Vue lecture seule ── */}
      {step === "view" && (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black text-[#273068]">Mon profil</h2>
          <p className="mt-1 text-sm text-gray-400">Vos informations personnelles actuelles.</p>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
              <span className="text-xs font-semibold text-gray-400">Prénom</span>
              <span className="text-sm font-bold text-[#273068]">{user?.firstname}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
              <span className="text-xs font-semibold text-gray-400">Nom</span>
              <span className="text-sm font-bold text-[#273068]">{user?.lastname}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
              <span className="text-xs font-semibold text-gray-400">Adresse e-mail</span>
              <span className="text-sm font-bold text-[#273068]">{user?.email}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setStep("password")}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#273068] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#1e2550]"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Modifier mes informations
          </button>
        </div>
      )}

      {/* ── ÉTAPE 2 : Vérification mot de passe ── */}
      {step === "password" && (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EEF0F8]">
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#273068]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-black text-[#273068]">Confirmer votre identité</h2>
              <p className="text-xs text-gray-400">Entrez votre mot de passe actuel pour continuer.</p>
            </div>
          </div>

          <form onSubmit={handleVerifyPassword} className="space-y-4">
            <div className="grid gap-1.5">
              <Label htmlFor="current-password" className="font-semibold text-[#273068]">
                Mot de passe actuel
              </Label>
              <PasswordInput
                id="current-password"
                name="current-password"
                placeholder="Votre mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11 rounded-xl border border-gray-200"
                autoFocus
              />
              {passwordError && (
                <p className="text-xs text-[#E94E6F]">{passwordError}</p>
              )}
            </div>

            <div className="flex gap-3 pt-1">
              <Button
                type="submit"
                disabled={checkingPassword || !password}
                className="flex-1 rounded-xl bg-[#E94E6F] text-sm font-bold text-white hover:bg-[#d63f5f]"
              >
                {checkingPassword ? "Vérification…" : "Continuer"}
              </Button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 rounded-xl border border-gray-200 text-sm font-semibold text-gray-500 hover:bg-gray-50"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── ÉTAPE 3 : Formulaire d'édition ── */}
      {step === "edit" && (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50">
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-black text-[#273068]">Modifier mes informations</h2>
              <p className="text-xs text-gray-400">Identité vérifiée. Vous pouvez maintenant modifier vos données.</p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-1.5">
                <Label htmlFor="firstname" className="font-semibold text-[#273068]">Prénom</Label>
                <Input
                  id="firstname"
                  name="firstname"
                  value={form.firstname}
                  onChange={handleChange}
                  required
                  className="h-11 rounded-xl border border-gray-200"
                />
                <InputError message={errors.firstname ?? null} />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="lastname" className="font-semibold text-[#273068]">Nom</Label>
                <Input
                  id="lastname"
                  name="lastname"
                  value={form.lastname}
                  onChange={handleChange}
                  required
                  className="h-11 rounded-xl border border-gray-200"
                />
                <InputError message={errors.lastname ?? null} />
              </div>
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="email" className="font-semibold text-[#273068]">Adresse e-mail</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                className="h-11 rounded-xl border border-gray-200"
              />
              <InputError message={errors.email ?? null} />
            </div>

            <div className="flex gap-3 pt-1">
              <Button
                type="submit"
                disabled={saving}
                className="flex-1 rounded-xl bg-[#273068] text-sm font-bold text-white hover:bg-[#1e2550]"
              >
                {saving ? "Enregistrement…" : "Enregistrer les modifications"}
              </Button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 rounded-xl border border-gray-200 text-sm font-semibold text-gray-500 hover:bg-gray-50"
              >
                Annuler
              </button>
            </div>

            {saved && (
              <p className="text-center text-sm font-semibold text-green-600">
                ✓ Modifications enregistrées avec succès
              </p>
            )}
          </form>
        </div>
      )}

      {/* ── Suppression de compte ── */}
      <DeleteUser />
    </div>
  )
}
