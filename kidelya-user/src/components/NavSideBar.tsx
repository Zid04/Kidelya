import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { useAuth } from "@/context/useAuth"
import { useAppearance } from "@/hooks/useApparence"
import logoKidelya from "@/assets/logo-kidelya.png"
import fleurNavbar from "@/assets/fleurnavbar.png"

export default function NavSidebar() {
  const { user, logout } = useAuth()
  const { pathname } = useLocation()
  const { appearance, updateAppearance } = useAppearance()
  const [mobileOpen, setMobileOpen] = useState(false)

  function toggleDark() {
    if (appearance === "dark") updateAppearance("light")
    else updateAppearance("dark")
  }

  const isDark = appearance === "dark"

  const planName = user?.plan?.name ?? "Gratuit"
  const planPrice = Number(user?.plan?.price ?? 0)

  const navItems = [
    { title: "Tableau de bord",          href: "/dashboard" },
    { title: "Mes activités",            href: "/activities" },
    { title: "Bibliothèque d'activités", href: "/library" },
    { title: "Planning",                 href: "/calendar" },
    { title: "Mon panier",               href: "/panier" },
    { title: "Paramètres",               href: "/settings" },
    { title: "Aide / FAQ",               href: "/faq" },
  ]

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="flex items-center gap-2 border-b border-gray-100 px-6 py-5">
        <img src={logoKidelya} alt="Kidelya" className="h-8 w-auto object-contain" />
      </div>

      {/* Plan */}
      <div className="border-b border-gray-100 px-6 py-3">
        <p className="text-xs" style={{ color: "var(--color-sidebar-link)" }}>Plan actuel</p>
        <p className="font-semibold" style={{ color: "var(--color-sidebar-text)" }}>{planName}</p>
        {planPrice > 0 && <p className="text-xs" style={{ color: "var(--color-sidebar-link)" }}>{planPrice} € / mois</p>}
        <Link to="/abonnements" className="mt-1 inline-block text-xs hover:opacity-75" style={{ color: "var(--color-plan-link)" }}>
          Voir mes offres
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-1 p-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
              style={{
                backgroundColor: isActive ? "var(--color-sidebar-active-bg)" : "transparent",
                color: isActive ? "var(--color-sidebar-text)" : "var(--color-sidebar-link)",
              }}
            >
              {item.title}
            </Link>
          )
        })}
      </nav>

      {/* Toggle dark mode */}
      <div className="px-4 pb-2">
        <button
          type="button"
          onClick={toggleDark}
          className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-black/5"
          style={{ color: "var(--color-sidebar-link)" }}
        >
          <span className="flex items-center gap-2">
            {isDark ? (
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
              </svg>
            )}
            {isDark ? "Mode clair" : "Mode sombre"}
          </span>
          <span className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${isDark ? "bg-[var(--color-accent)]" : "bg-gray-200"}`}>
            <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${isDark ? "translate-x-4" : "translate-x-1"}`} />
          </span>
        </button>
      </div>

      {/* Bouton déconnexion */}
      <div className="border-t border-gray-100 px-4 py-3">
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[#E94E6F] transition-colors hover:bg-red-50"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Déconnexion
        </button>
      </div>

      {/* Illustration */}
      <div className="shrink-0 overflow-hidden">
        <img src={fleurNavbar} alt="" aria-hidden className="w-full object-contain object-bottom" />
      </div>
    </>
  )

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-gray-100 shadow-sm lg:flex" style={{ backgroundColor: "var(--color-sidebar-bg)", color: "var(--color-sidebar-text)" }}>
        {sidebarContent}
      </aside>

      {/* ── Mobile : bouton hamburger ── */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-[#FAF9F6] shadow-md lg:hidden"
        aria-label="Ouvrir le menu"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#93197D]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* ── Mobile : overlay ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Mobile : panneau flottant ── */}
      <aside
        style={{ backgroundColor: "var(--color-sidebar-bg)", color: "var(--color-sidebar-text)" }}
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-gray-100 shadow-xl transition-transform duration-300 lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Bouton fermer */}
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-[#93197D]"
          aria-label="Fermer le menu"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        {sidebarContent}
      </aside>
    </>
  )
}
