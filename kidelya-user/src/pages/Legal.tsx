import { Link } from "react-router-dom"
import NavFooter from "@/components/NavFooter"

const sections = [
  {
    title: "1. Éditeur du site",
    content: (
      <>
        <p>Le site Kidelya est édité par :</p>
        <ul className="mt-3 space-y-1 text-sm">
          <li>• <strong>Nom de l’entreprise :</strong> Kidelya</li>
          <li>• <strong>Statut :</strong> Auto-entreprise / Société (à adapter)</li>
          <li>• <strong>Adresse :</strong> (adresse de l’entreprise)</li>
          <li>• <strong>SIRET :</strong> (numéro SIRET)</li>
          <li>• <strong>Responsable de la publication :</strong> (Nom Prénom)</li>
          <li>• <strong>Email de contact :</strong> bonjour@kidelya.com</li>
        </ul>
      </>
    ),
  },
  {
    title: "2. Hébergement du site",
    content: (
      <>
        <p>Le site est hébergé par :</p>
        <ul className="mt-3 space-y-1 text-sm">
          <li>• <strong>Nom :</strong> (ex : OVH, Hostinger, Render…)</li>
          <li>• <strong>Adresse :</strong> (adresse de l’hébergeur)</li>
          <li>• <strong>Téléphone :</strong> (numéro de l’hébergeur)</li>
        </ul>
      </>
    ),
  },
  {
    title: "3. Propriété intellectuelle",
    content: (
      <>
        <p>
          L’ensemble du contenu du site Kidelya (textes, images, logos, illustrations,
          vidéos, interface, design, activités, documents) est protégé par le droit d’auteur
          et la législation en vigueur.
        </p>
        <p className="mt-3">
          Toute reproduction, modification, distribution ou exploitation sans autorisation
          écrite est strictement interdite.
        </p>
      </>
    ),
  },
  {
    title: "4. Responsabilité",
    content: (
      <>
        <p>
          Kidelya met tout en œuvre pour assurer l’exactitude et la mise à jour des
          informations présentes sur le site. Toutefois, des erreurs ou omissions peuvent survenir.
        </p>
        <p className="mt-3">Kidelya ne peut être tenue responsable :</p>
        <ul className="mt-2 space-y-1 text-sm">
          <li>• d’une interruption du site,</li>
          <li>• d’un bug ou dysfonctionnement technique,</li>
          <li>• d’une perte de données liée à un usage incorrect,</li>
          <li>• de l’utilisation des informations présentes sur le site.</li>
        </ul>
      </>
    ),
  },
  {
    title: "5. Données personnelles",
    content: (
      <>
        <p>
          Kidelya respecte votre vie privée et protège vos données personnelles conformément au RGPD.
        </p>
        <p className="mt-3">
          Pour plus d’informations, consultez notre{" "}
          <Link to="/Confidentialite" className="font-semibold text-[#E94E6F] hover:underline">
            Politique de confidentialité
          </Link>.
        </p>
      </>
    ),
  },
  {
    title: "6. Cookies",
    content: (
      <>
        <p>
          Le site peut utiliser des cookies pour améliorer votre expérience, analyser la fréquentation
          ou personnaliser certains contenus.
        </p>
        <p className="mt-3">
          Vous pouvez gérer vos préférences directement depuis votre navigateur.
        </p>
      </>
    ),
  },
  {
    title: "7. Liens externes",
    content: (
      <p>
        Le site peut contenir des liens vers d’autres sites. Kidelya n’est pas responsable
        du contenu ou du fonctionnement de ces sites tiers.
      </p>
    ),
  },
]

export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen bg-[#FFF9F0] text-[#273068]">
      <section className="mx-auto max-w-5xl px-6 pb-8 pt-14 text-center">
        <h1 className="text-4xl font-extrabold md:text-5xl">Mentions légales</h1>
        <div className="mx-auto mt-3 h-[3px] w-12 rounded-full bg-[#E94E6F]" />
        <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-7 text-[#4F5F45]">
          Conformément à la législation française, vous trouverez ci-dessous
          toutes les informations relatives à l’éditeur, à l’hébergement et à
          l’utilisation du site Kidelya.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-10">
        <div className="space-y-4">
          {sections.map((section) => (
            <article
              key={section.title}
              className="rounded-[14px] border border-[#F1D9B5] bg-white p-6 text-[#4F5F45]"
            >
              <h2 className="text-xl font-bold text-[#273068]">{section.title}</h2>
              <div className="mt-3 leading-7">{section.content}</div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-16 text-center">
        <div className="rounded-[14px] border border-[#F1D9B5] bg-white p-7">
          <h2 className="text-2xl font-bold text-[#273068]">8. Contact</h2>
          <p className="mx-auto mt-3 max-w-2xl text-[#4F5F45]">
            Pour toute question concernant ces mentions légales, vous pouvez nous contacter à :
            <br />
            <strong className="text-[#E94E6F]">bonjour@kidelya.com</strong>
          </p>

          <Link
            to="/contact"
            className="mt-5 inline-flex rounded-[10px] bg-[#E94E6F] px-6 py-3 text-sm font-semibold text-white hover:bg-[#d63f5f]"
          >
            Contacter l’équipe Kidelya
          </Link>
        </div>
      </section>

      <NavFooter />
    </div>
  )
}