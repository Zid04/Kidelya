import etape1 from "@/assets/etape1.png"
import etape2 from "@/assets/etape2.png"
import etape3 from "@/assets/etape3.png"
import etape4 from "@/assets/etape4.png"
import etape5 from "@/assets/etape5.png"
import fleche from "@/assets/fleche.png"

const stepImages = [etape1, etape2, etape3, etape4, etape5]

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

  const circleSize = 120

  return (
    <section className="relative overflow-hidden bg-transparent py-20">
      <div className="mx-auto max-w-7xl px-6 text-center">

        <h2 className="mb-2 text-3xl font-bold text-[#273068]">
          Comment ça marche ?
        </h2>
        <div className="mx-auto mb-14 h-0.5 w-10 bg-[#E94E6F]" />

        <div className="relative grid gap-10 md:grid-cols-5 md:gap-4">
          {steps.map((step, index) => (
            <div key={step.title} className="relative flex flex-col items-center">

              {/* Flèche image centrée entre les cercles */}
              {index < steps.length - 1 && (
                <div
                  className="pointer-events-none absolute hidden -translate-y-1/2 items-center justify-center md:flex"
                  style={{
                    left: `calc(50% + ${circleSize / 2 + 4}px)`,
                    top: circleSize / 2,
                    width: `calc(100% - ${circleSize / 2 + 8}px)`,
                  }}
                >
                  <img
                    src={fleche}
                    alt=""
                    aria-hidden="true"
                    className="w-8 object-contain"
                  />
                </div>
              )}

              {/* Cercle image */}
              <div
                className="relative mb-5 shrink-0"
                style={{ width: circleSize, height: circleSize }}
              >
                <span className="absolute left-0 top-0 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-[#E94E6F] text-xs font-bold text-white shadow">
                  {index + 1}
                </span>
                <img
                  src={stepImages[index]}
                  alt={step.title}
                  className="h-full w-full rounded-full object-cover shadow-md"
                />
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