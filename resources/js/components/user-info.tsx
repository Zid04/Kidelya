import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useInitials } from "@/hooks/use-initials"
import type { User } from "@/types"

export function UserInfo({ user }: { user: User }) {
  const getInitials = useInitials()

  return (
    <div className="flex items-center gap-3">
      <Avatar className="h-9 w-9 rounded-full border border-[#FDC600]/40">
        <AvatarImage src={user.avatar} alt={user.name} />
        <AvatarFallback className="rounded-full bg-[#FFF4CC] text-[#93197D] font-semibold">
          {getInitials(user.name)}
        </AvatarFallback>
      </Avatar>

      <div className="flex flex-col leading-tight text-left">
        <span className="text-xs text-[#6F8D4C]">Bonjour</span>
        <span className="font-semibold text-[#93197D] truncate">
          {user.name}
        </span>
      </div>
    </div>
  )
}
