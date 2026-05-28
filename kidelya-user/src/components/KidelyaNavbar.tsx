import { Link } from "react-router-dom"
import { useState } from "react"
import logoKidelya from "@/assets/logo-kidelya.png"

const navLinks = [
  { label: "Accueil", href: "/" },
  { label: "Packs d'activités", href: "/packs" },
  { label: "Abonnements", href: "/abonnements" },
  { label: "Fonctionnalités", href: "/fonctionnalites" },
  { label: "À propos", href: "/about" },
  { label: "Aide / FAQ", href: "/faq" },
]

const buttonBase =
  "inline-flex items-center justify-center px-4 py-2 rounded-lg font-semibold text-sm transition-colors"

export default function KidelyaNavbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-transparent bg-transparent">
      <div className="mx-auto w-full px-3 sm:px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-3 sm:gap-4">
          <Link to="/" className="flex-shrink-0">
            <img
              src={logoKidelya}
              alt="Kidelya"
              className="h-8 w-auto object-contain sm:h-9"
            />
          </Link>

          <div className="hidden flex-1 items-center justify-end gap-4 lg:gap-6 md:flex">
            <div className="flex items-center gap-2 lg:gap-6 overflow-x-auto">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-xs sm:text-sm font-medium text-[#273068] transition-colors hover:text-[#E94E6F] whitespace-nowrap flex-shrink-0"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-2 border-l border-[#F1D9B5] pl-3 lg:pl-6 flex-shrink-0">
              <Link
                to="/login"
                className={`${buttonBase} text-[#273068] hover:bg-[#FAF7F0] text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2`}
              >
                <span className="hidden sm:inline">Se connecter</span>
                <span className="sm:hidden">Login</span>
              </Link>
              <Link
                to="/register"
                className={`${buttonBase} bg-[#E94E6F] text-white hover:bg-[#d63f5f] text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2`}
              >
                <span className="hidden sm:inline">S'inscrire</span>
                <span className="sm:hidden">Signup</span>
              </Link>
            </div>
          </div>

          <button
            className="text-[#273068] md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Ouvrir le menu"
          >
            <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {menuOpen && (
          <div className="space-y-2 pb-4 md:hidden">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="block rounded-lg px-4 py-2 text-sm text-[#273068] transition-colors hover:bg-[#FDC600]/10 hover:text-[#E94E6F]"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            <div className="flex flex-col gap-2 px-4 pt-2">
              <Link
                to="/login"
                className={`${buttonBase} border border-[#273068] text-[#273068] hover:bg-[#FAF7F0]`}
              >
                Se connecter
              </Link>
              <Link
                to="/register"
                className={`${buttonBase} bg-[#E94E6F] text-white hover:bg-[#d63f5f]`}
              >
                S'inscrire
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}