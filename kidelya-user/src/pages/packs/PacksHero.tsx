import illuHero from "@/assets/ILLU_PAGE_ACTIVITE.png"
import iconSteam from "@/assets/steam.png"
import iconFilters from "@/assets/filters.png"
import iconAward from "@/assets/award.png"

const BADGES = [
  { title: "Des activités pour tous les âges",  description: "De 2 à 10 ans",       icon: iconSteam },
  { title: "Imprimables et faciles à réaliser", description: "Prêtes à l'emploi",   icon: iconFilters },
  { title: "Activités prêtes à l'emploi",       description: "Toujours du contenu", icon: iconAward },
]

export default function PacksHero() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="absolute right-0 top-0 hidden h-full w-[48%] lg:block">
        <img src={illuHero} alt="Illustration activités" className="h-full w-full object-contain object-right-top"/>
      </div>
      <div className="absolute inset-0 z-0 opacity-100 lg:hidden">
        <img src={illuHero} alt="" aria-hidden="true" className="h-full w-full object-contain object-right"/>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl pl-6 pb-0 pt-20 md:pt-28">
        <div className="max-w-[540px]">
          <h1 className="text-[32px] font-black leading-[1.12] text-[#2F236D] md:text-[44px]">
            Nos packs d'activités<br/>pour toutes les envies
          </h1>
          <p className="mt-5 max-w-[450px] text-[16px] leading-7 text-[#4F5F45]">
            Des activités clés en main pour éveiller la curiosité, créer et s'amuser à chaque saison!
          </p>
          <div className="mt-8 flex flex-nowrap gap-x-5">
            {BADGES.map((item) => (
              <div key={item.title} className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center">
                  <img src={item.icon} alt="" className="h-8 w-8 object-contain"/>
                </div>
                <div>
                  <p className="max-w-[150px] text-[13px] font-semibold leading-5 text-[#273068]">{item.title}</p>
                  <p className="mt-1 text-[11px] leading-4 text-[#4F5F45]">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
