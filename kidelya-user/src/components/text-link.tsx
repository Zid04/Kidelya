import { Link } from "react-router-dom"
import { cn } from "@/utils/cn"

type TextLinkProps = {
  href: string
  children: React.ReactNode
  className?: string
}

export default function TextLink({ href, children, className }: TextLinkProps) {
  return (
    <Link
      to={href}
      className={cn(
        "text-[#E94E6F] hover:underline font-medium",
        className
      )}
    >
      {children}
    </Link>
  )
}
