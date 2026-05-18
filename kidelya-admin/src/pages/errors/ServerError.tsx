import { Link } from 'react-router-dom'
import Card from '../../components/ui/Card'

export default function ServerError() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gray-50">
      <Card className="p-10 max-w-md text-center">

        <h1 className="text-6xl font-bold text-orange-500 mb-4">500</h1>

        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Erreur interne du serveur
        </h2>

        <p className="text-gray-500 text-sm mb-6">
          Une erreur inattendue s’est produite. Nos équipes ont été notifiées.
        </p>

        <Link
          to="/dashboard"
          className="inline-block px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm transition"
        >
          Retour au tableau de bord
        </Link>

      </Card>
    </div>
  )
}
