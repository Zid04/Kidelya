import { useState, useRef } from "react"
import InputError from "@/components/InputError"
import PasswordInput from "@/components/password-input"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/Spinner"
import api from "@/api/axios"

type Props = {
  token: string
  email: string
}

export default function ResetPassword({ token, email }: Props) {
  const [form, setForm] = useState({
    password: "",
    password_confirmation: "",
  })

  const [errors, setErrors] = useState<{
    email?: string
    password?: string
    password_confirmation?: string
  }>({})

  const [loading, setLoading] = useState(false)
  const passwordRef = useRef<HTMLInputElement | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    try {
      await api.post("/password/reset", {
        token,
        email,
        password: form.password,
        password_confirmation: form.password_confirmation,
      })

      // Reset form
      setForm({
        password: "",
        password_confirmation: "",
      })
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: {
          data?: {
            errors?: {
              email?: string[]
              password?: string[]
              password_confirmation?: string[]
            }
          }
        }
      }

      const backendErrors = axiosErr.response?.data?.errors || {}

      setErrors({
        email: backendErrors.email?.[0],
        password: backendErrors.password?.[0],
        password_confirmation: backendErrors.password_confirmation?.[0],
      })

      passwordRef.current?.focus()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Reset password</h1>
      <p className="text-sm text-muted-foreground">
        Please enter your new password below.
      </p>

      <form onSubmit={handleSubmit} className="grid gap-6">
        {/* Email */}
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            readOnly
            className="mt-1 block w-full"
          />
          <InputError message={errors.email ?? null} />
        </div>

        {/* Password */}
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <PasswordInput
            id="password"
            name="password"
            autoComplete="new-password"
            placeholder="Password"
            className="mt-1 block w-full"
            ref={passwordRef}
            value={form.password}
            onChange={handleChange}
          />
          <InputError message={errors.password ?? null} />
        </div>

        {/* Confirm password */}
        <div className="grid gap-2">
          <Label htmlFor="password_confirmation">Confirm password</Label>
          <PasswordInput
            id="password_confirmation"
            name="password_confirmation"
            autoComplete="new-password"
            placeholder="Confirm password"
            className="mt-1 block w-full"
            value={form.password_confirmation}
            onChange={handleChange}
          />
          <InputError message={errors.password_confirmation ?? null} />
        </div>

        {/* Submit */}
        <Button
          type="submit"
          className="mt-4 w-full"
          disabled={loading}
        >
          {loading && <Spinner />}
          Reset password
        </Button>
      </form>
    </div>
  )
}
