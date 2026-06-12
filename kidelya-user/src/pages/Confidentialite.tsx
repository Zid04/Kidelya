import { Link } from "react-router-dom"

const sections = [
  {
    title: "1. Introduction",
    content: (
      <p>
        Cette politique de confidentialité décrit la manière dont Kidelya collecte, utilise,
        protège et partage vos données personnelles lorsque vous utilisez notre plateforme.
        Nous respectons le Règlement Général sur la Protection des Données (RGPD) et nous nous
        engageons à garantir la sécurité et la confidentialité de vos informations.
      </p>
    ),
  },
  {
    title: "2. Données que nous collectons",
    content: (
      <>
        <p>Nous collectons uniquement les données nécessaires au bon fonctionnement de Kidelya.</p>
        <ul className="mt-3 space-y-2 text-sm">
          <li>• <strong>Données de compte :</strong> nom, prénom, email, mot de passe.</li>
          <li>• <strong>Données liées aux enfants :</strong> prénom, âge (optionnel).</li>
          <li>• <strong>Données d’utilisation :</strong> activités créées, packs achetés, favoris.</li>
          <li>• <strong>Données de paiement :</strong> gérées par Stripe, sans stockage bancaire chez Kidelya.</li>
          <li>• <strong>Données techniques :</strong> appareil, navigateur, adresse IP, logs.</li>
        </ul>
      </>
    ),
  },
  {
    title: "3. Comment nous utilisons vos données",
    content: (
      <ul className="space-y-2 text-sm">
        <li>• Fournir l’accès à la plateforme et à vos activités.</li>
        <li>• Gérer vos abonnements et vos achats.</li>
        <li>• Personnaliser votre expérience.</li>
        <li>• Améliorer nos services et corriger les bugs.</li>
        <li>• Vous envoyer des notifications utiles (optionnelles).</li>
        <li>• Garantir la sécurité et prévenir les abus.</li>
      </ul>
    ),
  },
  {
    title: "4. Partage de vos données",
    content: (
      <>
        <p>Nous ne vendons jamais vos données. Nous partageons uniquement ce qui est nécessaire avec :</p>
        <ul className="mt-3 space-y-2 text-sm">
          <li>• <strong>Stripe</strong> pour sécuriser les transactions.</li>
          <li>• <strong>Hébergeurs et services techniques</strong> pour le fonctionnement de la plateforme.</li>
          <li>• <strong>Outils d’emailing</strong> pour les messages utiles (optionnels).</li>
        </ul>
        <p className="mt-3">Tous nos partenaires respectent le RGPD et la confidentialité de vos données.</p>
      </>
    ),
  },
  {
    title: "5. Sécurité de vos données",
    content: (
      <>
        <p>Nous mettons en place des mesures strictes pour protéger vos informations :</p>
        <ul className="mt-3 space-y-2 text-sm">
          <li>• Chiffrement des données sensibles.</li>
          <li>• Stockage sécurisé sur serveurs protégés.</li>
          <li>• Aucun stockage des données bancaires.</li>
          <li>• Accès limité aux équipes autorisées.</li>
        </ul>
      </>
    ),
  },
  {
    title: "6. Vos droits",
    content: (
      <>
        <p>Conformément au RGPD, vous disposez des droits suivants :</p>
        <ul className="mt-3 space-y-2 text-sm">
          <li>• Droit d’accès à vos données.</li>
          <li>• Droit de rectification.</li>
          <li>• Droit de suppression.</li>
          <li>• Droit d’opposition.</li>
          <li>• Droit à la portabilité.</li>
        </ul>
        <p className="mt-4">
          Pour exercer vos droits, contactez-nous à :{" "}
          <strong className="text-[#E94E6F]">bonjour@kidelya.com</strong>
        </p>
      </>
    ),
  },
  {
    title: "7. Cookies",
    content: (
      <>
        <p>
          Kidelya utilise des cookies pour améliorer votre expérience, analyser l’utilisation
          de la plateforme et personnaliser certains contenus.
        </p>
        <p className="mt-3">
          Vous pouvez gérer vos préférences à tout moment depuis votre navigateur.
        </p>
      </>
    ),
  },
  {
    title: "8. Modifications de cette politique",
    content: (
      <p>
        Nous pouvons mettre à jour cette politique pour refléter des évolutions légales ou techniques.
        En cas de changement important, vous serez informé directement.
      </p>
    ),
  },
]

export default function ConfidentialitePage() {
  return (
    <div className="min-h-screen bg-white text-[#273068]">
      <section className="mx-auto max-w-5xl px-6 pb-8 pt-14 text-center">
        <h1 className="text-4xl font-black text-[#7C67B2] md:text-5xl">Politique de confidentialité</h1>
        <div className="mx-auto mt-3 h-[3px] w-12 rounded-full bg-[#E94E6F]" />
        <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-7 text-[#273068]">
          Chez Kidelya, la protection de vos données est une priorité. Cette page explique
          comment nous collectons, utilisons et sécurisons vos informations.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-10">
        <div className="space-y-4">
          {sections.map((section) => (
            <article
              key={section.title}
              className="rounded-[14px] bg-[#FFFEFA] p-6 text-[#273068] shadow-sm"
            >
              <h2 className="text-xl font-black text-[#7C67B2]">{section.title}</h2>
              <div className="mt-3 leading-7">{section.content}</div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-16 text-center">
        <div className="rounded-[14px] bg-[#D5CDE2] p-7">
          <h2 className="text-2xl font-black text-[#7C67B2]">Une question sur vos données ?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-[#273068]">
            Notre équipe est disponible pour répondre à toutes vos questions.
          </p>

          <Link
            to="/contact"
            className="mt-5 inline-flex rounded-[10px] bg-[#E94E6F] px-6 py-3 text-sm font-semibold text-white hover:bg-[#d63f5f]"
          >
            Nous contacter
          </Link>
        </div>
      </section>
    </div>
  )
}