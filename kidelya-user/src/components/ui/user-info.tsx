import type { User } from "@/types/User"

export function UserInfo({ user }: { user: User }) {
  return (
    <div className="flex items-center gap-3">
      {/* Avatar */}
      <div className="h-10 w-10 rounded-full bg-[#FDC600]/30 flex items-center justify-center text-[#93197D] font-semibold">
        {user.firstname?.[0]}
        {user.lastname?.[0]}
      </div>

      {/* Infos */}
      <div className="flex flex-col leading-tight">
        <span className="font-medium text-[#93197D]">
          {user.firstname} {user.lastname}
        </span>
        <span className="text-xs text-[#6F8D4C]">{user.email}</span>
      </div>
    </div>
  )
}
