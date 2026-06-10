export default function PaymentFailed() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-3xl font-bold text-[#E94E6F] mb-4">
        Paiement refusé 😔
      </h1>

      <p className="text-[#6F8D4C] mb-6 max-w-md">
        Le paiement n’a pas pu être validé.  
        Vérifiez vos informations ou réessayez avec un autre moyen de paiement.
      </p>

      <a
        href="/abonnements"
        className="px-6 py-3 bg-[#E94E6F] text-white rounded-lg font-semibold hover:bg-[#d63f5f]"
      >
        Revenir aux abonnements
      </a>
    </div>
  )
}
