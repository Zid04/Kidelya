import { Link } from "@inertiajs/react"
import { KidelyaFlowerMini } from "../../../kidelya-user/src/Components/KidelyaFlowerMini"

export default function UserFooter() {
  return (
    <footer className="bg-white border-t border-[#FDC600]/40 text-[#93197D] py-6">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <KidelyaFlowerMini />
          <img
            src="/logo-kidelya.png"
            alt="Kidelya"
            className="h-7 w-auto object-contain"
          />
          <span className="font-bold text-lg tracking-tight text-[#93197D]">
            Kidelya
          </span>
        </div>

        {/* Liens utilisateur */}
        <nav className="flex items-center gap-6 text-sm">
          <Link
            href="/profile"
            className="text-[#0094A8] hover:text-[#E94E6F] transition-colors"
          >
            Profil
          </Link>

          <Link
            href="/settings"
            className="text-[#0094A8] hover:text-[#E94E6F] transition-colors"
          >
            Paramètres
          </Link>

          <Link
            href="/help"
            className="text-[#0094A8] hover:text-[#E94E6F] transition-colors"
          >
            Aide / FAQ
          </Link>
        </nav>

        {/* Mentions */}
        <p className="text-xs text-[#6F8D4C] text-center md:text-right">
          © 2026 Kidelya — Espace utilisateur
        </p>
      </div>
    </footer>
  )
}
