import { cn } from "@/utils/cn"

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "w-full px-3 py-2 rounded-lg border border-[#FDC600]/40 text-[#93197D] placeholder-[#BFAED6] focus:outline-none focus:ring-2 focus:ring-[#E94E6F]",
        className
      )}
      {...props}
    />
  )
}
