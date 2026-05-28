import { Link } from "react-router-dom"
import NavFooter from "@/components/NavFooter"
import heroAide from "@/assets/photo-faq-hero.png"

const categories = [
  {
    title: "Premiers pas",
    desc: "Découvrez comment bien démarrer avec Kidelya.",
    icon: "book",
    iconBg: "bg-[#EAF3FF]",
  },
  {
    title: "Gérer mes activités",
    desc: "Créez, organisez et planifiez vos activités facilement.",
    icon: "folder",
    iconBg: "bg-[#EAF7DF]",
  },
  {
    title: "Packs et abonnements",
    desc: "Tout savoir sur les packs, les abonnements et les achats.",
    icon: "gift",
    iconBg: "bg-[#FFF3D9]",
  },
  {
    title: "Mon compte",
    desc: "Gérez vos informations personnelles et vos préférences.",
    icon: "user",
    iconBg: "bg-[#FFE7ED]",
  },
]

const faqs = [
  {
    q: "Qu’est-ce que Kidelya ?",
    a: "Kidelya est une plateforme qui aide à créer, organiser et partager des activités adaptées aux enfants.",
  },
  {
    q: "Comment créer une activité personnalisée ?",
    a: "Depuis votre espace, cliquez sur « Créer une activité » et ajoutez vos consignes, photos et étapes.",
  },
  {
    q: "Comment fonctionne le calendrier ?",
    a: "Le calendrier vous permet de planifier vos activités par jour, semaine ou mois, avec une vue claire et organisée.",
  },
  {
    q: "Quelle est la différence entre un pack et un abonnement ?",
    a: "Les packs sont des achats uniques, tandis que l’abonnement donne un accès illimité à tous les packs disponibles.",
  },
  {
    q: "Puis-je utiliser Kidelya sur plusieurs appareils ?",
    a: "Oui, votre compte est synchronisé sur tous vos appareils connectés.",
  },
  {
    q: "Comment annuler ou modifier mon abonnement ?",
    a: "Vous pouvez gérer votre abonnement à tout moment depuis la section « Mon compte ».",
  },
  {
    q: "Comment contacter le support ?",
    a: "Vous pouvez nous écrire via le formulaire de contact ou par email à bonjour@kidelya.com.",
  },
  {
    q: "Mes données sont-elles sécurisées ?",
    a: "Oui, vos données sont protégées et utilisées uniquement pour le bon fonctionnement du service.",
  },
]

const guides = [
  "Bien démarrer avec Kidelya",
  "Créer sa première activité",
  "Utiliser le calendrier",
  "Acheter un pack d’activités",
  "Comprendre les abonnements",
  "Gérer les paramètres du compte",
]

const reliability = [
  {
    title: "Données protégées",
    desc: "Vos informations sont sécurisées et confidentielles.",
    icon: "shield",
    iconBg: "bg-[#FFE7ED]",
  },
  {
    title: "Interface simple",
    desc: "Un design clair pour une prise en main facile.",
    icon: "check",
    iconBg: "bg-[#EAF3FF]",
  },
  {
    title: "Accès rapide",
    desc: "Accédez à vos activités partout, à tout moment.",
    icon: "bolt",
    iconBg: "bg-[#FFF3D9]",
  },
  {
    title: "Expérience fluide",
    desc: "Une plateforme rapide, fiable et agréable.",
    icon: "spark",
    iconBg: "bg-[#EAF7DF]",
  },
]

function Icon({
  kind,
  className = "h-5 w-5 text-[#273068]",
}: {
  kind:
    | "book"
    | "folder"
    | "gift"
    | "user"
    | "shield"
    | "check"
    | "bolt"
    | "spark"
    | "mail"
    | "phone"
    | "file"
  className?: string
}) {
  if (kind === "book") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none">
        <path d="M5 6.5A2.5 2.5 0 017.5 4H19v15H7.5A2.5 2.5 0 005 21V6.5z" stroke="currentColor" strokeWidth="1.8" />
        <path d="M8 8h8M8 12h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    )
  }
  if (kind === "folder") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none">
        <path d="M3 8a2 2 0 012-2h5l2 2h7a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    )
  }
  if (kind === "gift") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none">
        <rect x="3" y="8" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.8" />
        <path d="M3 12h18M12 8v13" stroke="currentColor" strokeWidth="1.8" />
        <path d="M12 8c-2.5 0-4-1.1-4-2.5S9 3 10.5 3C12 3 12 5 12 8zM12 8c2.5 0 4-1.1 4-2.5S15 3 13.5 3C12 3 12 5 12 8z" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    )
  }
  if (kind === "user") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none">
        <circle cx="12" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.8" />
        <path d="M5 20c0-3.2 2.8-5.5 7-5.5s7 2.3 7 5.5" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    )
  }
  if (kind === "shield") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none">
        <path d="M12 3l7 3v5c0 4.7-2.9 8.8-7 10-4.1-1.2-7-5.3-7-10V6l7-3z" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    )
  }
  if (kind === "check") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
        <path d="M8 12.5l2.5 2.5L16 9.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    )
  }
  if (kind === "bolt") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none">
        <path d="M13 2L5 13h6l-1 9 8-11h-6l1-9z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    )
  }
  if (kind === "spark") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none">
        <path d="M12 3l1.8 4.5L18 9.3l-4.2 1.7L12 15.5 10.2 11 6 9.3l4.2-1.8L12 3z" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    )
  }
  if (kind === "mail") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none">
        <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" />
        <path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    )
  }
  if (kind === "phone") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none">
        <path d="M8.5 3h7a1.5 1.5 0 011.5 1.5v15A1.5 1.5 0 0115.5 21h-7A1.5 1.5 0 017 19.5v-15A1.5 1.5 0 018.5 3z" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="12" cy="17.5" r="0.9" fill="currentColor" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path d="M7 4h8l4 4v12H7z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M15 4v4h4" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  )
}

export default function AidePage() {
  return (
    <div className="min-h-screen bg-[#FFF9F0] text-[#273068]">
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
                placeholder="Rechercher une question, un sujet..."
                className="h-12 w-full rounded-[10px] border border-[#F1D9B5] bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-[#E94E6F]/25"
              />
            </div>
          </div>

          <div className="overflow-hidden rounded-[18px] border border-[#F1D9B5] bg-transparent p-0">
            <img
              src={heroAide}
              alt="Aide Kidelya"
              className="h-[280px] w-full rounded-[12px] object-cover md:h-[340px]"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-10">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {categories.map((item) => (
            <article key={item.title} className="rounded-[14px] border border-[#F1D9B5] bg-white p-5 text-center">
              <div className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full ${item.iconBg}`}>
                <Icon kind={item.icon as "book" | "folder" | "gift" | "user"} />
              </div>
              <h3 className="font-bold">{item.title}</h3>
              <p className="mt-2 text-sm text-[#4F5F45]">{item.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-6 pb-10 lg:grid-cols-[1.4fr_0.6fr]">
        <div>
          <h2 className="mb-4 text-xl font-bold">Questions fréquentes</h2>
          <div className="space-y-3">
            {faqs.map((item) => (
              <details key={item.q} className="rounded-[12px] border border-[#F1D9B5] bg-white p-4 text-sm text-[#4F5F45]">
                <summary className="cursor-pointer font-semibold text-[#273068]">{item.q}</summary>
                <p className="mt-2">{item.a}</p>
              </details>
            ))}
          </div>

          <div className="mt-6 rounded-[12px] border border-[#F1D9B5] bg-[#FFF3E0] p-6 text-center">
            <h4 className="font-semibold">Vous ne trouvez pas la réponse ?</h4>
            <p className="mt-2 text-sm text-[#4F5F45]">
              Décrivez votre situation, nous vous répondrons dans les plus brefs délais.
            </p>
            <Link
              to="/contact"
              className="mt-4 inline-flex rounded-[9px] bg-[#E94E6F] px-4 py-2 text-sm font-semibold text-white hover:bg-[#d63f5f]"
            >
              Nous contacter
            </Link>
          </div>
        </div>

        <div className="space-y-5">
          <article className="rounded-[12px] border border-[#F1D9B5] bg-white p-5">
            <h3 className="font-semibold">Guides et ressources</h3>
            <ul className="mt-3 space-y-2 text-sm text-[#4F5F45]">
              {guides.map((g) => (
                <li key={g} className="flex items-center gap-2">
                  <Icon kind="book" className="h-4 w-4 text-[#273068]" />
                  {g}
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-[12px] border border-[#F1D9B5] bg-[#FFF3E0] p-5">
            <h3 className="font-semibold">Besoin d’aide rapidement ?</h3>
            <ul className="mt-3 space-y-3 text-sm text-[#4F5F45]">
              <li className="flex items-start gap-2">
                <Icon kind="mail" className="mt-0.5 h-4 w-4 text-[#273068]" />
                <span>
                  <strong>Email :</strong> bonjour@kidelya.com
                  <br />
                  <span className="text-xs">Réponse sous 24h ouvrées.</span>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Icon kind="phone" className="mt-0.5 h-4 w-4 text-[#273068]" />
                <span>
                  <strong>Téléphone :</strong> 01 23 45 67 89
                  <br />
                  <span className="text-xs">Du lundi au vendredi, de 9h à 18h.</span>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Icon kind="file" className="mt-0.5 h-4 w-4 text-[#273068]" />
                <span>
                  <strong>Formulaire :</strong> Décrivez votre demande, nous vous recontacterons.
                </span>
              </li>
            </ul>
          </article>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <h2 className="text-center text-2xl font-bold">Un service fiable et sécurisé</h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-sm text-[#4F5F45]">
          Vos données sont protégées et votre expérience est notre priorité.
        </p>

        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {reliability.map((b) => (
            <article key={b.title} className="rounded-[14px] border border-[#F1D9B5] bg-white p-6 text-center">
              <div className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full ${b.iconBg}`}>
                <Icon kind={b.icon as "shield" | "check" | "bolt" | "spark"} />
              </div>
              <h4 className="font-semibold">{b.title}</h4>
              <p className="mt-2 text-xs text-[#4F5F45]">{b.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <NavFooter />
    </div>
  )
}