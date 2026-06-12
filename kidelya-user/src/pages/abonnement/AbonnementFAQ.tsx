import { Link } from "react-router-dom"

function RefreshIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 mb-2 text-[#7C67B2]" fill="none">
      <path d="M4 12a8 8 0 018-8 8 8 0 016.93 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M20 4v4h-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M20 12a8 8 0 01-8 8 8 8 0 01-6.93-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M4 20v-4h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 mb-2 text-[#E94E6F]" fill="none">
      <rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M8 10V7a4 4 0 118 0v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <circle cx="12" cy="15" r="1.2" fill="currentColor"/>
    </svg>
  )
}

function SmileIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 mb-2 text-[#F5A623]" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M8.5 14.5s1 2 3.5 2 3.5-2 3.5-2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <circle cx="9" cy="10" r="1" fill="currentColor"/>
      <circle cx="15" cy="10" r="1" fill="currentColor"/>
    </svg>
  )
}

const FAQ = [
  ["Puis-je annuler mon abonnement à tout moment ?", "Oui. L'accès reste actif jusqu'à la fin de la période en cours."],
  ["Puis-je changer de formule plus tard ?", "Oui, vous pouvez changer de formule à tout moment."],
  ["Les formules payantes couvrent-elles plusieurs enfants ?", "Oui, les offres payantes permettent la gestion de plusieurs profils."],
]

const GUARANTEES = [
  { icon: <RefreshIcon/>, title: "Annulation facile", desc: "Gérez votre formule en un clic." },
  { icon: <LockIcon/>,    title: "Paiement sécurisé", desc: "Transactions protégées en permanence." },
  { icon: <SmileIcon/>,   title: "Support réactif",   desc: "Notre équipe vous répond rapidement." },
]

export default function AbonnementFAQ() {
  return (
    <section className="mt-14">
      <h3 className="mb-5 text-center text-xl font-semibold text-[#7C67B2]">Questions fréquentes</h3>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          {FAQ.map(([question, answer]) => (
            <details key={question} className="border-b border-[#D5CDE2] bg-transparent px-2 py-3 text-sm text-[#273068] last:border-b-0">
              <summary className="cursor-pointer font-semibold text-[#273068] list-none flex items-center justify-between">
                {question}
                <span className="ml-2 text-[#E94E6F] text-lg leading-none">+</span>
              </summary>
              <p className="mt-2 text-sm leading-6">{answer}</p>
            </details>
          ))}
        </div>

        <div className="grid grid-cols-3">
          {GUARANTEES.map(({ icon, title, desc }) => (
            <div key={title} className="flex flex-col items-center text-center px-4 py-3">
              {icon}
              <p className="text-sm font-semibold text-[#273068]">{title}</p>
              <p className="mt-1 text-xs text-[#273068]">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-[#273068]">
        Une question ?{" "}
        <Link to="/contact" className="font-semibold text-[#E94E6F]">Contactez-nous</Link>
      </p>
    </section>
  )
}
