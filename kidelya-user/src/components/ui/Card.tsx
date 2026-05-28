import { cn } from "../../utils/cn"
import React from "react"

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "bg-white border border-[#FDC600]/40 rounded-xl shadow-sm p-4",
        className
      )}
      {...props}
    />
  )
}
