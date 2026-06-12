import { Link, useLocation } from "react-router-dom"
import { useState } from "react"
import logoKidelya from "@/assets/logo-kidelya.png"
import { useAppearance } from "@/hooks/useApparence"

const navLinks = [
  { label: "Accueil",          href: "/" },
  { label: "Fonctionnalités",  href: "/fonctionnalites" },
  { label: "Packs d'activités",href: "/packs" },
  { label: "Abonnements",      href: "/abonnements" },
  { label: "Contact",          href: "/contact" },
]

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61H19a2 2 0 001.99-1.74L22 6H6" />
    </svg>
  )
}

export default function KidelyaNavbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()
  const { appearance, updateAppearance } = useAppearance()
  const isDark = appearance === "dark"

  function toggleDark() {
    updateAppearance(isDark ? "light" : "dark")
  }

  return (
    <nav className="sticky top-0 z-50 w-full bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex h-16 items-center justify-between gap-6">

          {/* Logo */}
          <Link to="/" className="shrink-0">
            <img src={logoKidelya} alt="Kidelya" className="h-9 w-auto object-contain" />
          </Link>

          {/* Liens desktop */}
          <div className="hidden flex-1 items-center justify-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`whitespace-nowrap text-sm font-medium transition-colors rounded-md px-2 py-1 ${
                  pathname === link.href
                    ? "text-[#E94E6F]"
                    : "text-[#273068] hover:bg-[#D5CDE2] hover:text-[#7C67B2]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions desktop */}
          <div className="hidden items-center gap-3 md:flex">
            <button
              onClick={toggleDark}
              aria-label={isDark ? "Mode clair" : "Mode sombre"}
              className="text-[#273068] transition-colors hover:text-[#E94E6F]"
            >
              {isDark ? (
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                  <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
                </svg>
              )}
            </button>
            <Link to="/panier" className="text-[#273068] transition-colors hover:text-[#E94E6F]" aria-label="Panier">
              <CartIcon />
            </Link>
            <Link
              to="/login"
              className="rounded-lg border border-[#273068] px-4 py-2 text-sm font-semibold text-[#273068] transition hover:bg-[#F5F0FF]"
            >
              Se connecter
            </Link>
            <Link
              to="/register"
              className="rounded-lg bg-[#E94E6F] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#d63f5f]"
            >
              Inscription
            </Link>
          </div>

          {/* Burger mobile */}
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

        {/* Menu mobile */}
        {menuOpen && (
          <div className="space-y-1 pb-4 md:hidden">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`block rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "text-[#E94E6F]"
                    : "text-[#273068] hover:bg-[#D5CDE2] hover:text-[#7C67B2]"
                }`}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 px-4 pt-3">
              <button
                onClick={toggleDark}
                className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-[#273068] transition hover:bg-[#F5F0FF]"
              >
                {isDark ? (
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
                  </svg>
                )}
                {isDark ? "Mode clair" : "Mode sombre"}
              </button>
              <Link
                to="/panier"
                className="flex items-center gap-2 rounded-lg border border-[#273068] px-4 py-2 text-sm font-semibold text-[#273068] transition hover:bg-[#F5F0FF]"
                onClick={() => setMenuOpen(false)}
              >
                <CartIcon />
                Panier
              </Link>
              <Link
                to="/login"
                className="rounded-lg border border-[#273068] px-4 py-2 text-center text-sm font-semibold text-[#273068] transition hover:bg-[#F5F0FF]"
                onClick={() => setMenuOpen(false)}
              >
                Se connecter
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-[#E94E6F] px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-[#d63f5f]"
                onClick={() => setMenuOpen(false)}
              >
                Inscription
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
