import { Sun, Moon, Monitor } from "lucide-react"
import type { HTMLAttributes } from "react"
import type { Appearance } from "@/hooks/useApparence"
import { useAppearance } from "@/hooks/useApparence"
import { cn } from "@/utils/cn"
import type { LucideIcon } from "lucide-react"

export default function AppearanceToggleTab({
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  const { appearance, updateAppearance } = useAppearance()

const tabs: {
  value: Appearance
  icon: LucideIcon
  label: string
}[] = [
  { value: "light", icon: Sun, label: "Clair" },
  { value: "dark", icon: Moon, label: "Sombre" },
  { value: "system", icon: Monitor, label: "Système" },
]


  return (
    <div
      className={cn(
        "inline-flex gap-1 rounded-xl bg-[#FFF4CC] p-1 border border-[#FDC600]/40",
        className
      )}
      {...props}
    >
      {tabs.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => updateAppearance(value)}
          className={cn(
            "flex items-center rounded-lg px-3 py-1.5 text-sm transition-all",
            appearance === value
              ? "bg-white text-[#93197D] shadow-sm"
              : "text-[#6F8D4C] hover:bg-[#FDC600]/20"
          )}
        >
          <Icon className="h-4 w-4 mr-1" />
          {label}
        </button>
      ))}
    </div>
  )
}
