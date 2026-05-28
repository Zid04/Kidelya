import { Link } from "react-router-dom"
import NavFooter from "@/components/NavFooter"

const values = [
  {
    title: "Bienveillance",
    desc: "Une plateforme pensée pour accompagner, encourager et valoriser.",
    icon: "heart",
  },
  {
    title: "Créativité",
    desc: "Des activités variées, inspirantes et adaptées à chaque enfant.",
    icon: "spark",
  },
  {
    title: "Confiance",
    desc: "Vos données sont protégées et votre expérience est notre priorité.",
    icon: "shield",
  },
]

const audience = [
  "Parents et familles",
  "Éducateurs et enseignants",
  "Animateurs et centres de loisirs",
  "Structures scolaires et périscolaires",
  "Professionnels de la petite enfance",
]

const strengths = [
  "Une plateforme simple et intuitive",
  "Une bibliothèque riche et organisée",
  "Des packs thématiques adaptés",
  "Un calendrier pour planifier facilement",
  "Un espace souvenirs pour garder les moments importants",
]

const reliability = [
  {
    title: "Données protégées",
    desc: "Vos informations sont sécurisées et confidentielles.",
    icon: "shield",
  },
  {
    title: "Interface simple",
    desc: "Un design clair pour une prise en main facile.",
    icon: "check",
  },
  {
    title: "Accès rapide",
    desc: "Accédez à vos activités partout, à tout moment.",
    icon: "bolt",
  },
  {
    title: "Expérience fluide",
    desc: "Une plateforme rapide, fiable et agréable.",
    icon: "spark",
  },
]

function Icon({ kind }: { kind: "heart" | "spark" | "shield" | "check" | "bolt" }) {
  const base = "h-5 w-5 text-[#273068]"
  if (kind === "heart") {
    return (
      <svg viewBox="0 0 24 24" className={base} fill="none">
        <path d="M12 20s-7-4.5-7-9.3A4.3 4.3 0 019.3 6c1.2 0 2.2.6 2.7 1.4.5-.8 1.5-1.4 2.7-1.4A4.3 4.3 0 0119 10.7C19 15.5 12 20 12 20z" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    )
  }
  if (kind === "spark") {
    return (
      <svg viewBox="0 0 24 24" className={base} fill="none">
        <path d="M12 3l1.8 4.5L18 9.3l-4.2 1.7L12 15.5 10.2 11 6 9.3l4.2-1.8L12 3z" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    )
  }
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
  return (
    <svg viewBox="0 0 24 24" className={base} fill="none">
      <path d="M13 2L5 13h6l-1 9 8-11h-6l1-9z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  )
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FFF9F0] text-[#273068]">
      <section className="mx-auto max-w-6xl px-6 pb-10 pt-14 text-center">
        <h1 className="text-4xl font-extrabold md:text-5xl">À propos de Kidelya</h1>
        <div className="mx-auto mt-3 h-[3px] w-12 rounded-full bg-[#E94E6F]" />
        <p className="mx-auto mt-5 max-w-3xl text-[15px] leading-7 text-[#4F5F45]">
          Kidelya est née d’une idée simple : offrir aux familles, aux professionnels et aux passionnés
          un espace unique pour créer, organiser et partager des activités qui font grandir les enfants.
        </p>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-6 pb-10 lg:grid-cols-2">
        <article className="rounded-[16px] border border-[#F1D9B5] bg-white p-6">
          <h2 className="text-2xl font-bold">Notre mission</h2>
          <p className="mt-3 text-[14px] leading-7 text-[#4F5F45]">
            Nous voulons rendre l’organisation d’activités plus simple, plus inspirante et plus accessible.
            Kidelya accompagne les parents, éducateurs, animateurs et professionnels avec des outils intuitifs
            et des contenus adaptés à chaque âge.
          </p>
        </article>

        <article className="rounded-[16px] border border-[#F1D9B5] bg-white p-6">
          <h3 className="text-lg font-bold">Ce que nous défendons</h3>
          <ul className="mt-4 space-y-3 text-sm text-[#4F5F45]">
            <li className="flex items-center gap-2"><Icon kind="heart" /> Le développement et l’épanouissement des enfants</li>
            <li className="flex items-center gap-2"><Icon kind="spark" /> La créativité et la découverte</li>
            <li className="flex items-center gap-2"><Icon kind="check" /> Le partage entre familles et professionnels</li>
            <li className="flex items-center gap-2"><Icon kind="shield" /> La sécurité et la confidentialité des données</li>
          </ul>
        </article>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-10 text-center">
        <h2 className="text-2xl font-bold">Notre histoire</h2>
        <p className="mx-auto mt-4 max-w-3xl text-[14px] leading-7 text-[#4F5F45]">
          Kidelya a été imaginée pour répondre à un besoin réel : trouver facilement des activités adaptées,
          les organiser sans stress et garder une trace des moments importants. Ce projet a grandi avec l’envie
          de proposer une plateforme moderne, intuitive et pensée pour les familles comme pour les professionnels.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-10">
        <div className="grid gap-5 md:grid-cols-3">
          {values.map((v) => (
            <article key={v.title} className="rounded-[16px] border border-[#F1D9B5] bg-white p-6 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#FFE7ED]">
                <Icon kind={v.icon as "heart" | "spark" | "shield"} />
              </div>
              <h3 className="font-bold">{v.title}</h3>
              <p className="mt-2 text-sm text-[#4F5F45]">{v.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-6 pb-12 lg:grid-cols-2">
        <article className="rounded-[16px] border border-[#F1D9B5] bg-white p-6">
          <h2 className="text-2xl font-bold">Pour qui est faite Kidelya ?</h2>
          <p className="mt-3 text-sm text-[#4F5F45]">
            Kidelya s’adresse à toutes les personnes qui souhaitent proposer des activités enrichissantes aux enfants :
          </p>
          <ul className="mt-4 space-y-2 text-sm text-[#4F5F45]">
            {audience.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <Icon kind="check" />
                {item}
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-[16px] border border-[#F1D9B5] bg-white p-6">
          <h3 className="text-lg font-bold">Pourquoi choisir Kidelya ?</h3>
          <ul className="mt-4 space-y-2 text-sm text-[#4F5F45]">
            {strengths.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <Icon kind="spark" />
                {item}
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-14">
        <h2 className="text-center text-2xl font-bold">Un service fiable et sécurisé</h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-sm text-[#4F5F45]">
          Vos données sont protégées et votre expérience est au cœur de nos priorités.
        </p>

        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {reliability.map((b) => (
            <article key={b.title} className="rounded-[16px] border border-[#F1D9B5] bg-white p-6 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#EFE7FF]">
                <Icon kind={b.icon as "shield" | "check" | "bolt" | "spark"} />
              </div>
              <h4 className="font-bold">{b.title}</h4>
              <p className="mt-2 text-xs text-[#4F5F45]">{b.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16 text-center">
        <h2 className="text-2xl font-bold">Rejoignez l’aventure Kidelya</h2>
        <p className="mt-3 text-[#4F5F45]">
          Découvrez une nouvelle façon de créer, organiser et partager des activités enrichissantes.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <Link
            to="/packs"
            className="rounded-[10px] bg-[#E94E6F] px-6 py-3 text-sm font-semibold text-white hover:bg-[#d63f5f]"
          >
            Explorer les activités
          </Link>
          <Link
            to="/abonnements"
            className="rounded-[10px] border border-[#E94E6F]/40 bg-white px-6 py-3 text-sm font-semibold text-[#E94E6F] hover:bg-[#FFF5F7]"
          >
            Voir les abonnements
          </Link>
        </div>
      </section>

      <NavFooter />
    </div>
  )
}