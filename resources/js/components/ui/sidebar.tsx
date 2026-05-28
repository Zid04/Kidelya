import { Home, Users, Settings, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"

export function Sidebar({ className }: { className?: string }) {
  return (
    <aside
      className={cn(
        `
        h-screen w-64 flex flex-col
        bg-[#FFF4CC] border-r border-[#FDC600]/40
        text-[#93197D]
        shadow-sm
        `,
        className
      )}
    >
      {/* Header */}
      <div className="p-6 border-b border-[#FDC600]/40">
        <h1 className="text-xl font-bold text-[#93197D]">Kidelya</h1>
        <p className="text-sm text-[#6F8D4C]">Dashboard</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 flex flex-col gap-2">
        <SidebarItem href="/" icon={Home} label="Accueil" />
        <SidebarItem href="/users" icon={Users} label="Utilisateurs" />
        <SidebarItem href="/settings" icon={Settings} label="Paramètres" />
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-[#FDC600]/40">
        <SidebarItem href="/logout" icon={LogOut} label="Déconnexion" />
      </div>
    </aside>
  )
}

export function SidebarInset({
  children,
  className,
  ...props
}: React.ComponentProps<"main">) {
  return (
    <div className="flex h-screen w-full">
      {/* Sidebar */}
      <Sidebar />

      {/* Contenu */}
      <main
        className={cn(
          `
          flex-1 h-full overflow-y-auto
          p-6 bg-white
          rounded-l-xl
          text-[#93197D]
          `,
          className
        )}
        {...props}
      >
        {children}
      </main>
    </div>
  )
}


/* Item du sidebar */
function SidebarItem({
  href,
  icon: Icon,
  label,
}: {
  href: string
  icon: any
  label: string
}) {
  return (
    <a
      href={href}
      className="
        flex items-center gap-3 px-4 py-3 rounded-xl
        text-[#93197D] font-medium
        hover:bg-[#FDC600]/20 hover:text-[#93197D]
        transition-all duration-200
      "
    >
      <Icon className="size-5 text-[#93197D]" />
      {label}
    </a>
  )
}
