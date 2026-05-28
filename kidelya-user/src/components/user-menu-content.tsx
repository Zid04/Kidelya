import { Link } from "react-router-dom"
import { User, Settings, HelpCircle, LogOut } from "lucide-react"
import { DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "./ui/dropdown-menu"
import { UserInfo } from "@/components/ui/user-info"
import type { User as UserType } from "@/types/User"
import { useAuth } from "@/context/useAuth"

export function UserMenuContent({ user }: { user: UserType }) {
  const { logout } = useAuth()

  return (
    <div className="py-1">

      {/* En-tête du menu */}
      <DropdownMenuLabel className="p-0 font-normal">
        <div className="flex items-center gap-3 px-3 py-2">
          <UserInfo user={user} />
        </div>
      </DropdownMenuLabel>

      <DropdownMenuSeparator />

      {/* Profil */}
      <DropdownMenuItem asChild>
        <Link
          to="/settings/profil"
          className="flex items-center gap-2 cursor-pointer text-[#6F8D4C] hover:text-[#93197D]"
        >
          <User className="h-4 w-4" />
          Profil
        </Link>
      </DropdownMenuItem>

      {/* Paramètres */}
      <DropdownMenuItem asChild>
        <Link
          to="/settings"
          className="flex items-center gap-2 cursor-pointer text-[#6F8D4C] hover:text-[#93197D]"
        >
          <Settings className="h-4 w-4" />
          Paramètres
        </Link>
      </DropdownMenuItem>

      {/* Aide / FAQ */}
      <DropdownMenuItem asChild>
        <Link
          to="/faq"
          className="flex items-center gap-2 cursor-pointer text-[#6F8D4C] hover:text-[#93197D]"
        >
          <HelpCircle className="h-4 w-4" />
          Aide / FAQ
        </Link>
      </DropdownMenuItem>

      <DropdownMenuSeparator />

      {/* Déconnexion */}
      <DropdownMenuItem
        onSelect={(event) => {
          event.preventDefault()
          logout()
        }}
        className="flex items-center gap-2 cursor-pointer text-[#E94E6F] hover:text-[#93197D]"
      >
        <LogOut className="h-4 w-4" />
        Déconnexion
      </DropdownMenuItem>
    </div>
  )
}
