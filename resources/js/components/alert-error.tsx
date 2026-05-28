import { AlertCircleIcon } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function AlertError({
  errors,
  title,
}: {
  errors: string[]
  title?: string
}) {
  const uniqueErrors = Array.from(new Set(errors))

  return (
    <Alert
      data-slot="alert-error"
      className="
        rounded-xl border-l-4
        border-[#E94E6F] bg-[#FFE3EA]
        text-[#93197D] shadow-sm
        flex flex-col gap-2
      "
    >
      <div className="flex items-center gap-2">
        <AlertCircleIcon className="text-[#E94E6F] size-5" />

        <AlertTitle className="font-semibold text-[#E94E6F]">
          {title || "Une erreur est survenue"}
        </AlertTitle>
      </div>

      <AlertDescription>
        <ul className="list-inside list-disc text-sm text-[#93197D] space-y-1">
          {uniqueErrors.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  )
}
