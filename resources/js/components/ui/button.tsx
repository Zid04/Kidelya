import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import type { VariantProps } from "class-variance-authority"
import * as React from "react"
import type { ButtonHTMLAttributes } from "react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center font-semibold rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed gap-2",
  {
    variants: {
      variant: {
        primary:
          "bg-[#E94E6F] hover:bg-[#d63f5f] text-white focus:ring-[#E94E6F] shadow-md hover:shadow-lg",
        secondary:
          "bg-[#0094A8] hover:bg-[#007c8e] text-white focus:ring-[#0094A8] shadow-md hover:shadow-lg",
        outline:
          "bg-white border-2 border-[#E94E6F] text-[#E94E6F] hover:bg-[#E94E6F] hover:text-white focus:ring-[#E94E6F]",
        ghost:
          "bg-transparent text-[#93197D] hover:bg-[#FDC600]/20 focus:ring-[#93197D]",
        success:
          "bg-[#6F8D4C] hover:bg-[#5c763f] text-white focus:ring-[#6F8D4C]",
        warning:
          "bg-[#FDC600] hover:bg-[#e0b100] text-[#93197D] focus:ring-[#FDC600]",
      },
      size: {
        sm: "text-sm px-4 py-2",
        md: "text-base px-6 py-3",
        lg: "text-lg px-8 py-4",
        icon: "size-10 rounded-full",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      fullWidth: false,
    },
  }
)

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    loading?: boolean
  }

function Button({
  className,
  variant,
  size,
  fullWidth,
  loading = false,
  asChild = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      disabled={disabled || loading}
      className={cn(buttonVariants({ variant, size, fullWidth }), className)}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          Chargement...
        </span>
      ) : (
        children
      )}
    </Comp>
  )
}

export { Button }