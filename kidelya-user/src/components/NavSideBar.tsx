import { Link } from "react-router-dom"
import { useAuth } from "@/context/useAuth"
import { KidelyaFlowerMini } from "./KidelyaFlowerMini"
import logoKidelya from "@/assets/logo-kidelya.png"

export default function NavSidebar() {
  const { user } = useAuth()

  const planName = user?.plan?.name ?? "Gratuit"
  const planPrice = Number(user?.plan?.price ?? 0)

  const navItems = [
    { title: "Tableau de bord", href: "/dashboard" },
    { title: "Mes activités", href: "/activities" },
    { title: "Bibliothèque d'activités", href: "/library" },
    { title: "Planning", href: "/calendar" },
    { title: "Packs disponibles", href: "/packs" },
    { title: "Paramètres", href: "/settings" },
    { title: "Aide / FAQ", href: "/faq" },
  ]

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-[#FDC600]/40 bg-[#FFF4CC] text-[#93197D] shadow-sm">
      <div className="flex items-center gap-2 border-b border-[#FDC600]/40 px-6 py-6">
        <KidelyaFlowerMini />
        <img
          src={logoKidelya}
          alt="Kidelya"
          className="h-8 w-auto object-contain"
        />
      </div>

      <div className="border-b border-[#FDC600]/40 px-6 py-4">
        <p className="text-sm text-[#6F8D4C]">Plan actuel</p>
        <p className="font-semibold text-[#93197D]">{planName}</p>

        {planPrice > 0 && (
          <p className="text-xs text-[#6F8D4C]">{planPrice} € / mois</p>
        )}

        <Link
          to="/abonnements"
          className="mt-1 inline-block text-xs text-[#0094A8] transition-colors hover:text-[#E94E6F]"
        >
          Voir mes offres
        </Link>
      </div>

      <nav className="flex flex-1 flex-col gap-2 p-4">
        {navItems.map((item) => (
          <Link
            key={item.title}
            to={item.href}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[#6F8D4C] transition-colors hover:bg-[#FDC600]/20 hover:text-[#93197D]"
          >
            {item.title}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
