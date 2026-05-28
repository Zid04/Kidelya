import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full font-medium w-fit whitespace-nowrap shrink-0 gap-1 px-2 py-1 text-xs transition-colors",
  {
    variants: {
      color: {
        pink:   "bg-[#FFE3EA] text-[#E94E6F]",
        yellow: "bg-[#FFF4CC] text-[#FDC600]",
        green:  "bg-[#E6F1DD] text-[#6F8D4C]",
        purple: "bg-[#F5E3F3] text-[#93197D]",
        blue:   "bg-[#DFF4F7] text-[#0094A8]",
        gray:   "bg-[#F5F5F5] text-[#616161]",
      },
      size: {
        sm: "text-xs px-2 py-1",
        md: "text-sm px-3 py-1.5",
      },
    },
    defaultVariants: {
      color: "pink",
      size: "sm",
    },
  }
)

function Badge({
  className,
  color,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ color, size }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
