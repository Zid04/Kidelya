import { useEffect, useState } from "react"
import { Outlet, Link } from "react-router-dom"
import { useAuth } from "@/context/useAuth"
import KidelyaNavbar from "@/components/KidelyaNavbar"
import NavSidebar from "@/components/NavSideBar"
import NavFooter from "@/components/NavFooter"
import api from "@/api/axios"

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
      <circle cx="16" cy="21" r="1" />
      <circle cx="9" cy="21" r="1" />
    </svg>
  )
}

function TopBar() {
  const { user } = useAuth()
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    api.get("/cart")
      .then(res => {
        const items = res.data.data ?? []
        setCartCount(items.reduce((sum: number, item: { quantity: number }) => sum + (item.quantity ?? 1), 0))
      })
      .catch(() => {})
  }, [])

  if (!user) return null

  const initials = `${user.firstname?.[0] ?? ""}${user.lastname?.[0] ?? ""}`.toUpperCase()

  return (
    <div className="flex items-center justify-end gap-3 pb-3 mb-1">
      {/* Panier */}
      <Link
        to="/panier"
        className="relative flex h-9 w-9 items-center justify-center rounded-full border border-gray-100 bg-white shadow-sm text-[#21164F] hover:bg-gray-50 transition-colors"
        aria-label="Mon panier"
      >
        <CartIcon />
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#E94E6F] text-[10px] font-black text-white leading-none">
            {cartCount > 9 ? "9+" : cartCount}
          </span>
        )}
      </Link>

      {/* Prénom + avatar */}
      <p className="hidden sm:block text-sm font-semibold text-[#21164F]">
        Bonjour {user.firstname},
      </p>
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#8F6BC8] text-xs font-black text-white">
        {initials}
      </div>
    </div>
  )
}

export default function MainLayout() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-[#6F8D4C]">
        Chargement...
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <KidelyaNavbar />
        <main className="flex-1">
          <Outlet />
        </main>
        <NavFooter />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <div className="flex flex-1">
        <NavSidebar />
        <main className="flex-1 overflow-x-hidden p-4 sm:p-6">
          <TopBar />
          <Outlet />
        </main>
      </div>
      <NavFooter />
    </div>
  )
}
