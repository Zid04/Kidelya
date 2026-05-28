const stepColors = ["#6F8D4C", "#FDC600", "#E94E6F", "#93197D", "#0094A8"]

const stepIcons = [
  // 1. Créez votre espace — silhouette personne
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-12 w-12">
    <circle cx="24" cy="16" r="8" fill="white" fillOpacity="0.9"/>
    <path d="M8 40c0-8.837 7.163-16 16-16s16 7.163 16 16" fill="white" fillOpacity="0.9"/>
  </svg>,

  // 2. Choisissez votre accès — cadeau / pack
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-12 w-12">
    <rect x="8" y="20" width="32" height="22" rx="3" fill="white" fillOpacity="0.9"/>
    <rect x="6" y="14" width="36" height="8" rx="2" fill="white" fillOpacity="0.7"/>
    <path d="M24 14 C24 14 18 6 14 10 C10 14 18 14 24 14" fill="white" fillOpacity="0.9"/>
    <path d="M24 14 C24 14 30 6 34 10 C38 14 30 14 24 14" fill="white" fillOpacity="0.9"/>
    <line x1="24" y1="14" x2="24" y2="42" stroke="white" strokeOpacity="0.5" strokeWidth="1.5"/>
  </svg>,

  // 3. Explorez les activités — pinceau / palette
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-12 w-12">
    <path d="M12 36 C12 36 10 42 16 42 C20 42 20 38 24 38 C30 38 30 44 36 40 C40 37 38 30 34 28" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" strokeOpacity="0.9"/>
    <path d="M14 34 L34 14 C36 12 39 12 41 14 C43 16 43 19 41 21 L21 41 Z" fill="white" fillOpacity="0.9"/>
    <path d="M30 18 L36 24" stroke="#ffffff80" strokeWidth="1.5"/>
  </svg>,

  // 4. Planifiez vos moments — calendrier
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-12 w-12">
    <rect x="7" y="12" width="34" height="30" rx="4" fill="white" fillOpacity="0.9"/>
    <rect x="7" y="12" width="34" height="11" rx="4" fill="white" fillOpacity="0.5"/>
    <line x1="16" y1="8" x2="16" y2="16" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="32" y1="8" x2="32" y2="16" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
    <rect x="13" y="28" width="5" height="5" rx="1" fill="white" fillOpacity="0.6"/>
    <rect x="22" y="28" width="5" height="5" rx="1" fill="white" fillOpacity="0.6"/>
    <rect x="31" y="28" width="5" height="5" rx="1" fill="white" fillOpacity="0.6"/>
    <rect x="13" y="36" width="5" height="5" rx="1" fill="white" fillOpacity="0.6"/>
    <rect x="22" y="36" width="5" height="5" rx="1" fill="white" fillOpacity="0.6"/>
  </svg>,

  // 5. Gardez vos souvenirs — appareil photo
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-12 w-12">
    <rect x="6" y="16" width="36" height="26" rx="4" fill="white" fillOpacity="0.9"/>
    <path d="M18 16 L20 10 H28 L30 16" fill="white" fillOpacity="0.6"/>
    <circle cx="24" cy="29" r="7" fill="white" fillOpacity="0.4" stroke="white" strokeWidth="2"/>
    <circle cx="24" cy="29" r="3.5" fill="white" fillOpacity="0.8"/>
    <circle cx="35" cy="21" r="2" fill="white" fillOpacity="0.6"/>
  </svg>,
]

export default function CommentCaMarcheSection() {
  const steps = [
    {
      title: "Créez votre espace",
      desc: "Inscrivez-vous gratuitement et personnalisez votre profil.",
    },
    {
      title: "Choisissez votre accès",
      desc: "Sélectionnez un pack thématique ou une formule d'abonnement.",
    },
    {
      title: "Explorez les activités",
      desc: "Retrouvez des idées adaptées à l'âge, au thème et au moment.",
    },
    {
      title: "Planifiez vos moments",
      desc: "Organisez les activités dans votre planning Kidelya.",
    },
    {
      title: "Gardez vos souvenirs",
      desc: "Profitez, partagez et conservez les beaux moments.",
    },
  ]

  return (
    <section className="relative overflow-hidden bg-transparent py-20">
      <div className="mx-auto max-w-7xl px-6 text-center">

        <h2 className="mb-2 text-3xl font-bold text-[#273068]">
          Comment ça marche ?
        </h2>
        <div className="mx-auto mb-14 h-0.5 w-10 bg-[#E94E6F]" />

        <div className="relative grid gap-10 md:grid-cols-5 md:gap-6">
          {steps.map((step, index) => (
            <div key={step.title} className="relative flex flex-col items-center">

              {/* Flèche entre les steps */}
              {index < steps.length - 1 && (
                <div className="pointer-events-none absolute left-[calc(50%+52px)] top-[46px] hidden w-[calc(100%-60px)] items-center justify-center md:flex">
                  <svg viewBox="0 0 60 12" fill="none" className="w-full">
                    <line x1="0" y1="6" x2="52" y2="6" stroke="#D9CBEF" strokeWidth="1.5" />
                    <path d="M48 2L56 6L48 10" stroke="#8F6BC8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}

              {/* Cercle coloré avec icône SVG */}
              <div
                className="relative mb-5 flex h-24 w-24 items-center justify-center rounded-full shadow-md"
                style={{ backgroundColor: stepColors[index] }}
              >
                <span className="absolute left-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-[#E94E6F] text-xs font-bold text-white z-10">
                  {index + 1}
                </span>
                {stepIcons[index]}
              </div>

              <h3 className="mb-2 min-h-[48px] max-w-[180px] text-base font-semibold leading-6 text-[#273068]">
                {step.title}
              </h3>
              <p className="max-w-[190px] text-sm leading-6 text-black">
                {step.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}