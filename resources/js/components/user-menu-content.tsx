import { Link } from "@inertiajs/react"
import { User, Settings, HelpCircle, LogOut } from "lucide-react"
import { DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { UserInfo } from "@/components/user-info"
import type { User as UserType } from "@/types"

export function UserMenuContent({ user }: { user: UserType }) {
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
          href="/profile"
          className="flex items-center gap-2 cursor-pointer text-[#6F8D4C] hover:text-[#93197D]"
        >
          <User className="h-4 w-4" />
          Profil
        </Link>
      </DropdownMenuItem>

      {/* Paramètres */}
      <DropdownMenuItem asChild>
        <Link
          href="/settings"
          className="flex items-center gap-2 cursor-pointer text-[#6F8D4C] hover:text-[#93197D]"
        >
          <Settings className="h-4 w-4" />
          Paramètres
        </Link>
      </DropdownMenuItem>

      {/* Aide / FAQ */}
      <DropdownMenuItem asChild>
        <Link
          href="/help"
          className="flex items-center gap-2 cursor-pointer text-[#6F8D4C] hover:text-[#93197D]"
        >
          <HelpCircle className="h-4 w-4" />
          Aide / FAQ
        </Link>
      </DropdownMenuItem>

      <DropdownMenuSeparator />

      {/* Déconnexion */}
      <DropdownMenuItem asChild>
        <Link
          href="/logout"
          as="button"
          className="flex items-center gap-2 cursor-pointer text-[#E94E6F] hover:text-[#93197D]"
        >
          <LogOut className="h-4 w-4" />
          Déconnexion
        </Link>
      </DropdownMenuItem>
    </div>
  )
}
