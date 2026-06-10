import { cn } from "../../utils/cn"
import React from "react"

const variants = {
  primary: "bg-[#E94E6F] text-white hover:bg-[#d63f5f]",
  secondary: "bg-white border border-[#FDC600] text-[#93197D] hover:bg-[#FFF4CC]",
  outline: "border border-[#273068] text-[#273068] hover:bg-[#FAF7F0]",
  ghost: "text-[#93197D] hover:bg-[#FAF7F0]",
  warning: "bg-red-600 text-white hover:bg-red-700",
}

export function Button({
  variant = "primary",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants
}) {
  return (
    <button
      className={cn(
        "px-4 py-2 rounded-lg font-semibold text-sm transition-colors",
        variants[variant],
        className
      )}
      {...props}
    />
  )
}
