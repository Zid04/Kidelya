import { Link } from "react-router-dom"
import logoKidelya from "@/assets/logo-kidelya.png"

export default function NavFooter() {
  const navigationLinks = [
    { label: "Accueil", to: "/" },
    { label: "Packs d’activités", to: "/packs" },
    { label: "Abonnements", to: "/abonnements" },
    { label: "Fonctionnalités", to: "/fonctionnalites" },
  ]

  const helpLinks = [
    { label: "FAQ", to: "/faq" },
    { label: "Contact", to: "/contact" },
    { label: "À propos", to: "/about" },
    { label: "Mentions légales", to: "/legal" },
    { label: "Politique de confidentialité", to: "/Confidentialite" },
     { label: "CGU", to: "/CGU" },
  ]

  return (
    <footer className="border-t border-[#F1D9B5]/70 bg-transparent text-[#273068]">
      <div className="mx-auto max-w-7xl px-6 py-6">
        <div className="grid gap-5 md:grid-cols-[1fr_0.8fr_0.8fr_1fr]">
          <div>
            <div className="mb-2 flex items-center">
              <img
                src={logoKidelya}
                alt="Kidelya"
                className="h-8 w-auto object-contain"
              />
            </div>

            <p className="max-w-[210px] text-[11px] leading-5 text-[#5F6F4A]">
              Des activités pour grandir, créer et s’épanouir ensemble.
            </p>
          </div>

          <div>
            <h3 className="mb-2 text-[12px] font-extrabold text-[#273068]">
              Navigation
            </h3>
            <ul className="space-y-1.5">
              {navigationLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="text-[11px] text-[#5F6F4A] transition-colors hover:text-[#E94E6F]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-2 text-[12px] font-extrabold text-[#273068]">
              Aide
            </h3>
            <ul className="space-y-1.5">
              {helpLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="text-[11px] text-[#5F6F4A] transition-colors hover:text-[#E94E6F]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-2 text-[12px] font-extrabold text-[#273068]">
              Newsletter
            </h3>

            <p className="mb-2 max-w-[240px] text-[11px] leading-5 text-[#5F6F4A]">
              Recevez nos idées d’activités et nos nouveautés.
            </p>

            <div className="flex max-w-[280px] gap-2">
              <input
                type="email"
                placeholder="Votre email"
                className="min-w-0 flex-1 rounded-[8px] border border-[#F1D9B5] bg-white/80 px-2.5 py-1.5 text-[11px] text-[#273068] outline-none focus:ring-2 focus:ring-[#E94E6F]/25"
              />
              <button className="rounded-[8px] bg-[#E94E6F] px-3 py-1.5 text-[11px] font-semibold text-white transition-colors hover:bg-[#d63f5f]">
                S’abonner
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4 border-t border-[#F1D9B5]/70 pt-3 text-center text-[10px] text-[#5F6F4A]">
          © 2026 Kidelya - Tous droits réservés
        </div>
      </div>
    </footer>
  )
}