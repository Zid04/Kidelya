import * as React from "react"
import { cn } from "@/utils/cn"

export type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement>

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type="checkbox"
        className={cn(
          "h-4 w-4 rounded border border-[#FDC600]/40 text-[#E94E6F] focus:ring-[#E94E6F]",
          className
        )}
        {...props}
      />
    )
  }
)

Checkbox.displayName = "Checkbox"
