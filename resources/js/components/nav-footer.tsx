import { Link } from "@inertiajs/react"
import { KidelyaFlowerMini } from "../../../kidelya-user/src/Components/KidelyaFlowerMini"

export default function NavFooter() {
  return (
    <footer className="bg-white border-t border-[#FDC600]/40 text-[#93197D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Logo + description */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <KidelyaFlowerMini />

              <img
                src="/logo-kidelya.png"
                alt="Kidelya"
                className="h-9 w-auto object-contain"
              />

              <span className="font-bold text-xl tracking-tight text-[#93197D]">
                Kidelya
              </span>
            </div>

            <p className="text-sm text-[#6F8D4C] leading-relaxed">
              Des activités pour grandir, créer et s'épanouir ensemble.
            </p>

            <div className="flex gap-3 mt-4">
              {["facebook", "instagram", "twitter"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-9 h-9 bg-[#FDC600]/20 hover:bg-[#E94E6F] text-[#93197D] hover:text-white rounded-full flex items-center justify-center transition-colors"
                >
                  <span className="text-sm font-semibold">
                    {social[0].toUpperCase()}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-semibold mb-4 text-[#E94E6F]">Navigation</h3>
            <ul className="space-y-2">
              {[
                "Accueil",
                "Packs d'activités",
                "Abonnements",
                "Fonctionnalités",
              ].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-sm text-[#0094A8] hover:text-[#E94E6F] transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Aide */}
          <div>
            <h3 className="font-semibold mb-4 text-[#E94E6F]">Aide</h3>
            <ul className="space-y-2">
              {["FAQ", "Contact", "À propos", "Mentions légales", "CGU"].map(
                (item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="text-sm text-[#0094A8] hover:text-[#E94E6F] transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold mb-4 text-[#E94E6F]">Newsletter</h3>
            <p className="text-sm text-[#6F8D4C] mb-3">
              Recevez nos idées d'activités chaque semaine !
            </p>

            <div className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="votre@email.com"
                className="px-3 py-2 rounded-lg bg-white border border-[#FDC600]/40 text-[#93197D] placeholder-[#BFAED6] text-sm focus:outline-none focus:ring-2 focus:ring-[#E94E6F]"
              />
              <button className="px-4 py-2 bg-[#E94E6F] hover:bg-[#d63f5f] text-white text-sm font-semibold rounded-lg transition-colors">
                S'abonner
              </button>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#FDC600]/40 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#6F8D4C]">
            © 2026 Kidelya. Tous droits réservés.
          </p>

          <div className="flex gap-4">
            {["Politique de confidentialité", "CGU", "Cookies"].map((item) => (
              <Link
                key={item}
                href="#"
                className="text-xs text-[#0094A8] hover:text-[#E94E6F] transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </footer>
  )
}
