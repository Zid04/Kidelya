import { useRef, useState } from "react"
import { ShieldCheck } from "lucide-react"

import Heading from "@/components/Heading"
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

export default function SecurityPage({
  canManageTwoFactor = true,
}: SecurityProps) {
  const { user, refreshUser } = useUser()

  // ----- PASSWORD FORM -----
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
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value,
    })
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordLoading(true)
    setPasswordSaved(false)
    setPasswordErrors({})

    try {
      await api.put("/users/me/password", passwordForm)
      setPasswordSaved(true)
      setPasswordForm({
        current_password: "",
        password: "",
        password_confirmation: "",
      })
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: { data?: { errors?: PasswordErrors } }
      }
      const errors = axiosErr.response?.data?.errors || {}
      setPasswordErrors(errors)

      if (errors.password && passwordInput.current) {
        passwordInput.current.focus()
      } else if (errors.current_password && currentPasswordInput.current) {
        currentPasswordInput.current.focus()
      }
    } finally {
      setPasswordLoading(false)
    }
  }

  // ----- TWO FACTOR (EMAIL CODE) -----
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(
    Boolean(user?.is_two_factor_enabled),
  )
  const [showTwoFactorSetup, setShowTwoFactorSetup] = useState(false)
  const [twoFactorForm, setTwoFactorForm] = useState({ code: "" })
  const [twoFactorErrors, setTwoFactorErrors] = useState<TwoFactorErrors>({})
  const [twoFactorLoading, setTwoFactorLoading] = useState(false)

  const handleTwoFactorCodeChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setTwoFactorForm({ code: e.target.value })
  }

  const handleSendTwoFactorCode = async () => {
    setTwoFactorErrors({})
    setTwoFactorLoading(true)

    try {
      await api.post("/users/me/two-factor/send-code")
      setShowTwoFactorSetup(true)
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: { data?: { errors?: TwoFactorErrors } }
      }
      const errors = axiosErr.response?.data?.errors || {}
      setTwoFactorErrors(errors)
    } finally {
      setTwoFactorLoading(false)
    }
  }

  const handleConfirmTwoFactor = async () => {
    setTwoFactorErrors({})
    setTwoFactorLoading(true)

    try {
      await api.post("/users/me/two-factor/confirm", {
        code: twoFactorForm.code,
      })
      setTwoFactorEnabled(true)
      setShowTwoFactorSetup(false)
      setTwoFactorForm({ code: "" })
      await refreshUser()
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: { data?: { errors?: TwoFactorErrors } }
      }
      const errors = axiosErr.response?.data?.errors || {}
      setTwoFactorErrors(errors)
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
      const axiosErr = err as {
        response?: { data?: { errors?: TwoFactorErrors } }
      }
      const errors = axiosErr.response?.data?.errors || {}
      setTwoFactorErrors(errors)
    } finally {
      setTwoFactorLoading(false)
    }
  }

  return (
    <div className="space-y-10">
      {/* Update password */}
      <div className="space-y-6">
        <Heading
          variant="small"
          title="Update password"
          description="Ensure your account is using a long, random password to stay secure."
        />

        <form onSubmit={handlePasswordSubmit} className="space-y-6">
          {/* Current password */}
          <div className="grid gap-2">
            <Label htmlFor="current_password">Current password</Label>
            <PasswordInput
              id="current_password"
              name="current_password"
              ref={currentPasswordInput}
              autoComplete="current-password"
              placeholder="Current password"
              value={passwordForm.current_password}
              onChange={handlePasswordChange}
            />
            <InputError message={passwordErrors.current_password ?? null} />
          </div>

          {/* New password */}
          <div className="grid gap-2">
            <Label htmlFor="password">New password</Label>
            <PasswordInput
              id="password"
              name="password"
              ref={passwordInput}
              autoComplete="new-password"
              placeholder="New password"
              value={passwordForm.password}
              onChange={handlePasswordChange}
            />
            <InputError message={passwordErrors.password ?? null} />
          </div>

          {/* Confirm password */}
          <div className="grid gap-2">
            <Label htmlFor="password_confirmation">
              Confirm password
            </Label>
            <PasswordInput
              id="password_confirmation"
              name="password_confirmation"
              autoComplete="new-password"
              placeholder="Confirm password"
              value={passwordForm.password_confirmation}
              onChange={handlePasswordChange}
            />
            <InputError
              message={passwordErrors.password_confirmation ?? null}
            />
          </div>

          <div className="flex items-center gap-4">
            <Button disabled={passwordLoading}>
              {passwordLoading ? "Saving..." : "Save password"}
            </Button>

            {passwordSaved && (
              <p className="text-sm text-neutral-600">Saved</p>
            )}
          </div>
        </form>
      </div>

      {/* Two-factor authentication (email code) */}
      {canManageTwoFactor && (
        <div className="space-y-6">
          <Heading
            variant="small"
            title="Two-factor authentication"
            description="Manage your two-factor authentication settings."
          />

          {twoFactorEnabled ? (
            <div className="flex flex-col items-start space-y-4">
              <p className="text-sm text-muted-foreground">
                Two-factor authentication is enabled. A verification code will
                be sent to your email each time you log in.
              </p>

              <Button
                variant="warning"
                onClick={handleDisableTwoFactor}
                disabled={twoFactorLoading}
              >
                Disable 2FA
              </Button>

              <InputError message={twoFactorErrors.code ?? null} />
            </div>
          ) : (
            <div className="flex flex-col items-start space-y-4">
              <p className="text-sm text-muted-foreground">
                When you enable two-factor authentication, a verification code
                will be sent to your email each time you log in.
              </p>

              {!showTwoFactorSetup ? (
                <Button
                  onClick={handleSendTwoFactorCode}
                  disabled={twoFactorLoading}
                >
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  Enable 2FA
                </Button>
              ) : (
                <div className="space-y-4">
                  <Label htmlFor="two_factor_code">
                    Enter the code sent to your email
                  </Label>
                  <Input
                    id="two_factor_code"
                    name="code"
                    placeholder="123456"
                    value={twoFactorForm.code}
                    onChange={handleTwoFactorCodeChange}
                  />
                  <InputError message={twoFactorErrors.code ?? null} />

                  <div className="flex gap-2">
                    <Button
                      onClick={handleConfirmTwoFactor}
                      disabled={twoFactorLoading}
                    >
                      Confirm 2FA
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowTwoFactorSetup(false)
                        setTwoFactorForm({ code: "" })
                        setTwoFactorErrors({})
                      }}
                    >
                      Cancel
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
