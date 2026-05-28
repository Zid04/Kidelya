
import NavFooter from "@/components/NavFooter"
import heroContact from "@/assets/photo-hero-contact.png"

export default function KidelyaContactPage() {
  const faqItems = [
    {
      title: "Mon compte",
      description: "Gérer mon compte, mon abonnement, mes informations...",
      icon: "📖",
    },
    {
      title: "Paiement & Abonnement",
      description: "Modes de paiement, gestion de l’abonnement, facturation...",
      icon: "🛍️",
    },
    {
      title: "Activités & Packs",
      description: "Questions sur les packs, téléchargements, utilisation...",
      icon: "🧩",
    },
    {
      title: "Fonctionnalités",
      description: "Fonctionnement de l’app, planification, calendrier, souvenirs...",
      icon: "⚙️",
    },
  ]

  const contacts = [
    {
      title: "Par email",
      text: "bonjour@kidelya.com",
      sub: "Nous vous répondons sous 24h ouvrées.",
      color: "bg-[#EAF3FF] text-[#273068]",
      icon: "✉️",
    },
    {
      title: "Par téléphone",
      text: "01 23 45 67 89",
      sub: "Du lundi au vendredi, 9h – 18h",
      color: "bg-[#FFE7ED] text-[#E94E6F]",
      icon: "💬",
    },
    {
      title: "Aide en ligne",
      text: "Consultez notre FAQ",
      sub: "Des réponses à vos questions les plus fréquentes.",
      color: "bg-[#FFF3D9] text-[#273068]",
      icon: "❓",
    },
  ]

  return (
    <div className="min-h-screen bg-[#FFF9F0] text-[#273068] font-sans overflow-hidden">
      {/* Hero */}
      <section className="px-6 lg:px-16 py-12 grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <p className="uppercase tracking-[0.3em] text-[#E94E6F] font-semibold text-sm mb-4">
            Contactez-nous
          </p>

          <h2 className="text-5xl leading-tight font-extrabold text-[#273068] max-w-xl">
            Nous sommes là <br /> pour <span className="text-[#E94E6F]">vous aider</span>
          </h2>

          <p className="mt-6 text-lg text-[#4F5F45] max-w-lg leading-relaxed">
            Une question, un besoin d’aide ou une suggestion ? Écrivez-nous,
            nous vous répondons avec plaisir.
          </p>

          <div className="mt-10 flex flex-wrap gap-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#EAF3FF] flex items-center justify-center text-xl">
                ✉️
              </div>
              <div>
                <p className="font-semibold text-[#273068]">Réponse rapide</p>
                <p className="text-sm text-[#4F5F45]">sous 24h ouvrées</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#FFE7ED] flex items-center justify-center text-xl">
                ❤️
              </div>
              <div>
                <p className="font-semibold text-[#273068]">Une équipe</p>
                <p className="text-sm text-[#4F5F45]">à votre écoute</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#FFF3D9] flex items-center justify-center text-xl">
                🛡️
              </div>
              <div>
                <p className="font-semibold text-[#273068]">Données</p>
                <p className="text-sm text-[#4F5F45]">100% sécurisées</p>
              </div>
            </div>
          </div>
        </div>

        {/* Illustration remplacée par image asset */}
        <div className="relative flex justify-center">
          <div className="relative rounded-[28px] w-full max-w-[560px] overflow-hidden border border-[#F1D9B5] bg-transparent">
            <img
              src={heroContact}
              alt="Contact Kidelya"
              className="h-[420px] w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="px-6 lg:px-16 py-8 grid lg:grid-cols-[1.2fr_0.8fr] gap-8">
        {/* Form */}
        <div className="bg-white rounded-[24px] p-8 shadow-sm border border-[#F1D9B5]">
          <h3 className="text-3xl font-bold text-[#273068] mb-8">
            Envoyez-nous un message
          </h3>

          <div className="grid md:grid-cols-2 gap-5 mb-5">
            <input
              type="text"
              placeholder="Votre nom"
              className="h-14 rounded-[12px] border border-[#F1D9B5] px-5 outline-none focus:ring-2 focus:ring-[#E94E6F]/25"
            />

            <input
              type="email"
              placeholder="Votre email"
              className="h-14 rounded-[12px] border border-[#F1D9B5] px-5 outline-none focus:ring-2 focus:ring-[#E94E6F]/25"
            />
          </div>

          <select className="w-full h-14 rounded-[12px] border border-[#F1D9B5] px-5 mb-5 text-[#4F5F45] outline-none focus:ring-2 focus:ring-[#E94E6F]/25">
            <option>Sujet de votre message</option>
            <option>Support</option>
            <option>Facturation</option>
            <option>Partenariat</option>
          </select>

          <textarea
            rows={7}
            placeholder="Votre message..."
            className="w-full rounded-[12px] border border-[#F1D9B5] px-5 py-4 outline-none focus:ring-2 focus:ring-[#E94E6F]/25 resize-none"
          />

          <button className="mt-6 w-full h-14 rounded-[12px] bg-[#E94E6F] text-white font-semibold shadow-lg hover:bg-[#d63f5f] transition">
            Envoyer le message
          </button>

          <p className="text-center text-sm text-[#4F5F45] mt-5">
            En envoyant ce formulaire, vous acceptez notre politique de
            confidentialité.
          </p>
        </div>

        {/* Contact cards */}
        <div className="bg-white rounded-[24px] p-8 shadow-sm border border-[#F1D9B5]">
          <h3 className="text-3xl font-bold text-[#273068] mb-8">
            Autres moyens de nous contacter
          </h3>

          <div className="space-y-5">
            {contacts.map((item, index) => (
              <div
                key={index}
                className="rounded-[16px] border border-[#F1D9B5] p-5 flex gap-4 hover:shadow-md transition"
              >
                <div
                  className={`w-14 h-14 rounded-[12px] flex items-center justify-center text-2xl ${item.color}`}
                >
                  {item.icon}
                </div>

                <div>
                  <h4 className="font-bold text-lg text-[#273068]">
                    {item.title}
                  </h4>
                  <p className="font-medium text-[#273068] mt-1">{item.text}</p>
                  <p className="text-sm text-[#4F5F45] mt-1">{item.sub}</p>
                </div>
              </div>
            ))}

            <div className="rounded-[16px] bg-[#FFF3E0] p-6 mt-6 border border-[#F1D9B5]">
              <p className="text-[#E94E6F] text-3xl mb-2">🌱</p>
              <h4 className="font-bold text-[#273068] text-lg">
                Vous avez une idée ?
              </h4>
              <p className="text-[#4F5F45] mt-2 leading-relaxed">
                Nous sommes toujours ravis de découvrir vos suggestions pour
                améliorer Kidelya.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 lg:px-16 py-20 text-center relative">
        <h3 className="text-4xl font-bold text-[#273068]">
          Besoin d’une réponse rapide ?
        </h3>

        <p className="text-[#4F5F45] mt-4 text-lg">
          Consultez notre FAQ, vous y trouverez peut-être la réponse à votre
          question.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {faqItems.map((item, index) => (
            <div
              key={index}
              className="bg-white border border-[#F1D9B5] rounded-[20px] p-8 shadow-sm hover:-translate-y-1 hover:shadow-lg transition"
            >
              <div className="w-16 h-16 mx-auto rounded-[12px] bg-[#EFE7FF] flex items-center justify-center text-3xl mb-5">
                {item.icon}
              </div>

              <h4 className="text-xl font-bold text-[#273068]">
                {item.title}
              </h4>

              <p className="text-[#4F5F45] mt-4 leading-relaxed text-sm">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        <button className="mt-10 border border-[#273068]/30 text-[#273068] rounded-[12px] px-8 py-4 font-semibold hover:bg-[#f6f6f6] transition">
          Voir toutes les questions fréquentes
        </button>
      </section>

      {/* Newsletter */}
      <section className="px-6 lg:px-16 pb-16">
        <div className="rounded-[24px] bg-white border border-[#F1D9B5] p-10 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-sm">
          <div>
            <h3 className="text-4xl font-bold text-[#273068]">Restez inspiré !</h3>
            <p className="text-[#4F5F45] mt-3 max-w-xl leading-relaxed">
              Recevez des idées d’activités, nos nouveautés et des conseils
              directement dans votre boîte mail.
            </p>
          </div>

          <div className="flex w-full lg:w-auto gap-4">
            <input
              type="email"
              placeholder="Votre email"
              className="h-14 w-full lg:w-80 rounded-[12px] border border-[#F1D9B5] px-5 outline-none"
            />

            <button className="bg-[#E94E6F] text-white rounded-[12px] px-8 font-semibold hover:bg-[#d63f5f] transition">
              S’abonner
            </button>
          </div>
        </div>
      </section>

      <NavFooter />
    </div>
  )
}