export default function SubscriptionConfirm() {
  return (
    <div className="min-h-screen bg-[#FFF9F0] flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-3xl font-bold text-[#93197D] mb-4">
        Abonnement confirmé 🌸
      </h1>

      <p className="text-[#6F8D4C] mb-6 max-w-md">
        Votre abonnement est maintenant actif.  
        Vous avez accès à toutes les fonctionnalités Kidelya (plannings, groupes, parents…).
      </p>

      <a
        href="/"
        className="px-6 py-3 bg-[#E94E6F] text-white rounded-lg font-semibold hover:bg-[#d63f5f]"
      >
        Retour à l’accueil
      </a>
    </div>
  )
}
