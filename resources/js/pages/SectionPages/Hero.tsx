import { Link } from 'react-router-dom'

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-b from-pink-50 to-white py-20 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">

        {/* Texte principal */}
        <div className="text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-purple-800 leading-tight">
            Des activités de printemps pour créer, apprendre et s’épanouir ensemble
          </h1>

          <p className="mt-4 text-gray-600 text-lg max-w-md">
            Organisez, partagez et gardez trace des souvenirs des activités de vos enfants
            en même temps.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link
              to="/register"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg text-sm font-medium shadow transition"
            >
              Commencer gratuitement
            </Link>

            <Link
              to="/packs"
              className="bg-white border border-purple-300 hover:bg-purple-50 text-purple-700 px-6 py-3 rounded-lg text-sm font-medium shadow transition"
            >
              Découvrir les packs
            </Link>
          </div>
        </div>

        {/* Illustration */}
        <div className="relative flex justify-center md:justify-end">
          <img
            src="/assets/hero-girl-spring.png"
            alt="Enfant arrosant des fleurs"
            className="w-80 md:w-[420px] drop-shadow-lg"
          />
        </div>
      </div>

      {/* Décor floral */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-pink-100 to-transparent pointer-events-none" />
    </section>
  )
}
