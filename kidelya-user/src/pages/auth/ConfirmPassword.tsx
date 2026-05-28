import { useState, useRef } from "react"
import InputError from "@/components/InputError"
import PasswordInput from "@/components/password-input"
import { Button } from "@/components/ui/Button"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/Spinner"
import api from "@/api/axios"

export default function ConfirmPassword() {
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<{ password?: string }>({})
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    try {
      await api.post("/users/me/password/confirm", { password })
      setPassword("")
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: { data?: { errors?: { password?: string[] } } }
      }

      const backendErrors = axiosErr.response?.data?.errors || {}

      setErrors({
        password: backendErrors.password?.[0],
      })

      inputRef.current?.focus()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Confirm your password</h1>
      <p className="text-sm text-muted-foreground">
        This is a secure area of the application. Please confirm your password before continuing.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>

          <PasswordInput
            id="password"
            name="password"
            placeholder="Password"
            autoComplete="current-password"
            autoFocus
            ref={inputRef}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <InputError message={errors.password ?? null} />
        </div>

        <div className="flex items-center">
          <Button className="w-full" disabled={loading}>
            {loading && <Spinner />}
            Confirm password
          </Button>
        </div>
      </form>
    </div>
  )
}
