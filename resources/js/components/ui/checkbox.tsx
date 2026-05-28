import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { CheckIcon } from "lucide-react"
import * as React from "react"

import { cn } from "@/lib/utils"

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        `
        peer size-5 shrink-0 rounded-md border-2 shadow-sm
        transition-all duration-200 outline-none

        border-[#E94E6F]/40 bg-white
        hover:border-[#E94E6F]/70

        data-[state=checked]:bg-[#E94E6F]
        data-[state=checked]:border-[#E94E6F]
        data-[state=checked]:text-white

        focus-visible:ring-2 focus-visible:ring-[#E94E6F]/40
        disabled:cursor-not-allowed disabled:opacity-50
        `,
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current"
      >
        <CheckIcon className="size-4" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
