import Card from '../../components/ui/Card'

export default function Maintenance() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gray-50">
      <Card className="p-10 max-w-md text-center">

        <h1 className="text-5xl font-bold text-yellow-500 mb-4">Maintenance</h1>

        <p className="text-gray-500 text-sm mb-6">
          Le site est temporairement en maintenance.  
          Nous revenons très vite.
        </p>

      </Card>
    </div>
  )
}
