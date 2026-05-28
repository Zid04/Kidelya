import { cn } from "@/utils/cn"

export function Badge({
  children,
  color = "pink",
  className,
}: {
  children: React.ReactNode
  color?: "pink" | "yellow" | "blue" | "green"
  className?: string
}) {
  const colors = {
    pink: "bg-[#FFE3EA] text-[#E94E6F]",
    yellow: "bg-[#FFF4CC] text-[#FDC600]",
    blue: "bg-[#DFF4F7] text-[#0094A8]",
    green: "bg-[#E6F1DD] text-[#6F8D4C]",
  }

  return (
    <span
      className={cn(
        "px-2 py-1 rounded-md text-xs font-semibold",
        colors[color],
        className
      )}
    >
      {children}
    </span>
  )
}
