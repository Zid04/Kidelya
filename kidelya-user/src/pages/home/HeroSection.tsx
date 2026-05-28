import { Link } from "react-router-dom"
import { Button } from "@/components/ui/Button"

const trustItems = [
  {
    title: "Sécurité & Confidentialité",
    description: "Données protégées",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="h-7 w-7">
        <path
          d="M24 6L38 12V23C38 32 32.2 39.5 24 43C15.8 39.5 10 32 10 23V12L24 6Z"
          stroke="#273068"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path
          d="M18 24L22 28L31 18"
          stroke="#273068"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Simple & Rapide",
    description: "Prise en main facile",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="h-7 w-7">
        <circle cx="24" cy="24" r="16" stroke="#273068" strokeWidth="2.5" />
        <path
          d="M17 24L22 29L32 18"
          stroke="#273068"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Pensé pour vous",
    description: "Parents & pros",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="h-7 w-7">
        <path
          d="M24 41C24 41 9 32 9 19C9 12.5 16.5 9 24 16C31.5 9 39 12.5 39 19C39 32 24 41 24 41Z"
          stroke="#273068"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
]

export default function HeroSection() {
  return (
    <section className="relative bg-transparent">
      <div className="mx-auto max-w-7xl px-6 pb-20 pt-28 md:pb-24 md:pt-36">
        <div className="max-w-[540px]">
          <h1 className="text-[32px] font-black leading-[1.12] text-[#273068] md:text-[44px]">
            Des activités manuelles créatives pour éveiller les enfants au
            quotidien
          </h1>

          <p className="mt-5 max-w-[410px] text-[14px] leading-6 text-[#222222]">
            Kidelya accompagne les assistantes maternelles, crèches et parents
            avec des activités créatives, pédagogiques et prêtes à l’emploi pour
            les enfants de 2 à 10 ans.
          </p>

          <div className="mt-7 flex flex-wrap gap-4">
            <Link to="/register">
              <Button
                variant="primary"
                className="rounded-[9px] px-5 py-3 text-[14px] font-medium"
              >
                Commencer gratuitement
              </Button>
            </Link>

            <Link to="/packs">
              <Button
                variant="outline"
                className="rounded-[9px] px-5 py-3 text-[14px] font-medium"
              >
                Découvrir les packs
              </Button>
            </Link>
          </div>

          <div className="mt-8 flex max-w-[560px] flex-wrap gap-x-8 gap-y-5">
            {trustItems.map((item) => (
              <div key={item.title} className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center">
                  {item.icon}
                </div>

                <div>
                  <p className="max-w-[130px] text-[11px] font-bold leading-4 text-[#273068]">
                    {item.title}
                  </p>
                  <p className="mt-0.5 text-[10px] leading-4 text-[#222222]">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}