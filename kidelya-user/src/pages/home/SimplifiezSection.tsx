const featureColors = ["#F5A9B9", "#E94E6F", "#CDB9EA", "#8DBE55"]

const featureIcons = [
  // 1. Bibliothèque d'activités — dossier
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-12 w-12">
    <path d="M6 14h13l4 5h19v19a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4V14Z" fill="white" fillOpacity="0.9" />
    <path d="M6 14a4 4 0 0 1 4-4h9l4 5h15a4 4 0 0 1 4 4v3H6v-8Z" fill="white" fillOpacity="0.65" />
    <circle cx="35" cy="33" r="5" fill="white" fillOpacity="0.45" />
  </svg>,

  // 2. Planifiez — calendrier
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-12 w-12">
    <rect x="7" y="12" width="34" height="30" rx="4" fill="white" fillOpacity="0.9" />
    <rect x="7" y="12" width="34" height="11" rx="4" fill="white" fillOpacity="0.5" />
    <line x1="16" y1="8" x2="16" y2="16" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="32" y1="8" x2="32" y2="16" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
    <rect x="13" y="28" width="5" height="5" rx="1" fill="white" fillOpacity="0.6" />
    <rect x="22" y="28" width="5" height="5" rx="1" fill="white" fillOpacity="0.6" />
    <rect x="31" y="28" width="5" height="5" rx="1" fill="white" fillOpacity="0.6" />
    <rect x="13" y="36" width="5" height="5" rx="1" fill="white" fillOpacity="0.6" />
    <rect x="22" y="36" width="5" height="5" rx="1" fill="white" fillOpacity="0.6" />
  </svg>,

  // 3. Souvenirs — appareil photo
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-12 w-12">
    <rect x="6" y="16" width="36" height="26" rx="4" fill="white" fillOpacity="0.9" />
    <path d="M18 16 L20 10 H28 L30 16" fill="white" fillOpacity="0.6" />
    <circle cx="24" cy="29" r="7" fill="white" fillOpacity="0.4" stroke="white" strokeWidth="2" />
    <circle cx="24" cy="29" r="3.5" fill="white" fillOpacity="0.8" />
    <circle cx="35" cy="21" r="2" fill="white" fillOpacity="0.6" />
  </svg>,

  // 4. Profil — silhouette groupe
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-12 w-12">
    <circle cx="19" cy="17" r="7" fill="white" fillOpacity="0.9" />
    <path d="M7 39c0-7 5.373-13 12-13s12 6 12 13" fill="white" fillOpacity="0.9" />
    <circle cx="32" cy="19" r="6" fill="white" fillOpacity="0.55" />
    <path d="M25 39c.8-5.6 4.9-10 10-10 4.4 0 8 4 8 10" fill="white" fillOpacity="0.55" />
  </svg>,
]

export default function SimplifiezSection() {
  const items = [
    {
      title: "Bibliothèque d’activités prêtes à l’emploi",
      desc: "Des centaines d’activités manuelles classées par âge et thème.",
    },
    {
      title: "Planifiez en toute sérénité",
      desc: "Un calendrier intégré pour organiser vos activités.",
    },
    {
      title: "Gardez de précieux souvenirs",
      desc: "Stockez photos, créations et moments forts.",
    },
    {
      title: "Adapté à chaque profil",
      desc: "Pensé pour parents, professionnels et structures.",
    },
  ]

  return (
    <section className="bg-transparent py-16">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <div className="mb-10">
          <h2 className="text-2xl font-extrabold text-[#273068] md:text-[26px]">
            Simplifiez votre quotidien
          </h2>
          <div className="mx-auto mt-3 h-[3px] w-12 rounded-full bg-[#E94E6F]" />
        </div>

        <div className="mx-auto flex max-w-5xl flex-wrap justify-center gap-x-10 gap-y-12">
          {items.map((item, index) => (
            <div
              key={item.title}
              className="flex w-full max-w-[210px] flex-col items-center text-center sm:w-[210px]"
            >
              <div className="relative mb-5 flex h-[148px] w-[148px] items-center justify-center rounded-md bg-[#F3EBDD]">
                <div
                  className="flex h-24 w-24 items-center justify-center rounded-full shadow-[0_10px_18px_rgba(39,48,104,0.12)]"
                  style={{ backgroundColor: featureColors[index] }}
                >
                  {featureIcons[index]}
                </div>
              </div>

              <h3 className="max-w-[175px] text-[13px] font-extrabold leading-5 text-[#273068]">
                {item.title}
              </h3>

              <p className="mt-2 max-w-[180px] text-[11px] leading-5 text-[#333333]">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}