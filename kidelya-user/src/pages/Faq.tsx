import { useState } from "react"
import { Link } from "react-router-dom"
import heroAide from "@/assets/photo-faq-hero.png"
import besoinAide from "@/assets/besoinAide.png"
import oiseauBesoin from "@/assets/oiseauBesoin.png"
import fleurService from "@/assets/fleurservice.png"
import fleur2Service from "@/assets/fleur2service.png"
import fleurService3 from "@/assets/fleurservice3.png"

const faqs = [
  { q: "Qu'est-ce que Kidelya ?", a: "Kidelya est une plateforme qui aide à créer, organiser et partager des activités adaptées aux enfants." },
  { q: "Comment créer une activité personnalisée ?", a: "Depuis votre espace, cliquez sur « Créer une activité » et ajoutez vos consignes, photos et étapes." },
  { q: "Comment fonctionne le calendrier ?", a: "Le calendrier vous permet de planifier vos activités par jour, semaine ou mois, avec une vue claire et organisée." },
  { q: "Quelle est la différence entre un pack et un abonnement ?", a: "Les packs sont des achats uniques, tandis que l'abonnement donne un accès illimité à tous les packs disponibles." },
  { q: "Puis-je utiliser Kidelya sur plusieurs appareils ?", a: "Oui, votre compte est synchronisé sur tous vos appareils connectés." },
  { q: "Comment annuler ou modifier mon abonnement ?", a: "Vous pouvez gérer votre abonnement à tout moment depuis la section « Mon compte »." },
  { q: "Comment contacter le support ?", a: "Vous pouvez nous écrire via le formulaire de contact ou par email à bonjour@kidelya.com." },
  { q: "Mes données sont-elles sécurisées ?", a: "Oui, vos données sont protégées et utilisées uniquement pour le bon fonctionnement du service." },
]

const guides = [
  { label: "Bien démarrer avec Kidelya",   icon: "draft",     href: "/dashboard" },
  { label: "Créer sa première activité",    icon: "edit-file", href: "/activities/create" },
  { label: "Utiliser le calendrier",        icon: "calendar",  href: "/calendar" },
  { label: "Acheter un pack d'activités",   icon: "cart",      href: "/packs" },
  { label: "Comprendre les abonnements",    icon: "layers",    href: "/abonnements" },
  { label: "Gérer les paramètres du compte",icon: "contact",   href: "/settings" },
]

// ─── Icônes ───────────────────────────────────────────────────

function IconDraft({ className = "h-4 w-4 text-[#273068]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path d="M6 4h9l4 4v13H6V4z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M15 4v4h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 11h7M9 14h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function IconEditFile({ className = "h-4 w-4 text-[#273068]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path d="M6 4h8l4 4v8H6V4z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M14 4v4h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11.5 17.5l5.5-5.5 1.5 1.5-5.5 5.5H11.5v-1.5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  )
}

function IconCalendar({ className = "h-4 w-4 text-[#273068]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <rect x="4" y="5" width="16" height="15" rx="2.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M4 9h16M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

/** Chariot de supermarché */
function IconCart({ className = "h-4 w-4 text-[#273068]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path d="M2 3h2l2.5 11h10l2-7H7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9" cy="19.5" r="1.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17" cy="19.5" r="1.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

function IconLayers({ className = "h-4 w-4 text-[#273068]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <rect x="5" y="4" width="14" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
      <rect x="5" y="13" width="14" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  )
}

function IconContact({ className = "h-4 w-4 text-[#273068]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M5 20c0-3.3 3.1-6 7-6s7 2.7 7 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

/** Chevron bas (remplace le +) */
function IconChevronDown({ className = "h-4 w-4 text-[#E94E6F]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconArrow({ className = "h-3.5 w-3.5 text-[#E94E6F]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconMail({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function IconPhone({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path d="M8.5 3h7a1.5 1.5 0 011.5 1.5v15A1.5 1.5 0 0115.5 21h-7A1.5 1.5 0 017 19.5v-15A1.5 1.5 0 018.5 3z" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="17.5" r="0.9" fill="currentColor" />
    </svg>
  )
}

function GuideIcon({ kind }: { kind: string }) {
  const cls = "h-4 w-4 text-[#273068]"
  if (kind === "draft") return <IconDraft className={cls} />
  if (kind === "edit-file") return <IconEditFile className={cls} />
  if (kind === "calendar") return <IconCalendar className={cls} />
  if (kind === "cart") return <IconCart className={cls} />
  if (kind === "layers") return <IconLayers className={cls} />
  return <IconContact className={cls} />
}

export default function AidePage() {
  const [search, setSearch] = useState("")
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const filteredFaqs = faqs.filter(
    (item) =>
      search.trim() === "" ||
      item.q.toLowerCase().includes(search.toLowerCase()) ||
      item.a.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-white text-[#273068]">

      {/* HERO */}
      <section className="mx-auto max-w-6xl px-6 pb-8 pt-14">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.95fr]">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl font-extrabold md:text-5xl">
              Comment pouvons-nous vous aider ?
            </h1>
            <div className="mx-auto mt-3 h-[3px] w-12 rounded-full bg-[#E94E6F] lg:mx-0" />
            <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-7 text-[#4F5F45] lg:mx-0">
              Trouvez rapidement des réponses à vos questions ou contactez notre équipe.
            </p>
            <div className="mt-8 max-w-xl">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher une question, un sujet..."
                className="h-12 w-full rounded-[10px] border border-[#F1D9B5] bg-transparent px-4 text-sm outline-none focus:ring-2 focus:ring-[#E94E6F]/25"
              />
            </div>
          </div>

          <div className="overflow-hidden rounded-[18px]">
            <img src={heroAide} alt="Aide Kidelya" className="h-[280px] w-full rounded-[12px] object-cover md:h-[340px]" />
          </div>
        </div>
      </section>

      {/* CONTENU PRINCIPAL */}
      <section className="mx-auto grid max-w-6xl gap-8 px-6 pb-10 lg:grid-cols-[1.4fr_0.6fr]">

        {/* FAQ */}
        <div>
          <h2 className="mb-4 text-xl font-bold">Questions fréquentes</h2>

          {/* Grand div légèrement jaunâtre */}
          <div className="overflow-hidden rounded-[12px]" style={{ backgroundColor: "var(--app-warm-bg)" }}>
            {filteredFaqs.length === 0 ? (
              <p className="p-4 text-sm text-[#4F5F45]">Aucun résultat pour cette recherche.</p>
            ) : (
              filteredFaqs.map((item, i) => {
                const isOpen = openIndex === i
                return (
                  <div
                    key={item.q}
                    className={`text-sm text-[#4F5F45] ${i < filteredFaqs.length - 1 ? "border-b border-[#F1D9B5]/60" : ""}`}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenIndex(isOpen ? null : i)}
                      className="flex w-full cursor-pointer items-center justify-between bg-transparent px-4 py-3 text-left font-semibold text-[#273068]"
                    >
                      {item.q}
                      <span
                        className="ml-2 shrink-0 transition-transform duration-200"
                        style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                      >
                        <IconChevronDown />
                      </span>
                    </button>
                    {isOpen && (
                      <p className="bg-transparent px-4 pb-3 leading-6">{item.a}</p>
                    )}
                  </div>
                )
              })
            )}
          </div>

          {/* CTA bas — fond violet foncé faible opacité + image gauche */}
          <div
            className="mt-6 flex items-center gap-4 overflow-hidden rounded-[12px] px-6 py-5"
            style={{ backgroundColor: "var(--app-muted-bg)" }}
          >
            <img
              src={besoinAide}
              alt=""
              aria-hidden="true"
              className="h-20 w-20 shrink-0 rounded-[10px] object-cover"
            />
            <div className="flex-1 text-left">
              <h4 className="font-semibold text-[#273068]">Besoin d'aide ?</h4>
              <p className="mt-1 text-sm text-[#4F5F45]">
                Notre équipe est là pour vous accompagner
              </p>
              <Link
                to="/contact"
                className="mt-3 inline-flex rounded-[9px] bg-[#E94E6F] px-4 py-2 text-sm font-semibold text-white hover:bg-[#d63f5f]"
              >
                Nous contacter
              </Link>
            </div>
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="space-y-5">

          {/* Guides — même fond que "Besoin d'aide?" */}
          <article className="rounded-[12px] p-5" style={{ backgroundColor: "var(--app-muted-bg)" }}>
            <h3 className="font-semibold text-[#273068]">Guides et ressources</h3>
            <ul className="mt-3 divide-y divide-[#F1D9B5]/60 text-sm text-[#4F5F45]">
              {guides.map((g) => (
                <li key={g.label}>
                  <Link
                    to={g.href}
                    className="flex items-center gap-2 py-2 transition-colors hover:text-[#E94E6F]"
                  >
                    <span className="shrink-0">
                      <GuideIcon kind={g.icon} />
                    </span>
                    <span className="flex-1">{g.label}</span>
                    <IconArrow className="h-3.5 w-3.5 text-[#E94E6F]" />
                  </Link>
                </li>
              ))}
            </ul>
          </article>

          {/* Besoin d'aide rapidement — avec image oiseau à droite */}
          <article className="overflow-hidden rounded-[12px] border border-[var(--app-border)] bg-[var(--app-card)]">
            <div className="flex items-stretch">
              <div className="flex-1 p-5">
                <h3 className="font-semibold text-[var(--app-text)]">Besoin d'aide rapidement ?</h3>
                <ul className="mt-3 space-y-3 text-sm text-[var(--app-muted)]">
                  {/* Email — fond bleu circulaire */}
                  <li className="flex items-start gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#273068]/15">
                      <IconMail className="h-4 w-4 text-[#273068]" />
                    </span>
                    <span>
                      <strong>Email :</strong> bonjour@kidelya.com
                      <br />
                      <span className="text-xs">Réponse sous 24h ouvrées.</span>
                    </span>
                  </li>
                  {/* Téléphone — fond rose, icône blanche */}
                  <li className="flex items-start gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E94E6F]">
                      <IconPhone className="h-4 w-4 text-white" />
                    </span>
                    <span>
                      <strong>Téléphone :</strong> 01 23 45 67 89
                      <br />
                      <span className="text-xs">Lun–Ven, 9h–18h.</span>
                    </span>
                  </li>
                </ul>
              </div>
              {/* Image oiseau à droite */}
              <div className="w-24 shrink-0 self-stretch">
                <img
                  src={oiseauBesoin}
                  alt=""
                  aria-hidden="true"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </article>

        </div>
      </section>

      {/* SECTION BAS — 3 cards horizontales */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="grid gap-5 md:grid-cols-3">

          {/* Card 1 — Sécurité */}
          <div className="flex items-center justify-between overflow-hidden rounded-[16px] bg-white border border-[#F1D9B5] px-5 py-5 shadow-sm">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#273068]">
                <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none">
                  <path d="M12 3L4 6.5V11C4 15.4 7.4 19.5 12 21C16.6 19.5 20 15.4 20 11V6.5L12 3Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-[#273068]">Un service fiable et sécurisé</p>
                <p className="mt-1 text-xs leading-5 text-[#4F5F45]">Vos données sont protégées et confidentielles.</p>
              </div>
            </div>
            <img src={fleurService} alt="" aria-hidden="true" className="h-16 w-16 shrink-0 object-contain ml-3" />
          </div>

          {/* Card 2 — Support humain */}
          <div className="flex items-center justify-between overflow-hidden rounded-[16px] bg-white border border-[#F1D9B5] px-5 py-5 shadow-sm">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#67A63B]">
                <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none">
                  <path d="M3 11a9 9 0 0118 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  <rect x="3" y="11" width="3.5" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
                  <rect x="17.5" y="11" width="3.5" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M20.5 17v1a2.5 2.5 0 01-2.5 2.5h-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-[#273068]">Des réponses humaines</p>
                <p className="mt-1 text-xs leading-5 text-[#4F5F45]">Nos équipes vous répondent avec bienveillance et efficacité.</p>
              </div>
            </div>
            <img src={fleur2Service} alt="" aria-hidden="true" className="h-16 w-16 shrink-0 object-contain ml-3" />
          </div>

          {/* Card 3 — Réactivité */}
          <div className="flex items-center justify-between overflow-hidden rounded-[16px] bg-white border border-[#F1D9B5] px-5 py-5 shadow-sm">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#8B5CF6]">
                <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none">
                  <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="1.7" />
                  <path d="M12 8v4l2.5 2.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M10 3h4M10 21h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-[#273068]">Disponibles rapidement</p>
                <p className="mt-1 text-xs leading-5 text-[#4F5F45]">Un support réactif pour ne jamais vous laisser sans réponse.</p>
              </div>
            </div>
            <img src={fleurService3} alt="" aria-hidden="true" className="h-16 w-16 shrink-0 object-contain ml-3" />
          </div>

        </div>
      </section>
    </div>
  )
}