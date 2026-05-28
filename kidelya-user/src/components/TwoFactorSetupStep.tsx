import { useState } from "react"
import { Button } from "./ui/Button"
import { Spinner } from "./ui/Spinner"
import { Check, Copy } from "lucide-react"
import AlertError from "./ui/AlertError"

function TwoFactorSetupStep({
  qrCodeSvg,
  manualSetupKey,
  buttonText,
  onNextStep,
  errors,
}: {
  qrCodeSvg: string | null
  manualSetupKey: string | null
  buttonText: string
  onNextStep: () => void
  errors: string[]
}) {
  const [copied, setCopied] = useState(false)

  const copy = () => {
    if (!manualSetupKey) return
    navigator.clipboard.writeText(manualSetupKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <>
      {errors.length > 0 ? (
        <AlertError errors={errors} />
      ) : (
        <>
          {/* QR CODE */}
          <div className="mx-auto flex max-w-md overflow-hidden">
            <div className="mx-auto aspect-square w-64 rounded-lg border border-border">
              <div className="flex h-full w-full items-center justify-center p-5">
                {qrCodeSvg ? (
                  <div
                    className="aspect-square w-full rounded-lg bg-white p-2 [&_svg]:size-full"
                    dangerouslySetInnerHTML={{ __html: qrCodeSvg }}
                  />
                ) : (
                  <Spinner />
                )}
              </div>
            </div>
          </div>

          {/* BOUTON CONTINUER */}
          <Button className="w-full" onClick={onNextStep}>
            {buttonText}
          </Button>

          {/* SÉPARATEUR */}
          <div className="relative flex w-full items-center justify-center">
            <div className="absolute inset-0 top-1/2 h-px w-full bg-border" />
            <span className="relative bg-card px-2 py-1">
              ou entrer le code manuellement
            </span>
          </div>

          {/* CLÉ MANUELLE */}
          <div className="flex w-full space-x-2">
            <div className="flex w-full items-stretch overflow-hidden rounded-xl border border-border">
              {!manualSetupKey ? (
                <div className="flex h-full w-full items-center justify-center bg-muted p-3">
                  <Spinner />
                </div>
              ) : (
                <>
                  <input
                    type="text"
                    readOnly
                    value={manualSetupKey}
                    className="h-full w-full bg-background p-3 text-foreground outline-none"
                  />

                  <button
                    onClick={copy}
                    className="border-l border-border px-3 hover:bg-muted"
                  >
                    {copied ? (
                      <Check className="w-4 text-green-600" />
                    ) : (
                      <Copy className="w-4" />
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default TwoFactorSetupStep
