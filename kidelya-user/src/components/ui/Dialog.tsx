import { cn } from "@/utils/cn"
import { useState } from "react"

export function Dialog({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

export function DialogTrigger({ children }: { children: React.ReactNode }) {
  return (
    <button
      onClick={() => {
        window.dispatchEvent(new CustomEvent("dialog-open"))
      }}
    >
      {children}
    </button>
  )
}

export function DialogContent({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  window.addEventListener("dialog-open", () => setOpen(true))
  window.addEventListener("dialog-close", () => setOpen(false))

  if (!open) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        {children}
      </div>
    </div>
  )
}

export function DialogTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-lg font-semibold">{children}</h3>
}

export function DialogDescription({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-gray-600">{children}</p>
}

export function DialogFooter({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex justify-end gap-2 pt-4", className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function DialogClose({ children }: { children: React.ReactNode }) {
  return (
    <button
      onClick={() => {
        window.dispatchEvent(new CustomEvent("dialog-close"))
      }}
    >
      {children}
    </button>
  )
}
