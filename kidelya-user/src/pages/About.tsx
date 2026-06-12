import React from "react"
import { Link } from "react-router-dom"

const values = [
  {
    title: "Bienveillance",
    desc: "Une plateforme pensée pour accompagner, encourager et valoriser chaque enfant.",
    icon: "heart",
    color: "bg-[#FFE7ED]",
    accent: "#E94E6F",
  },
  {
    title: "Créativité",
    desc: "Des activités variées, inspirantes et adaptées à chaque moment de vie.",
    icon: "spark",
    color: "bg-[#FFF3D9]",
    accent: "#F5A623",
  },
  {
    title: "Confiance",
    desc: "Vos données sont protégées et votre expérience est notre priorité absolue.",
    icon: "shield",
    color: "bg-[#EAF3FF]",
    accent: "#273068",
  },
]

const audience = [
  { label: "Parents et familles", icon: "family" },
  { label: "Éducateurs et enseignants", icon: "book" },
  { label: "Animateurs et centres de loisirs", icon: "star" },
  { label: "Structures scolaires et périscolaires", icon: "building" },
  { label: "Professionnels de la petite enfance", icon: "heart" },
]

const strengths = [
  { label: "Une plateforme simple et intuitive", num: "01" },
  { label: "Une bibliothèque riche et organisée", num: "02" },
  { label: "Des packs thématiques adaptés", num: "03" },
  { label: "Un calendrier pour planifier facilement", num: "04" },
  { label: "Un espace souvenirs pour garder les moments importants", num: "05" },
]

const stats = [
  { value: "500+", label: "Activités disponibles" },
  { value: "10K+", label: "Familles accompagnées" },
  { value: "50+", label: "Packs thématiques" },
  { value: "4.9★", label: "Note moyenne" },
]

// ─── Icônes ───────────────────────────────────────────────────

function Icon({ kind, className = "h-5 w-5 text-[#273068]", style }: { kind: string; className?: string; style?: React.CSSProperties }) {
  if (kind === "heart") return (
    <svg viewBox="0 0 24 24" className={className} style={style} fill="none">
      <path d="M12 20s-7-4.5-7-9.3A4.3 4.3 0 019.3 6c1.2 0 2.2.6 2.7 1.4.5-.8 1.5-1.4 2.7-1.4A4.3 4.3 0 0119 10.7C19 15.5 12 20 12 20z" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  )
  if (kind === "spark") return (
    <svg viewBox="0 0 24 24" className={className} style={style} fill="none">
      <path d="M12 3l1.8 4.5L18 9.3l-4.2 1.7L12 15.5 10.2 11 6 9.3l4.2-1.8L12 3z" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
  if (kind === "shield") return (
    <svg viewBox="0 0 24 24" className={className} style={style} fill="none">
      <path d="M12 3L4 6.5V11C4 15.4 7.4 19.5 12 21 16.6 19.5 20 15.4 20 11V6.5L12 3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  )
  if (kind === "check") return (
    <svg viewBox="0 0 24 24" className={className} style={style} fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 12.5l2.5 2.5L16 9.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
  if (kind === "bolt") return (
    <svg viewBox="0 0 24 24" className={className} style={style} fill="none">
      <path d="M13 2L5 13h6l-1 9 8-11h-6l1-9z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  )
  if (kind === "book") return (
    <svg viewBox="0 0 24 24" className={className} style={style} fill="none">
      <path d="M5 6.5A2.5 2.5 0 017.5 4H19v15H7.5A2.5 2.5 0 005 21V6.5z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 8h8M8 12h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
  if (kind === "star") return (
    <svg viewBox="0 0 24 24" className={className} style={style} fill="none">
      <path d="M12 3l2.1 5.5 5.9.8-4.3 4.1 1 5.8L12 16.5l-4.7 2.7 1-5.8L4 9.3l5.9-.8L12 3z" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  )
  if (kind === "building") return (
    <svg viewBox="0 0 24 24" className={className} style={style} fill="none">
      <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
  if (kind === "family") return (
    <svg viewBox="0 0 24 24" className={className} style={style} fill="none">
      <circle cx="8" cy="6" r="2.5" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="16" cy="6" r="2.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M3 20c0-3.3 2.2-5.5 5-5.5s5 2.2 5 5.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M13 20c0-2.8 1.8-4.5 4-4.5s4 1.7 4 4.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
  return null
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-[#273068]">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden">
        {/* Décoration fond */}
        <div className="absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full bg-[#E94E6F]/5 blur-3xl" />
        <div className="absolute -left-20 top-20 h-[300px] w-[300px] rounded-full bg-[#273068]/5 blur-2xl" />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 pb-10 sm:pb-14 pt-10 sm:pt-16 text-center">
          <span className="mb-4 inline-block rounded-full bg-[#FFE7ED] px-4 py-1.5 text-xs font-bold uppercase tracking-[3px] text-[#E94E6F]">
            Notre histoire
          </span>
          <h1 className="mx-auto max-w-3xl text-3xl sm:text-4xl md:text-6xl font-extrabold leading-tight">
            À propos de{" "}
            <span className="relative inline-block text-[#E94E6F]">
              Kidelya
              <svg viewBox="0 0 200 12" className="absolute -bottom-1 left-0 w-full" fill="none">
                <path d="M2 8 Q50 2 100 8 Q150 14 198 6" stroke="#E94E6F" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.4" />
              </svg>
            </span>
          </h1>
          <p className="mx-auto mt-4 sm:mt-6 max-w-2xl text-sm sm:text-[15px] leading-6 sm:leading-7 text-[#273068]">
            Kidelya est née d'une idée simple : offrir aux familles, aux professionnels et aux passionnés
            un espace unique pour créer, organiser et partager des activités qui font grandir les enfants.
          </p>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-12">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-[16px] bg-[#FFFEFA] p-3 sm:p-5 text-center shadow-sm">
              <p className="text-2xl sm:text-3xl font-extrabold text-[#E94E6F]">{s.value}</p>
              <p className="mt-1 text-xs text-[#273068]">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── MISSION + VALEURS ── */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-12">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">

          {/* Mission */}
          <article className="relative overflow-hidden rounded-[20px] bg-[#FFFEFA] p-5 sm:p-6 md:p-8 shadow-sm">
            <div className="absolute right-0 top-0 h-32 w-32 rounded-bl-full bg-[#FFF3D9]/60" />
            <span className="mb-4 inline-block rounded-full bg-[#EAF3FF] px-3 py-1 text-xs font-bold text-[#273068]">
              Notre mission
            </span>
            <h2 className="mt-1 text-xl sm:text-2xl font-bold">Rendre le quotidien plus simple et plus beau</h2>
            <p className="mt-4 text-[14px] leading-7 text-[#273068]">
              Nous voulons rendre l'organisation d'activités plus simple, plus inspirante et plus accessible.
              Kidelya accompagne les parents, éducateurs, animateurs et professionnels avec des outils intuitifs
              et des contenus adaptés à chaque âge.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {["Accessible", "Inspirant", "Bienveillant"].map((tag) => (
                <span key={tag} className="rounded-full bg-[#D5CDE2] px-3 py-1 text-xs font-semibold text-[#273068]">
                  {tag}
                </span>
              ))}
            </div>
          </article>

          {/* Ce que nous défendons */}
          <article className="rounded-[20px] bg-[#FFFEFA] p-5 sm:p-6 md:p-8 shadow-sm">
            <span className="mb-4 inline-block rounded-full bg-[#FFE7ED] px-3 py-1 text-xs font-bold text-[#E94E6F]">
              Nos engagements
            </span>
            <h3 className="mt-1 text-base sm:text-lg font-bold">Ce que nous défendons</h3>
            <ul className="mt-5 space-y-4">
              {[
                { icon: "heart", text: "Le développement et l'épanouissement des enfants", color: "bg-[#FFE7ED]" },
                { icon: "spark", text: "La créativité et la découverte", color: "bg-[#FFF3D9]" },
                { icon: "check", text: "Le partage entre familles et professionnels", color: "bg-[#EAF7DF]" },
                { icon: "shield", text: "La sécurité et la confidentialité des données", color: "bg-[#EAF3FF]" },
              ].map((item) => (
                <li key={item.text} className="flex items-start gap-3">
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${item.color}`}>
                    <Icon kind={item.icon} className="h-4 w-4 text-[#273068]" />
                  </span>
                  <span className="pt-1 text-sm text-[#273068]">{item.text}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      {/* ── HISTOIRE ── */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-12">
        <div className="relative overflow-hidden rounded-[20px] bg-[#273068] px-5 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10 text-white shadow-lg">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/5" />
          <div className="absolute -bottom-10 left-10 h-40 w-40 rounded-full bg-[#E94E6F]/20" />
          <div className="relative z-10 lg:max-w-2xl">
            <span className="mb-4 inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[2px] text-white/80">
              Notre histoire
            </span>
            <h2 className="mt-2 text-xl sm:text-2xl md:text-3xl font-bold">
              Un projet né d'un besoin réel
            </h2>
            <p className="mt-4 text-[14px] leading-7 text-white/80">
              Kidelya a été imaginée pour répondre à un besoin concret : trouver facilement des activités adaptées,
              les organiser sans stress et garder une trace des moments importants. Ce projet a grandi avec l'envie
              de proposer une plateforme moderne, intuitive et pensée pour les familles comme pour les professionnels.
            </p>
          </div>
        </div>
      </section>

      {/* ── VALEURS ── */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-12">
        <div className="mb-6 sm:mb-8 text-center">
          <span className="rounded-full bg-[#EAF7DF] px-4 py-1.5 text-xs font-bold uppercase tracking-[2px] text-[#67A63B]">
            Ce qui nous anime
          </span>
          <h2 className="mt-3 text-xl sm:text-2xl font-bold">Nos valeurs fondamentales</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {values.map((v, i) => (
            <article
              key={v.title}
              className="group relative overflow-hidden rounded-[20px] bg-[#FFFEFA] p-5 sm:p-6 md:p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="absolute right-4 top-4 text-5xl font-black opacity-5 select-none" style={{ color: v.accent }}>
                0{i + 1}
              </div>
              <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${v.color}`}>
                <Icon kind={v.icon} className="h-5 w-5" style={{ color: v.accent }} />
              </div>
              <h3 className="text-base sm:text-lg font-bold">{v.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#273068]">{v.desc}</p>
              <div className="mt-4 h-[2px] w-8 rounded-full transition-all group-hover:w-16" style={{ backgroundColor: v.accent }} />
            </article>
          ))}
        </div>
      </section>

      {/* ── AUDIENCE + ATOUTS ── */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-12">
        <div className="grid gap-6 lg:grid-cols-2">

          {/* Pour qui */}
          <article className="rounded-[20px] bg-[#FFFEFA] p-5 sm:p-6 md:p-8 shadow-sm">
            <span className="mb-4 inline-block rounded-full bg-[#FFF3D9] px-3 py-1 text-xs font-bold text-[#F5A623]">
              Notre public
            </span>
            <h2 className="mt-1 text-lg sm:text-xl font-bold">Pour qui est faite Kidelya ?</h2>
            <p className="mt-3 text-sm text-[#273068]">
              Kidelya s'adresse à toutes les personnes qui souhaitent proposer des activités enrichissantes aux enfants.
            </p>
            <ul className="mt-5 space-y-3">
              {audience.map((item) => (
                <li key={item.label} className="flex items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FFF3D9]">
                    <Icon kind={item.icon} className="h-4 w-4 text-[#F5A623]" />
                  </span>
                  <span className="text-sm text-[#273068]">{item.label}</span>
                </li>
              ))}
            </ul>
          </article>

          {/* Pourquoi Kidelya */}
          <article className="rounded-[20px] bg-[#FFFEFA] p-5 sm:p-6 md:p-8 shadow-sm">
            <span className="mb-4 inline-block rounded-full bg-[#EAF3FF] px-3 py-1 text-xs font-bold text-[#273068]">
              Nos atouts
            </span>
            <h3 className="mt-1 text-lg sm:text-xl font-bold">Pourquoi choisir Kidelya ?</h3>
            <ul className="mt-5 space-y-4">
              {strengths.map((item) => (
                <li key={item.label} className="flex items-center gap-4">
                  <span className="shrink-0 text-xs font-black text-[#E94E6F]/40">{item.num}</span>
                  <div className="h-px flex-1 bg-[#D5CDE2]" />
                  <span className="text-sm text-[#273068]">{item.label}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-16">
        <div className="relative overflow-hidden rounded-[20px] bg-[#FFFEFA] px-5 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10 shadow-sm">
          <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-[#E94E6F]/5" />
          <div className="absolute -left-10 bottom-0 h-32 w-32 rounded-full bg-[#273068]/5" />
          <div className="relative z-10 text-center">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">Rejoignez l'aventure Kidelya</h2>
            <p className="mx-auto mt-3 max-w-xl text-[14px] leading-7 text-[#273068]">
              Découvrez une nouvelle façon de créer, organiser et partager des activités enrichissantes pour les enfants.
            </p>
            <div className="mt-6 sm:mt-8 flex flex-wrap justify-center gap-4">
              <Link
                to="/packs"
                className="rounded-[12px] bg-[#E94E6F] px-5 sm:px-7 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#d63f5f] hover:shadow-lg"
              >
                Explorer les activités
              </Link>
              <Link
                to="/register"
                className="rounded-[12px] border border-[#273068] bg-transparent px-5 sm:px-7 py-3 text-sm font-semibold text-[#273068] transition hover:bg-[#273068] hover:text-white"
              >
                Commencer maintenant
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}