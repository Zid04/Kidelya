import { Link } from "@inertiajs/react"
import { useCurrentUrl } from "@/hooks/use-current-url"
import { cn } from "@/lib/utils"
import type { NavItem } from "@/types"

export function NavMain({ items = [] }: { items: NavItem[] }) {
  const { isCurrentUrl } = useCurrentUrl()

  return (
    <nav className="flex flex-col gap-1 px-4 py-2">
      {items.map((item) => {
        const active = isCurrentUrl(item.href)

        return (
          <Link
            key={item.title}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              active
                ? "bg-[#FDC600]/30 text-[#93197D]"
                : "text-[#6F8D4C] hover:bg-[#FDC600]/20 hover:text-[#93197D]"
            )}
          >
            {item.icon && <item.icon className="h-5 w-5" />}
            <span>{item.title}</span>
          </Link>
        )
      })}
    </nav>
  )
}
