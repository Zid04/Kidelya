import { Link } from "react-router-dom"
import NavFooter from "@/components/NavFooter"
import heroFonctionnalites from "@/assets/photo-hero-abonnement.png"

const featureCards = [
  {
    title: "Bibliothèque d'activités",
    desc: "Des idées prêtes à l'emploi, classées et faciles à retrouver.",
    icon: "book",
    color: "bg-[#EAF3FF]",
  },
  {
    title: "Création d'activités",
    desc: "Ajoutez vos consignes, photos et adaptez vos contenus.",
    icon: "edit",
    color: "bg-[#FFE7ED]",
  },
  {
    title: "Planification",
    desc: "Organisez vos semaines avec un calendrier clair.",
    icon: "calendar",
    color: "bg-[#EAF7DF]",
  },
  {
    title: "Souvenirs",
    desc: "Gardez une trace des moments importants.",
    icon: "camera",
    color: "bg-[#FFF3D9]",
  },
]

const reliableFeatures = [
  {
    title: "Données protégées",
    desc: "Vos informations sont sécurisées et confidentielles.",
    icon: "shield",
  },
  {
    title: "Interface simple",
    desc: "Une plateforme intuitive et facile à utiliser.",
    icon: "check",
  },
  {
    title: "Accès rapide",
    desc: "Retrouvez rapidement vos contenus et activités.",
    icon: "bolt",
  },
  {
    title: "Expérience fluide",
    desc: "Une navigation agréable sur tous les appareils.",
    icon: "heart",
  },
]

function FeatureIcon({
  kind,
}: {
  kind: "book" | "edit" | "calendar" | "camera"
}) {
  const base = "h-5 w-5 text-[#273068]"

  if (kind === "book") {
    return (
      <svg viewBox="0 0 24 24" className={base} fill="none">
        <path
          d="M5 6.5A2.5 2.5 0 017.5 4H19v15H7.5A2.5 2.5 0 005 21V6.5z"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="M8 8h8M8 12h8"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    )
  }

  if (kind === "edit") {
    return (
      <svg viewBox="0 0 24 24" className={base} fill="none">
        <path
          d="M4 20l4.5-1 9.2-9.2a2 2 0 00-2.8-2.8L5.7 16.2 4 20z"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="M13.5 7.5l3 3"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    )
  }

  if (kind === "calendar") {
    return (
      <svg viewBox="0 0 24 24" className={base} fill="none">
        <rect
          x="4"
          y="5"
          width="16"
          height="15"
          rx="2.5"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="M4 9h16M8 3v4M16 3v4"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" className={base} fill="none">
      <rect
        x="4"
        y="7"
        width="16"
        height="12"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle
        cx="12"
        cy="13"
        r="3.2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M8 7l1.5-2h5L16 7"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  )
}

function ReliableIcon({ kind }: { kind: "shield" | "check" | "bolt" | "heart" }) {
  const base = "h-6 w-6 text-[#273068]"

  if (kind === "shield") {
    return (
      <svg viewBox="0 0 24 24" className={base} fill="none">
        <path d="M12 3l7 3v5c0 4.7-2.9 8.8-7 10-4.1-1.2-7-5.3-7-10V6l7-3z" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    )
  }

  if (kind === "check") {
    return (
      <svg viewBox="0 0 24 24" className={base} fill="none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
        <path d="M8 12.5l2.5 2.5L16 9.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    )
  }

  if (kind === "bolt") {
    return (
      <svg viewBox="0 0 24 24" className={base} fill="none">
        <path d="M13 2L5 13h6l-1 9 8-11h-6l1-9z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" className={base} fill="none">
      <path d="M12 20s-7-4.5-7-9.3A4.3 4.3 0 019.3 6c1.2 0 2.2.6 2.7 1.4.5-.8 1.5-1.4 2.7-1.4A4.3 4.3 0 0119 10.7C19 15.5 12 20 12 20z" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  )
}

export default function FonctionnalitesPage() {
  return (
    <div className="min-h-screen bg-[#FFF9F5] text-[#273068]">
      {/* HERO */}
      <section className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-16 lg:grid-cols-2">
        <div>
          <p className="mb-3 text-sm font-bold uppercase tracking-[3px] text-[#E94E6F]">
            Fonctionnalités
          </p>

          <h1 className="max-w-2xl text-4xl font-extrabold leading-tight md:text-6xl">
            Tout pour organiser, créer et garder les{" "}
            <span className="text-[#E94E6F]">souvenirs</span> des enfants
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-[#4F5F45]">
            Kidelya réunit tout ce dont vous avez besoin pour simplifier votre
            quotidien et partager de beaux moments en famille ou en groupe.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/register"
              className="rounded-[12px] bg-[#E94E6F] px-7 py-4 text-sm font-semibold text-white shadow-md transition hover:bg-[#d63f5f]"
            >
              Commencer gratuitement
            </Link>

            <Link
              to="/abonnements"
              className="rounded-[12px] border border-[#273068] bg-white px-7 py-4 text-sm font-semibold text-[#273068] hover:bg-[#f6f6f6]"
            >
              Voir les abonnements
            </Link>
          </div>
        </div>

       
         <div className="relative">
  <div className="overflow-hidden rounded-[28px] border border-[#F1D9B5] bg-transparent p-0 shadow-none">
    <img
      src={heroFonctionnalites}
      alt="Illustration fonctionnalités"
      className="h-full w-full rounded-[20px] object-cover"
    />
  </div>
</div>
   
      </section>

      {/* TOP FEATURES */}
      <section className="mx-auto max-w-7xl px-6 pb-14">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featureCards.map((item) => (
            <article
              key={item.title}
              className="flex items-start gap-4 rounded-[18px] border border-[#F3E8D5] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div
                className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${item.color}`}
              >
                <FeatureIcon
                  kind={
                    item.icon as "book" | "edit" | "calendar" | "camera"
                  }
                />
              </div>

              <div>
                <h2 className="text-[15px] font-extrabold text-[#273068]">
                  {item.title}
                </h2>

                <p className="mt-2 text-[13px] leading-6 text-[#4F5F45]">
                  {item.desc}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* SECTION 01 + 02 */}
      <section className="mx-auto max-w-7xl px-6 pb-8">
        <div className="rounded-[20px] border border-[#F3E8D5] bg-white p-8 shadow-sm">
          {/* SECTION 01 */}
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className="overflow-hidden rounded-[24px] bg-[#FFF4F7] p-4">
              <img src={heroFonctionnalites} alt="" className="rounded-[18px]" />
            </div>

            <div>
              <span className="rounded-full bg-[#FFE1EA] px-3 py-1 text-xs font-bold text-[#E94E6F]">
                01
              </span>

              <h2 className="mt-5 text-3xl font-extrabold leading-tight">
                Une bibliothèque riche et inspirante
              </h2>

              <p className="mt-5 text-[15px] leading-7 text-[#4F5F45]">
                Trouvez rapidement des activités adaptées à chaque âge et chaque envie.
              </p>

              <ul className="mt-6 space-y-3 text-[14px] text-[#4F5F45]">
                <li>✓ Recherche par âge</li>
                <li>✓ Recherche par thème</li>
                <li>✓ Catégories variées</li>
                <li>✓ Activités prêtes à l’emploi</li>
              </ul>
            </div>
          </div>

          <div className="my-12 h-[1px] bg-[#F3E8D5]" />

          {/* SECTION 02 */}
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <span className="rounded-full bg-[#FFE1EA] px-3 py-1 text-xs font-bold text-[#E94E6F]">
                02
              </span>

              <h2 className="mt-5 text-3xl font-extrabold leading-tight">
                Créez vos propres activités
              </h2>

              <p className="mt-5 text-[15px] leading-7 text-[#4F5F45]">
                Ajoutez facilement vos idées et personnalisez vos activités.
              </p>

              <ul className="mt-6 space-y-3 text-[14px] text-[#4F5F45]">
                <li>✓ Ajouter un titre et une description</li>
                <li>✓ Ajouter des photos</li>
                <li>✓ Choisir une catégorie</li>
                <li>✓ Modifier à tout moment</li>
              </ul>
            </div>

            <div className="rounded-[24px] bg-[#FFF5F8] p-8">
              <div className="rounded-[24px] bg-white p-6 shadow-lg">
                <div className="h-44 rounded-2xl bg-[#FFE1EA]" />

                <div className="mt-5 space-y-3">
                  <div className="h-3 rounded-full bg-[#EFEFEF]" />
                  <div className="h-3 w-2/3 rounded-full bg-[#EFEFEF]" />
                </div>

                <button className="mt-6 rounded-xl bg-[#E94E6F] px-5 py-3 text-sm font-semibold text-white">
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 03 + 04 */}
      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="rounded-[20px] border border-[#F3E8D5] bg-white p-8 shadow-sm">
          {/* SECTION 03 */}
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <span className="rounded-full bg-[#E8F7D9] px-3 py-1 text-xs font-bold text-[#67A63B]">
                03
              </span>

              <h2 className="mt-5 text-3xl font-extrabold">
                Planifiez en toute simplicité
              </h2>

              <p className="mt-5 text-[15px] leading-7 text-[#4F5F45]">
                Organisez votre semaine grâce au calendrier intégré.
              </p>

              <ul className="mt-6 space-y-3 text-[14px] text-[#4F5F45]">
                <li>✓ Vue jour, semaine ou mois</li>
                <li>✓ Organisez vos activités</li>
                <li>✓ Rappels et notifications</li>
                <li>✓ Visualisation claire et pratique</li>
              </ul>
            </div>

            <div className="rounded-[24px] bg-[#FFF8EC] p-8">
              <div className="rounded-[24px] bg-white p-8 shadow-lg">
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 35 }).map((_, i) => (
                    <div key={i} className="h-8 rounded-lg bg-[#FFE9B8]" />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="my-12 h-[1px] bg-[#F3E8D5]" />

          {/* SECTION 04 */}
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className="rounded-[24px] bg-[#F8F4FF] p-8">
              <div className="space-y-4 rounded-[24px] bg-white p-6 shadow-lg">
                <div className="h-10 rounded-xl bg-[#F4F4F4]" />
                <div className="h-10 rounded-xl bg-[#F4F4F4]" />
                <div className="h-10 rounded-xl bg-[#F4F4F4]" />

                <button className="w-full rounded-xl bg-[#273068] py-3 font-semibold text-white">
                  Rechercher
                </button>
              </div>
            </div>

            <div>
              <span className="rounded-full bg-[#EAF3FF] px-3 py-1 text-xs font-bold text-[#273068]">
                04
              </span>

              <h2 className="mt-5 text-3xl font-extrabold">
                Trouvez rapidement ce dont vous avez besoin
              </h2>

              <p className="mt-5 text-[15px] leading-7 text-[#4F5F45]">
                Des outils de recherche performants pour gagner du temps.
              </p>

              <ul className="mt-6 space-y-3 text-[14px] text-[#4F5F45]">
                <li>✓ Recherche par mot-clé</li>
                <li>✓ Filtre par âge</li>
                <li>✓ Filtre par catégorie</li>
                <li>✓ Filtre par date</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 05 06 07 */}
      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {/* 05 */}
          <article className="rounded-[20px] border border-[#F3E8D5] bg-white p-8 shadow-sm">
            <span className="rounded-full bg-[#FFE1EA] px-3 py-1 text-xs font-bold text-[#E94E6F]">
              05
            </span>

            <h3 className="mt-5 text-[22px] font-extrabold text-[#273068]">
              Des packs adaptés à toutes les envies
            </h3>

            <p className="mt-4 text-[14px] leading-7 text-[#4F5F45]">
              Des activités variées pour toutes les saisons et tous les thèmes.
            </p>

            <ul className="mt-5 space-y-3 text-[13px] text-[#4F5F45]">
              <li>✓ Activités thématiques</li>
              <li>✓ Packs variés</li>
              <li>✓ Contenus adaptés</li>
            </ul>

            <Link
              to="/packs"
              className="mt-7 inline-flex rounded-[12px] bg-[#E94E6F] px-5 py-3 text-sm font-semibold text-white"
            >
              Voir les packs
            </Link>
          </article>

          {/* 06 */}
          <article className="rounded-[20px] border border-[#F3E8D5] bg-white p-8 shadow-sm">
            <span className="rounded-full bg-[#EAF3FF] px-3 py-1 text-xs font-bold text-[#273068]">
              06
            </span>

            <h3 className="mt-5 text-[22px] font-extrabold text-[#273068]">
              Une solution adaptée à vos besoins
            </h3>

            <p className="mt-4 text-[14px] leading-7 text-[#4F5F45]">
              Choisissez entre achat à l'unité et accès illimité.
            </p>

            <ul className="mt-5 space-y-3 text-[13px] text-[#4F5F45]">
              <li>✓ Flexible</li>
              <li>✓ Simple à utiliser</li>
              <li>✓ Accessible partout</li>
            </ul>

            <Link
              to="/abonnements"
              className="mt-7 inline-flex rounded-[12px] bg-[#273068] px-5 py-3 text-sm font-semibold text-white"
            >
              Découvrir les formules
            </Link>
          </article>

          {/* 07 */}
          <article className="rounded-[20px] border border-[#F3E8D5] bg-white p-8 shadow-sm">
            <span className="rounded-full bg-[#E8F7D9] px-3 py-1 text-xs font-bold text-[#67A63B]">
              07
            </span>

            <h3 className="mt-5 text-[22px] font-extrabold text-[#273068]">
              Une plateforme pensée pour tous
            </h3>

            <p className="mt-4 text-[14px] leading-7 text-[#4F5F45]">
              Une expérience claire, lisible et adaptée à tous.
            </p>

            <ul className="mt-5 space-y-3 text-[13px] text-[#4F5F45]">
              <li>✓ Navigation intuitive</li>
              <li>✓ Interface moderne</li>
              <li>✓ Utilisation fluide</li>
            </ul>

            <Link
              to="/register"
              className="mt-7 inline-flex rounded-[12px] bg-[#67A63B] px-5 py-3 text-sm font-semibold text-white"
            >
              Créer un compte
            </Link>
          </article>
        </div>
      </section>

      {/* SECTION 08 */}
      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="rounded-[20px] border border-[#F3E8D5] bg-white p-8">
          <div className="mb-10">
            <span className="rounded-full bg-[#EAF3FF] px-3 py-1 text-xs font-bold text-[#273068]">
              08
            </span>

            <h2 className="mt-5 text-3xl font-extrabold text-[#273068]">
              Un service fiable et sécurisé
            </h2>

            <p className="mt-4 text-[#4F5F45]">
              Vos données sont protégées et votre expérience reste notre priorité.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {reliableFeatures.map((item) => (
              <div
                key={item.title}
                className="rounded-[16px] border border-[#F1D9B5] bg-[#FFFDF9] p-6 text-center"
              >
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#EFE7FF]">
                  <ReliableIcon kind={item.icon as "shield" | "check" | "bolt" | "heart"} />
                </div>

                <h3 className="font-bold text-[#273068]">{item.title}</h3>

                <p className="mt-3 text-sm leading-6 text-[#4F5F45]">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="rounded-[20px] border border-[#F1D9B5] bg-white px-8 py-10 shadow-sm md:flex md:items-center md:justify-between">
          <div>
            <h3 className="text-3xl font-extrabold text-[#273068]">
              Prêt à découvrir Kidelya ?
            </h3>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#4F5F45]">
              Explorez les packs, testez les activités et choisissez la formule
              qui correspond à votre organisation.
            </p>
          </div>

          <Link
            to="/packs"
            className="mt-6 inline-flex rounded-[12px] bg-[#E94E6F] px-6 py-4 text-sm font-bold text-white md:mt-0"
          >
            Explorer les activités
          </Link>
        </div>
      </section>

      <NavFooter />
    </div>
  )
}