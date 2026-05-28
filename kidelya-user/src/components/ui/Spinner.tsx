import { cn } from "@/utils/cn"

export function Spinner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "h-5 w-5 animate-spin rounded-full border-2 border-[#FDC600]/40 border-t-[#93197D]",
        className
      )}
    />
  )
}
export default Spinner