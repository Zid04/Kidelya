import { Link } from '@inertiajs/react'
import { useState } from 'react'
import KidelyaButton from './kidelyaButton'
import { KidelyaFlowerMini } from '../../../../kidelya-user/src/Components/KidelyaFlowerMini'

const navLinks = [
  { label: 'Accueil', href: '/' },
  { label: "Packs d'activités", href: '/packs' },
  { label: 'Abonnements', href: '/abonnements' },
  { label: 'Fonctionnalités', href: '/fonctionnalites' },
  { label: 'À propos', href: '/a-propos' },
  { label: 'Aide / FAQ', href: '/faq' },
]

export default function KidelyaNavbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="w-full bg-white border-b border-[#FDC600]/30 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* HEADER */}
        <div className="flex items-center justify-between h-16">

          {/* Logo + Fleur */}
          <Link href="/" className="flex items-center gap-2">
            <KidelyaFlowerMini />
            <img
              src="/logo-kidelya.png"
              alt="Kidelya"
              className="h-9 w-auto object-contain"
            />
            <span className="text-[#93197D] font-bold text-xl tracking-tight">
              Kidelya
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-[#0094A8] hover:text-[#E94E6F] transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login">
              <KidelyaButton variant="ghost" size="sm">
                Se connecter
              </KidelyaButton>
            </Link>
            <Link href="/register">
              <KidelyaButton variant="primary" size="sm">
                S'inscrire
              </KidelyaButton>
            </Link>
          </div>

          {/* Mobile Burger */}
          <button
            className="md:hidden text-[#93197D]"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>

        </div>

        {/* MOBILE MENU */}
        {menuOpen && (
          <div className="md:hidden pb-4 space-y-2 animate-fadeIn">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-4 py-2 text-sm text-[#0094A8] hover:text-[#E94E6F] hover:bg-[#FDC600]/10 rounded-lg transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            <div className="flex flex-col gap-2 px-4 pt-2">
              <Link href="/login">
                <KidelyaButton variant="outline" size="sm" fullWidth>
                  Se connecter
                </KidelyaButton>
              </Link>
              <Link href="/register">
                <KidelyaButton variant="primary" size="sm" fullWidth>
                  S'inscrire
                </KidelyaButton>
              </Link>
            </div>
          </div>
        )}

      </div>
    </nav>
  )
}
