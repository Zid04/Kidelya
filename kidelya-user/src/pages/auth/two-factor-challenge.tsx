import { useMemo, useState } from "react"
import InputError from "@/components/InputError"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { REGEXP_ONLY_DIGITS } from "input-otp"
import { OTP_MAX_LENGTH } from "@/hooks/useTwoFactor"
import api from "@/api/axios"

export default function TwoFactorChallenge() {
  const [showRecoveryInput, setShowRecoveryInput] = useState(false)
  const [code, setCode] = useState("")
  const [recoveryCode, setRecoveryCode] = useState("")
  const [errors, setErrors] = useState<{ code?: string; recovery_code?: string }>({})
  const [loading, setLoading] = useState(false)

  const authConfigContent = useMemo(() => {
    if (showRecoveryInput) {
      return {
        title: "Recovery code",
        description:
          "Please confirm access to your account by entering one of your emergency recovery codes.",
        toggleText: "login using an authentication code",
      }
    }

    return {
      title: "Authentication code",
      description:
        "Enter the authentication code provided by your authenticator application.",
      toggleText: "login using a recovery code",
    }
  }, [showRecoveryInput])

  const toggleRecoveryMode = () => {
    setShowRecoveryInput(!showRecoveryInput)
    setErrors({})
    setCode("")
    setRecoveryCode("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    try {
      await api.post("/two-factor/login", {
        code: showRecoveryInput ? undefined : code,
        recovery_code: showRecoveryInput ? recoveryCode : undefined,
      })

      // Reset fields
      setCode("")
      setRecoveryCode("")
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: {
          data?: {
            errors?: {
              code?: string[]
              recovery_code?: string[]
            }
          }
        }
      }

      const backendErrors = axiosErr.response?.data?.errors || {}

      setErrors({
        code: backendErrors.code?.[0],
        recovery_code: backendErrors.recovery_code?.[0],
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">{authConfigContent.title}</h1>
      <p className="text-sm text-muted-foreground">
        {authConfigContent.description}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {showRecoveryInput ? (
          <>
            <Input
              name="recovery_code"
              type="text"
              placeholder="Enter recovery code"
              autoFocus
              required
              value={recoveryCode}
              onChange={(e) => setRecoveryCode(e.target.value)}
            />
            <InputError message={errors.recovery_code ?? null} />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-3 text-center">
            <div className="flex w-full items-center justify-center">
              <InputOTP
  name="code"
  maxLength={OTP_MAX_LENGTH}
  value={code}
  onChange={(value: string) => setCode(value)}
  disabled={loading}
  pattern={REGEXP_ONLY_DIGITS}
>

                <InputOTPGroup>
                  {Array.from({ length: OTP_MAX_LENGTH }, (_, index) => (
                    <InputOTPSlot key={index} index={index} />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>
            <InputError message={errors.code ?? null} />
          </div>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Processing..." : "Continue"}
        </Button>

        <div className="text-center text-sm text-muted-foreground">
          <span>or you can </span>
          <button
            type="button"
            className="cursor-pointer text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current dark:decoration-neutral-500"
            onClick={toggleRecoveryMode}
          >
            {authConfigContent.toggleText}
          </button>
        </div>
      </form>
    </div>
  )
}
