import type { LucideIcon } from "lucide-react"
import type { FC } from "react"

interface IconProps {
  iconNode?: LucideIcon | null
  className?: string
}

export function Icon({ iconNode: IconComponent, className }: IconProps) {
  if (!IconComponent) return null

  return <IconComponent className={className} />
}
