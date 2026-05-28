import React from "react"
import { cn } from "../../utils/cn"

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "w-full px-3 py-2 rounded-lg border border-[#FDC600]/40 text-[#93197D] placeholder-[#BFAED6] focus:outline-none focus:ring-2 focus:ring-[#E94E6F]",
          className
        )}
        {...props}
      />
    )
  }
)

Input.displayName = "Input"
