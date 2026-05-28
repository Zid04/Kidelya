import { Outlet } from "react-router-dom"
import { useAuth } from "@/context/useAuth"
import KidelyaNavbar from "@/components/KidelyaNavbar"
import NavSidebar from "@/components/NavSideBar"

export default function MainLayout() {
  const { user } = useAuth()

  // Si pas connecté → navbar publique
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FFF9F0]">
        <KidelyaNavbar />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    )
  }

  // Si connecté → sidebar + contenu
  return (
    <div className="min-h-screen flex bg-[#FFF9F0]">
      <NavSidebar />
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  )
}
