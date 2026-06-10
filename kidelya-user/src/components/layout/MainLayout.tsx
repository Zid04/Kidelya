import { Outlet } from "react-router-dom"
import { useAuth } from "@/context/useAuth"
import KidelyaNavbar from "@/components/KidelyaNavbar"
import NavSidebar from "@/components/NavSideBar"
import NavFooter from "@/components/NavFooter"

export default function MainLayout() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-[#6F8D4C]">
        Chargement...
      </div>
    )
  }

  // Pas connecté → navbar publique + footer
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

  // Connecté → sidebar + contenu + footer pleine largeur
  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Zone sidebar + contenu principal */}
      <div className="flex flex-1">
        <NavSidebar />
        <main className="flex-1 overflow-x-hidden p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
      {/* Footer pleine largeur, sous la sidebar et le contenu */}
      <NavFooter />
    </div>
  )
}
