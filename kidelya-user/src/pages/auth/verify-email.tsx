import { useState } from "react"
import TextLink from "@/components/text-link"
import { Button } from "@/components/ui/Button"
import { Spinner } from "@/components/ui/Spinner"
import api from "@/api/axios"

export default function VerifyEmail({ status }: { status?: string }) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(
    status === "verification-link-sent"
      ? "A new verification link has been sent to the email address you provided during registration."
      : null
  )

  const resendVerification = async () => {
    setLoading(true)
    setMessage(null)

    try {
      await api.post("/email/verification-notification")
      setMessage(
        "A new verification link has been sent to your email address."
      )
    } catch {
      setMessage("An error occurred while sending the verification email.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 text-center">
      <h1 className="text-xl font-semibold">Email verification</h1>
      <p className="text-sm text-muted-foreground">
        Please verify your email address by clicking on the link we just emailed to you.
      </p>

      {message && (
        <div className="mb-4 text-sm font-medium text-green-600">
          {message}
        </div>
      )}

      <div className="space-y-6">
        <Button
          onClick={resendVerification}
          disabled={loading}
          variant="secondary"
        >
          {loading && <Spinner />}
          Resend verification email
        </Button>

        <TextLink href="/logout" className="mx-auto block text-sm">
          Log out
        </TextLink>
      </div>
    </div>
  )
}
