import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-xl border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5",
  {
    variants: {
      variant: {
        // Default Kidelya
        default:
          "bg-white text-[#93197D] border-[#FDC600]/40 [&>svg]:text-[#93197D]",

        // Erreur Kidelya
        error:
          "bg-[#FFE3EA] text-[#93197D] border-[#E94E6F] [&>svg]:text-[#E94E6F] *:data-[slot=alert-description]:text-[#93197D]",

        // Succès Kidelya
        success:
          "bg-[#E6F1DD] text-[#6F8D4C] border-[#6F8D4C] [&>svg]:text-[#6F8D4C]",

        // Info Kidelya
        info:
          "bg-[#DFF4F7] text-[#0094A8] border-[#0094A8] [&>svg]:text-[#0094A8]",

        // Avertissement Kidelya
        warning:
          "bg-[#FFF4CC] text-[#FDC600] border-[#FDC600] [&>svg]:text-[#FDC600]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "col-start-2 line-clamp-1 min-h-4 font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  )
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed",
        className
      )}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription }
