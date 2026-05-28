import { cn } from "../../utils/cn"

export function Separator({
  className,
  color = "yellow",
}: {
  className?: string
  color?: "yellow" | "pink" | "blue" | "green" | "violet"
}) {
  const colors = {
    yellow: "bg-[#FDC600]/40",
    pink: "bg-[#E94E6F]/40",
    blue: "bg-[#0094A8]/40",
    green: "bg-[#6F8D4C]/40",
    violet: "bg-[#93197D]/40",
  }

  return (
    <div
      className={cn(
        "w-full h-[1px] rounded-full",
        colors[color],
        className
      )}
    />
  )
}
