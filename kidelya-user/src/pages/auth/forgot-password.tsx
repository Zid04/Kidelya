import { useState, useRef } from "react"
import InputError from "@/components/InputError"
import TextLink from "@/components/text-link"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/label"
import { LoaderCircle } from "lucide-react"
import api from "@/api/axios"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<string | null>(null)
  const [errors, setErrors] = useState<{ email?: string }>({})
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})
    setStatus(null)

    try {
      await api.post("/password/email", { email })
      setStatus("A password reset link has been sent to your email.")
      setEmail("")
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: { data?: { errors?: { email?: string[] } } }
      }

      const backendErrors = axiosErr.response?.data?.errors || {}

      setErrors({
        email: backendErrors.email?.[0],
      })

      inputRef.current?.focus()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Forgot password</h1>
      <p className="text-sm text-muted-foreground">
        Enter your email to receive a password reset link.
      </p>

      {status && (
        <div className="mb-4 text-center text-sm font-medium text-green-600">
          {status}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email address</Label>

          <Input
            id="email"
            type="email"
            name="email"
            autoComplete="off"
            autoFocus
            placeholder="email@example.com"
            ref={inputRef}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <InputError message={errors.email ?? null} />
        </div>

        <div className="my-6 flex items-center justify-start">
          <Button className="w-full" disabled={loading}>
            {loading && (
              <LoaderCircle className="h-4 w-4 animate-spin mr-2" />
            )}
            Email password reset link
          </Button>
        </div>
      </form>

      <div className="space-x-1 text-center text-sm text-muted-foreground">
        <span>Or, return to</span>
        <TextLink href="/login">log in</TextLink>
      </div>
    </div>
  )
}
