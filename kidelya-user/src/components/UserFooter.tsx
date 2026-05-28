import { Link } from "react-router-dom"
import { KidelyaFlowerMini } from "./KidelyaFlowerMini"
import logoKidelya from "@/assets/logo-kidelya.png"

export default function UserFooter() {
  return (
    <footer className="border-t border-[#FDC600]/40 bg-white py-6 text-[#93197D]">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 md:flex-row">
        <div className="flex items-center gap-2">
          <KidelyaFlowerMini />
          <img
            src={logoKidelya}
            alt="Kidelya"
            className="h-7 w-auto object-contain"
          />
          <span className="text-lg font-bold tracking-tight text-[#93197D]">
            Kidelya
          </span>
        </div>

        <nav className="flex items-center gap-6 text-sm">
          <Link
            to="/settings/profil"
            className="text-[#0094A8] transition-colors hover:text-[#E94E6F]"
          >
            Profil
          </Link>
          <Link
            to="/settings"
            className="text-[#0094A8] transition-colors hover:text-[#E94E6F]"
          >
            Paramètres
          </Link>
          <Link
            to="/faq"
            className="text-[#0094A8] transition-colors hover:text-[#E94E6F]"
          >
            Aide / FAQ
          </Link>
        </nav>

        <p className="text-center text-xs text-[#6F8D4C] md:text-right">
          © 2026 Kidelya - Espace utilisateur
        </p>
      </div>
    </footer>
  )
}
