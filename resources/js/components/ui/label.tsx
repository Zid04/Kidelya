import * as LabelPrimitive from "@radix-ui/react-label"
import * as React from "react"

import { cn } from "@/lib/utils"

function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        `
        text-sm font-medium select-none
        text-[#93197D]
        transition-colors

        peer-disabled:opacity-50 peer-disabled:cursor-not-allowed
        group-data-[disabled=true]:opacity-50 group-data-[disabled=true]:pointer-events-none
        `,
        className
      )}
      {...props}
    />
  )
}

export { Label }
