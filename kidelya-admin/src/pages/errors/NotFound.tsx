import { Link } from 'react-router-dom'
import Card from '../../components/ui/Card'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gray-50">
      <Card className="p-10 max-w-md text-center">

        <h1 className="text-6xl font-bold text-purple-600 mb-4">404</h1>

        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Page introuvable
        </h2>

        <p className="text-gray-500 text-sm mb-6">
          La page que vous recherchez n’existe pas ou a été déplacée.
        </p>

        <Link
          to="/dashboard"
          className="inline-block px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm transition"
        >
          Retour au tableau de bord
        </Link>

      </Card>
    </div>
  )
}
