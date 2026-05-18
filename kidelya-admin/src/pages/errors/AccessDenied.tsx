import { Link } from 'react-router-dom'
import Card from '../../components/ui/Card'

export default function AccessDenied() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gray-50">
      <Card className="p-10 max-w-md text-center">

        <h1 className="text-6xl font-bold text-red-600 mb-4">403</h1>

        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Accès refusé
        </h2>

        <p className="text-gray-500 text-sm mb-6">
          Vous n’avez pas les permissions nécessaires pour accéder à cette page.
        </p>

        <Link
          to="/dashboard"
          className="inline-block px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition"
        >
          Retour au tableau de bord
        </Link>

      </Card>
    </div>
  )
}
