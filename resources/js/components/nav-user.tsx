import { Link, usePage } from "@inertiajs/react"
import { KidelyaFlowerMini } from "kidelya-user/src/Components/KidelyaFlowerMini"

export default function NavSidebar() {
  const { auth } = usePage().props

  // Le backend doit envoyer : auth.plan = { name: "Monthly", price: 5.99 }
  const planName = auth?.plan?.name ?? "Gratuit"
  const planPrice = auth?.plan?.price ?? 0

  const navItems = [
    { title: "Tableau de bord", href: "/dashboard" },
    { title: "Mes activités", href: "/activities" },
    { title: "Bibliotheque d'activite", href: "/Library" },
    { title: "Planning", href: "/calendar" },
    { title: "Packs disponible", href: "/packs" },
    { title: "Paramètres", href: "/settings" },
    { title: "Aide / FAQ", href: "/help" },
  ]

  return (
    <aside className="h-screen w-64 flex flex-col bg-[#FFF4CC] border-r border-[#FDC600]/40 text-[#93197D] shadow-sm">

      {/* LOGO */}
      <div className="flex items-center gap-2 px-6 py-6 border-b border-[#FDC600]/40">
        <KidelyaFlowerMini />
        <img
          src="/logo-kidelya.png"
          alt="Kidelya"
          className="h-8 w-auto object-contain"
        />
      </div>

      {/* PLAN ACTUEL */}
      <div className="px-6 py-4 border-b border-[#FDC600]/40">
        <p className="text-sm text-[#6F8D4C]">Plan actuel</p>

        <p className="font-semibold text-[#93197D]">
          {planName}
        </p>

        {planPrice > 0 && (
          <p className="text-xs text-[#6F8D4C]">
            {planPrice} € / mois
          </p>
        )}

        <Link
          href="/pricing"
          className="text-xs text-[#0094A8] hover:text-[#E94E6F] transition-colors mt-1 inline-block"
        >
          Voir mes offres
        </Link>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 p-4 flex flex-col gap-2">
        {navItems.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-[#6F8D4C] hover:bg-[#FDC600]/20 hover:text-[#93197D] transition-colors"
          >
            {item.title}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
