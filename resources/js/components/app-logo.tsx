import AppLogoIcon from "@/components/app-logo-icon"

export default function AppLogo() {
  return (
    <div className="flex items-center gap-2">
      <AppLogoIcon className="h-8 w-auto" />

      <span className="text-sm font-semibold text-[#93197D]">
        Kidelya
      </span>
    </div>
  )
}
