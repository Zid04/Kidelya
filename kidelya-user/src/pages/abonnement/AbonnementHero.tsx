import heroAbonnement from "@/assets/photo-hero-abonnement.png"

function ShieldIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path d="M12 3L4 6.5V11C4 15.4 7.4 19.5 12 21C16.6 19.5 20 15.4 20 11V6.5L12 3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
    </svg>
  )
}

export default function AbonnementHero() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-6 pt-14">
      <div className="grid items-center gap-8 lg:grid-cols-[1fr_1fr]">
        <div className="text-center lg:text-left">
          <h1 className="text-3xl font-extrabold leading-tight md:text-[40px]">
            Choisissez la formule qui vous convient
          </h1>
          <div className="mx-auto mt-3 h-[3px] w-12 rounded-full bg-[#E94E6F] lg:mx-0"/>
          <p className="mt-4 max-w-xl text-sm leading-6 text-[#4F5F45]">
            Accédez à encore plus d'activités créatives avec les abonnements Kidelya.
          </p>
          <div className="mt-6 flex flex-wrap gap-5 text-left">
            <div className="flex items-center gap-2 text-xs">
              <ShieldIcon className="text-[#273068]"/>
              <span>Sécurisé et privé</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#273068]" fill="none">
                <path d="M12 3l1.8 4.5L18 9.3l-4.2 1.7L12 15.5 10.2 11 6 9.3l4.2-1.8L12 3z" stroke="currentColor" strokeWidth="1.6"/>
              </svg>
              <span>Sans engagement</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#273068]" fill="none">
                <path d="M12 20s-7-4.4-7-9.2A4.3 4.3 0 019.3 6c1.2 0 2.2.5 2.7 1.4.5-.9 1.5-1.4 2.7-1.4A4.3 4.3 0 0119 10.8C19 15.6 12 20 12 20z" stroke="currentColor" strokeWidth="1.8"/>
              </svg>
              <span>Contenus mis à jour</span>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-[18px]">
          <img src={heroAbonnement} alt="Illustration abonnement" className="h-[220px] w-full rounded-[12px] object-cover md:h-[260px]"/>
        </div>
      </div>
    </section>
  )
}
