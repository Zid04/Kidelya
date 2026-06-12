import { useRef, useState } from "react"
import { ShieldCheck } from "lucide-react"

import InputError from "@/components/InputError"
import PasswordInput from "@/components/password-input"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/label"

import api from "@/api/axios"
import { useUser } from "@/hooks/useUser"

type SecurityProps = {
  canManageTwoFactor?: boolean
}

type PasswordErrors = {
  current_password?: string
  password?: string
  password_confirmation?: string
}

type TwoFactorErrors = {
  code?: string
}

export default function SecurityPage({ canManageTwoFactor = true }: SecurityProps) {
  const { user, refreshUser } = useUser()

  const currentPasswordInput = useRef<HTMLInputElement | null>(null)
  const passwordInput = useRef<HTMLInputElement | null>(null)

  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    password: "",
    password_confirmation: "",
  })
  const [passwordErrors, setPasswordErrors] = useState<PasswordErrors>({})
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordSaved, setPasswordSaved] = useState(false)

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value })
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordLoading(true)
    setPasswordSaved(false)
    setPasswordErrors({})

    try {
      await api.put("/users/me/password", passwordForm)
      setPasswordSaved(true)
      setPasswordForm({ current_password: "", password: "", password_confirmation: "" })
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { errors?: PasswordErrors } } }
      const errors = axiosErr.response?.data?.errors || {}
      setPasswordErrors(errors)
      if (errors.password && passwordInput.current) passwordInput.current.focus()
      else if (errors.current_password && currentPasswordInput.current) currentPasswordInput.current.focus()
    } finally {
      setPasswordLoading(false)
    }
  }

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(Boolean(user?.is_two_factor_enabled))
  const [showTwoFactorSetup, setShowTwoFactorSetup] = useState(false)
  const [twoFactorForm, setTwoFactorForm] = useState({ code: "" })
  const [twoFactorErrors, setTwoFactorErrors] = useState<TwoFactorErrors>({})
  const [twoFactorLoading, setTwoFactorLoading] = useState(false)

  const handleSendTwoFactorCode = async () => {
    setTwoFactorErrors({})
    setTwoFactorLoading(true)
    try {
      await api.post("/users/me/two-factor/send-code")
      setShowTwoFactorSetup(true)
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { errors?: TwoFactorErrors } } }
      setTwoFactorErrors(axiosErr.response?.data?.errors || {})
    } finally {
      setTwoFactorLoading(false)
    }
  }

  const handleConfirmTwoFactor = async () => {
    setTwoFactorErrors({})
    setTwoFactorLoading(true)
    try {
      await api.post("/users/me/two-factor/confirm", { code: twoFactorForm.code })
      setTwoFactorEnabled(true)
      setShowTwoFactorSetup(false)
      setTwoFactorForm({ code: "" })
      await refreshUser()
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { errors?: TwoFactorErrors } } }
      setTwoFactorErrors(axiosErr.response?.data?.errors || {})
    } finally {
      setTwoFactorLoading(false)
    }
  }

  const handleDisableTwoFactor = async () => {
    setTwoFactorErrors({})
    setTwoFactorLoading(true)
    try {
      await api.post("/users/me/two-factor/disable")
      setTwoFactorEnabled(false)
      setShowTwoFactorSetup(false)
      setTwoFactorForm({ code: "" })
      await refreshUser()
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { errors?: TwoFactorErrors } } }
      setTwoFactorErrors(axiosErr.response?.data?.errors || {})
    } finally {
      setTwoFactorLoading(false)
    }
  }

  return (
    <div className="space-y-8 max-w-xl">

      {/* Changer le mot de passe */}
      <div className="rounded-2xl bg-[#FFFEFA] p-6 shadow-sm space-y-5">
        <div>
          <h2 className="text-xl font-black text-[#7C67B2]">Mot de passe</h2>
          <p className="mt-1 text-sm text-[#273068]">Utilisez un mot de passe long et unique pour sécuriser votre compte.</p>
        </div>

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div className="grid gap-1.5">
            <Label htmlFor="current_password" className="font-semibold text-[#7C67B2]">Mot de passe actuel</Label>
            <PasswordInput
              id="current_password"
              name="current_password"
              ref={currentPasswordInput}
              autoComplete="current-password"
              placeholder="Mot de passe actuel"
              value={passwordForm.current_password}
              onChange={handlePasswordChange}
              className="h-11 rounded-xl border border-gray-200"
            />
            <InputError message={passwordErrors.current_password ?? null} />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="password" className="font-semibold text-[#7C67B2]">Nouveau mot de passe</Label>
            <PasswordInput
              id="password"
              name="password"
              ref={passwordInput}
              autoComplete="new-password"
              placeholder="Nouveau mot de passe"
              value={passwordForm.password}
              onChange={handlePasswordChange}
              className="h-11 rounded-xl border border-gray-200"
            />
            <InputError message={passwordErrors.password ?? null} />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="password_confirmation" className="font-semibold text-[#7C67B2]">Confirmer le mot de passe</Label>
            <PasswordInput
              id="password_confirmation"
              name="password_confirmation"
              autoComplete="new-password"
              placeholder="Confirmer le mot de passe"
              value={passwordForm.password_confirmation}
              onChange={handlePasswordChange}
              className="h-11 rounded-xl border border-gray-200"
            />
            <InputError message={passwordErrors.password_confirmation ?? null} />
          </div>

          <div className="flex items-center gap-4 pt-1">
            <Button
              disabled={passwordLoading}
              className="rounded-xl bg-[#7C67B2] text-sm font-bold text-white hover:bg-[#6a58a0]"
            >
              {passwordLoading ? "Enregistrement…" : "Enregistrer le mot de passe"}
            </Button>
            {passwordSaved && (
              <p className="text-sm font-semibold text-[#6F8D4C]">✓ Enregistré</p>
            )}
          </div>
        </form>
      </div>

      {/* Double authentification */}
      {canManageTwoFactor && (
        <div className="rounded-2xl bg-[#FFFEFA] p-6 shadow-sm space-y-5">
          <div>
            <h2 className="text-xl font-black text-[#7C67B2]">Double authentification</h2>
            <p className="mt-1 text-sm text-[#273068]">Renforcez la sécurité de votre compte avec un code envoyé par e-mail.</p>
          </div>

          {twoFactorEnabled ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 rounded-xl bg-[#D5CDE2] px-4 py-3">
                <svg viewBox="0 0 24 24" className="h-4 w-4 text-[#7C67B2]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3L4 6.5V11C4 15.4 7.4 19.5 12 21C16.6 19.5 20 15.4 20 11V6.5L12 3Z" />
                </svg>
                <p className="text-sm font-semibold text-[#273068]">La double authentification est activée.</p>
              </div>
              <Button
                onClick={handleDisableTwoFactor}
                disabled={twoFactorLoading}
                className="rounded-xl bg-[#E94E6F] text-sm font-bold text-white hover:bg-[#d63f5f]"
              >
                Désactiver la 2FA
              </Button>
              <InputError message={twoFactorErrors.code ?? null} />
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-[#273068]">
                Un code de vérification sera envoyé à votre e-mail à chaque connexion.
              </p>

              {!showTwoFactorSetup ? (
                <Button
                  onClick={handleSendTwoFactorCode}
                  disabled={twoFactorLoading}
                  className="rounded-xl bg-[#7C67B2] text-sm font-bold text-white hover:bg-[#6a58a0]"
                >
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  Activer la 2FA
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="grid gap-1.5">
                    <Label htmlFor="two_factor_code" className="font-semibold text-[#7C67B2]">
                      Code reçu par e-mail
                    </Label>
                    <Input
                      id="two_factor_code"
                      name="code"
                      placeholder="123456"
                      value={twoFactorForm.code}
                      onChange={(e) => setTwoFactorForm({ code: e.target.value })}
                      className="h-11 rounded-xl border border-gray-200"
                    />
                    <InputError message={twoFactorErrors.code ?? null} />
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={handleConfirmTwoFactor}
                      disabled={twoFactorLoading}
                      className="rounded-xl bg-[#7C67B2] text-sm font-bold text-white hover:bg-[#6a58a0]"
                    >
                      Confirmer la 2FA
                    </Button>
                    <Button
                      type="button"
                      onClick={() => { setShowTwoFactorSetup(false); setTwoFactorForm({ code: "" }); setTwoFactorErrors({}) }}
                      className="rounded-xl bg-[#D5CDE2] text-sm font-semibold text-[#273068] hover:bg-[#c5bbd2]"
                    >
                      Annuler
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
