import { useLocation } from "react-router-dom"

export default function ErrorPage() {
  const location = useLocation()
  const state = location.state as { message?: string } | null

  const message =
    state?.message ||
    "Une erreur inattendue est survenue. Veuillez réessayer plus tard."

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-3xl font-bold text-[#E94E6F] mb-4">
        Oups… 😔
      </h1>

      <p className="text-[#6F8D4C] mb-6 max-w-md">
        {message}
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
