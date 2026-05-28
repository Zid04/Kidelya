import * as TogglePrimitive from "@radix-ui/react-toggle"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const toggleVariants = cva(
  `
  inline-flex items-center justify-center gap-2
  rounded-xl font-medium transition-all duration-200
  cursor-pointer select-none

  text-[#93197D] bg-white border-2 border-[#FDC600]/40
  hover:border-[#FDC600] hover:bg-[#FFF4CC]

  data-[state=on]:bg-[#E94E6F] data-[state=on]:text-white
  data-[state=on]:border-[#E94E6F]

  focus:outline-none focus:ring-2 focus:ring-[#E94E6F]/40
  disabled:opacity-50 disabled:cursor-not-allowed
  [&_svg]:pointer-events-none [&_svg]:shrink-0
  `,
  {
    variants: {
      size: {
        sm: "h-8 px-3 text-sm",
        default: "h-10 px-4 text-sm",
        lg: "h-12 px-5 text-base",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

function Toggle({
  className,
  size,
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> &
  VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      className={cn(toggleVariants({ size }), className)}
      {...props}
    />
  )
}

export { Toggle, toggleVariants }
