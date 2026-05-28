import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"
import * as React from "react"
import { cn } from "@/lib/utils"


function Collapsible({
  className,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Root>) {
  return (
    <CollapsiblePrimitive.Root
      data-slot="collapsible"
      className={cn("w-full", className)}
      {...props}
    />
  )
}

function CollapsibleTrigger({
  className,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger>) {
  return (
    <CollapsiblePrimitive.CollapsibleTrigger
      data-slot="collapsible-trigger"
      className={cn(
        `
        flex w-full items-center justify-between
        rounded-xl px-4 py-3
        bg-[#FFF4CC] text-[#93197D]
        border border-[#FDC600]/60
        hover:bg-[#FDC600]/20
        transition-all duration-200
        cursor-pointer
        `,
        className
      )}
      {...props}
    />
  )
}

function CollapsibleContent({
  className,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent>) {
  return (
    <CollapsiblePrimitive.CollapsibleContent
      data-slot="collapsible-content"
      className={cn(
        `
        overflow-hidden
        data-[state=open]:animate-slideDown
        data-[state=closed]:animate-slideUp
        bg-white border border-[#FDC600]/40 rounded-xl mt-2 p-4
        text-[#6F8D4C]
        shadow-sm
        `,
        className
      )}
      {...props}
    />
  )
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
