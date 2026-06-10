export default function PaymentSuccess() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-3xl font-bold text-[#93197D] mb-4">
        Paiement réussi 🌸
      </h1>

      <p className="text-[#6F8D4C] mb-6 max-w-md">
        Merci ! Votre paiement a été confirmé.  
        Votre abonnement Kidelya est maintenant actif.
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
