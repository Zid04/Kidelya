import { Eye, EyeOff, RefreshCw, LockKeyhole } from "lucide-react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Props = {
  recoveryCodesList: string[]
  fetchRecoveryCodes: () => Promise<void>
  regenerateCodes: () => Promise<void>
  errors?: string[]
}

export default function TwoFactorRecoveryCodes({
  recoveryCodesList,
  fetchRecoveryCodes,
  regenerateCodes,
  errors = [],
}: Props) {
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const sectionRef = useRef<HTMLDivElement | null>(null)

  const toggle = async () => {
    if (!visible && recoveryCodesList.length === 0) {
      setLoading(true)
      await fetchRecoveryCodes()
      setLoading(false)
    }

    setVisible(!visible)

    if (!visible) {
      setTimeout(() => {
        sectionRef.current?.scrollIntoView({ behavior: "smooth" })
      }, 150)
    }
  }

  const regenerate = async () => {
    setLoading(true)
    await regenerateCodes()
    await fetchRecoveryCodes()
    setLoading(false)
  }

  return (
    <div className="rounded-xl border border-[#FDC600]/40 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-2">
        <LockKeyhole className="h-5 w-5 text-[#93197D]" />
        <h2 className="text-lg font-semibold text-[#93197D]">
          Codes de récupération 2FA
        </h2>
      </div>

      <p className="text-sm text-[#6F8D4C] mb-4">
        Ces codes vous permettent de récupérer l’accès à votre compte si vous
        perdez votre appareil 2FA. Conservez-les dans un endroit sécurisé.
      </p>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <Button onClick={toggle} className="w-fit">
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          {visible ? "Masquer" : "Afficher"} les codes
        </Button>

        {visible && recoveryCodesList.length > 0 && (
          <Button
            variant="secondary"
            onClick={regenerate}
            disabled={loading}
            className="w-fit"
          >
            <RefreshCw className="h-4 w-4" />
            Régénérer
          </Button>
        )}
      </div>

      <div
        className={cn(
          "transition-all overflow-hidden mt-4",
          visible ? "opacity-100 max-h-[500px]" : "opacity-0 max-h-0"
        )}
      >
        <div ref={sectionRef} className="mt-3 space-y-3">
          {errors.length > 0 ? (
            <div className="text-red-600 text-sm">{errors.join(", ")}</div>
          ) : (
            <div className="grid gap-1 rounded-lg bg-[#FFF4CC] p-4 font-mono text-sm border border-[#FDC600]/40">
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-4 animate-pulse rounded bg-[#FDC600]/30"
                  />
                ))
              ) : (
                recoveryCodesList.map((code, i) => (
                  <div key={i} className="select-text">
                    {code}
                  </div>
                ))
              )}
            </div>
          )}

          <p className="text-xs text-[#6F8D4C]">
            Chaque code ne peut être utilisé qu’une seule fois.  
            Cliquez sur <strong>Régénérer</strong> pour en obtenir de nouveaux.
          </p>
        </div>
      </div>
    </div>
  )
}
