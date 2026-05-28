import { Sun, Moon, Monitor } from "lucide-react"
import type { HTMLAttributes } from "react"
import type { Appearance } from "@/hooks/use-appearance"
import { useAppearance } from "@/hooks/use-appearance"
import { cn } from "@/lib/utils"

export default function AppearanceToggleTab({
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  const { appearance, updateAppearance } = useAppearance()

  const tabs: { value: Appearance; icon: any; label: string }[] = [
    { value: "light" as Appearance, icon: Sun, label: "Clair" },
    { value: "dark" as Appearance, icon: Moon, label: "Sombre" },
    { value: "system" as Appearance, icon: Monitor, label: "Système" },
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
