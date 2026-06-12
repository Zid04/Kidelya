import { useState } from "react"
import { Link } from "react-router-dom"
import logoKidelya from "@/assets/logo-kidelya.png"
import api from "@/api/axios"

export default function NavFooter() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  async function handleNewsletter(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!email) return
    setStatus("loading")
    try {
      await api.post("/newsletter", { email })
      setStatus("success")
      setEmail("")
    } catch {
      setStatus("error")
    }
  }
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
    <footer className="bg-transparent text-black">
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

            <p className="max-w-[210px] text-[11px] leading-5 text-black">
              Des activités pour grandir, créer et s’épanouir ensemble.
            </p>
          </div>

          <div>
            <h3 className="mb-2 text-[12px] font-extrabold text-black">
              Navigation
            </h3>
            <ul className="space-y-1.5">
              {navigationLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="text-[11px] text-black transition-colors hover:text-[#E94E6F]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-2 text-[12px] font-extrabold text-black">
              Aide
            </h3>
            <ul className="space-y-1.5">
              {helpLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="text-[11px] text-black transition-colors hover:text-[#E94E6F]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-2 text-[12px] font-extrabold text-black">
              Newsletter
            </h3>

            <p className="mb-2 max-w-[240px] text-[11px] leading-5 text-black">
              Recevez nos idées d’activités et nos nouveautés.
            </p>

            <form onSubmit={handleNewsletter} className="flex max-w-[280px] gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Votre email"
                required
                disabled={status === "loading" || status === "success"}
                className="min-w-0 flex-1 rounded-[8px] border border-[#273068] bg-white/80 px-2.5 py-1.5 text-[11px] text-black outline-none focus:ring-2 focus:ring-[#E94E6F]/25 disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={status === "loading" || status === "success"}
                className="rounded-[8px] bg-[#E94E6F] px-3 py-1.5 text-[11px] font-semibold text-white transition-colors hover:bg-[#d63f5f] disabled:opacity-60"
              >
                {status === "loading" ? "..." : status === "success" ? "✓" : "S’abonner"}
              </button>
            </form>

            {status === "success" && (
              <p className="mt-1.5 text-[10px] font-semibold text-[#6F8D4C]">Inscription confirmée !</p>
            )}
            {status === "error" && (
              <p className="mt-1.5 text-[10px] font-semibold text-[#E94E6F]">Une erreur est survenue.</p>
            )}
          </div>
        </div>

        <div className="mt-4 border-t border-[#273068] pt-3 text-center text-[10px] text-black">
          © 2026 Kidelya - Tous droits réservés
        </div>
      </div>
    </footer>
  )
}