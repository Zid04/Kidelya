import { Link } from "react-router-dom"

export default function CTASection() {
  return (
    <section className="relative bg-transparent py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="ml-0 max-w-[420px] md:ml-[18%]">
          <h2 className="text-[29px] font-extrabold leading-[34px] text-[#273068]">
            Prêt à faire fleurir de beaux souvenirs ?
          </h2>

          <Link to="/register">
            <button className="mt-5 rounded-[9px] bg-[#E94E6F] px-5 py-3 text-[14px] font-medium text-white shadow-sm transition-colors hover:bg-[#d63f5f]">
              Commencer gratuitement
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}