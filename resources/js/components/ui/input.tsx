import type { InputHTMLAttributes } from "react"
import * as React from "react"
import { cn } from "@/lib/utils"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, required, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1">
        
        {/* Label */}
        {label && (
          <label className="text-sm font-medium text-[#93197D]">
            {label}
            {required && <span className="text-[#E94E6F] ml-1">*</span>}
          </label>
        )}

        {/* Input */}
        <input
          ref={ref}
          required={required}
          {...props}
          className={cn(
            `
            w-full px-4 py-3 rounded-xl border-2 bg-white
            text-[#0094A8] placeholder-[#BFAED6]
            transition-all duration-200 outline-none

            focus:ring-2 focus:ring-[#E94E6F] focus:border-[#E94E6F]
            disabled:opacity-50 disabled:cursor-not-allowed

            ${error ? "border-[#E94E6F]" : "border-[#FDC600]/40"}
            `,
            className
          )}
        />

        {/* Error */}
        {error && (
          <p className="text-sm text-[#E94E6F]">{error}</p>
        )}

        {/* Hint */}
        {!error && hint && (
          <p className="text-sm text-[#6F8D4C]">{hint}</p>
        )}
      </div>
    )
  }
)

Input.displayName = "Input"
export { Input }
