import { Link } from "react-router-dom"
import footer01 from "@/assets/FOOTER_02-1.png"
import footer02 from "@/assets/FOOTER2.png"

export default function CTASection() {
  return (
    <section className="relative overflow-hidden bg-transparent py-16">

     {/* Image gauche */}
<img
  src={footer01}
  alt=""
  aria-hidden="true"
  className="pointer-events-none absolute bottom-0 left-0 w-[180px] object-contain lg:w-[240px]"
/>

{/* Image droite */}
<img
  src={footer02}
  alt=""
  aria-hidden="true"
  className="pointer-events-none absolute bottom-0 right-0 w-[350px] object-contain lg:w-[600px]"
/>

      <div className="relative mx-auto max-w-7xl px-6">
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