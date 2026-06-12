import { Link } from "react-router-dom"

const sections = [
  {
    title: "1. Objet",
    content: (
      <p>
        Les présentes CGU ont pour objet de définir les modalités d’accès et d’utilisation de la
        plateforme Kidelya, accessible via le site et les services associés. En utilisant Kidelya,
        vous acceptez sans réserve les présentes conditions.
      </p>
    ),
  },
  {
    title: "2. Accès au service",
    content: (
      <>
        <p>
          Kidelya est accessible 24h/24 et 7j/7, sauf interruption programmée ou non pour maintenance
          ou cas de force majeure.
        </p>
        <p className="mt-3">
          L’utilisateur est responsable de son matériel, de sa connexion internet et de la compatibilité
          de son équipement avec la plateforme.
        </p>
      </>
    ),
  },
  {
    title: "3. Création de compte",
    content: (
      <>
        <p>
          Pour accéder à certaines fonctionnalités, l’utilisateur doit créer un compte en fournissant
          des informations exactes et à jour.
        </p>
        <ul className="mt-3 space-y-2 text-sm">
          <li>• L’utilisateur est responsable de la confidentialité de son mot de passe.</li>
          <li>• Toute activité réalisée depuis son compte est réputée effectuée par lui.</li>
          <li>• Kidelya se réserve le droit de suspendre un compte en cas d’usage frauduleux.</li>
        </ul>
      </>
    ),
  },
  {
    title: "4. Utilisation de la plateforme",
    content: (
      <>
        <p>
          L’utilisateur s’engage à utiliser Kidelya dans le respect des lois et des règles de bonne conduite.
        </p>
        <ul className="mt-3 space-y-2 text-sm">
          <li>• Ne pas publier de contenus illégaux, offensants ou dangereux.</li>
          <li>• Ne pas tenter d’accéder aux données d’autres utilisateurs.</li>
          <li>• Ne pas perturber le bon fonctionnement du service.</li>
        </ul>
      </>
    ),
  },
  {
    title: "5. Abonnements et paiements",
    content: (
      <>
        <p>
          Certains contenus ou fonctionnalités sont accessibles via un abonnement payant
          ou l’achat de packs.
        </p>
        <ul className="mt-3 space-y-2 text-sm">
          <li>• Les paiements sont gérés par un prestataire sécurisé (Stripe).</li>
          <li>• Aucun remboursement n’est effectué après activation du service.</li>
          <li>• L’utilisateur peut annuler son abonnement à tout moment.</li>
        </ul>
      </>
    ),
  },
  {
    title: "6. Propriété intellectuelle",
    content: (
      <p>
        Tous les contenus présents sur Kidelya (textes, images, activités, interface, logos, illustrations)
        sont protégés par le droit d’auteur. Toute reproduction, modification ou diffusion sans autorisation
        est strictement interdite.
      </p>
    ),
  },
  {
    title: "7. Données personnelles",
    content: (
      <p>
        Kidelya respecte votre vie privée. Pour en savoir plus, consultez notre{" "}
        <Link to="/confidentialite" className="font-semibold text-[#E94E6F] hover:underline">
          Politique de confidentialité
        </Link>.
      </p>
    ),
  },
  {
    title: "8. Responsabilités",
    content: (
      <>
        <p>Kidelya ne peut être tenue responsable en cas :</p>
        <ul className="mt-2 space-y-2 text-sm">
          <li>• d’interruption du service,</li>
          <li>• de perte de données liée à un usage incorrect,</li>
          <li>• de dommages résultant d’un usage non conforme de la plateforme.</li>
        </ul>
      </>
    ),
  },
  {
    title: "9. Modification des CGU",
    content: (
      <p>
        Kidelya se réserve le droit de modifier les présentes CGU à tout moment.
        Les utilisateurs seront informés en cas de changement important.
      </p>
    ),
  },
]

export default function CGUPage() {
  return (
    <div className="min-h-screen bg-white text-[#273068]">
      <section className="mx-auto max-w-5xl px-6 pb-8 pt-14 text-center">
        <h1 className="text-4xl font-black text-[#7C67B2] md:text-5xl">Conditions Générales d’Utilisation</h1>
        <div className="mx-auto mt-3 h-[3px] w-12 rounded-full bg-[#E94E6F]" />
        <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-7 text-[#273068]">
          Les présentes Conditions Générales d’Utilisation encadrent l’accès et
          l’utilisation de la plateforme Kidelya.
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
          <h2 className="text-2xl font-black text-[#7C67B2]">10. Contact</h2>
          <p className="mx-auto mt-3 max-w-2xl text-[#273068]">
            Pour toute question concernant ces CGU, vous pouvez nous contacter à :
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
    </div>
  )
}