import { useEffect } from "react"
import { cn } from "@/utils/cn"

type DialogProps = {
  open: boolean
  onClose: () => void
  children: React.ReactNode
}

export function Dialog({ open, onClose, children }: DialogProps) {
  useEffect(() => {
    if (!open) return
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        {children}
      </div>
    </div>
  )
}

export function DialogTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-lg font-black text-[#273068]">{children}</h3>
}

export function DialogDescription({ children }: { children: React.ReactNode }) {
  return <p className="mt-1 text-sm text-gray-500">{children}</p>
}

export function DialogFooter({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex justify-end gap-3 pt-4", className)} {...props}>
      {children}
    </div>
  )
}
