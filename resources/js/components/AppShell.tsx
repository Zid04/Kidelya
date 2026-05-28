import type { ReactNode } from "react"

type Props = {
  children: ReactNode
  variant?: "sidebar" | "header"
}

export function AppShell({ children, variant = "sidebar" }: Props) {
  if (variant === "header") {
    return (
      <div className="flex min-h-screen w-full flex-col">
        {children}
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full">
      {children}
    </div>
  )
}
