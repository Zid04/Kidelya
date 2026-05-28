import NavFooter from "@/components/NavFooter"
import HeroSection from "./home/HeroSection"
import SimplifiezSection from "./home/SimplifiezSection"
import PacksSection from "./home/PacksSection"
import AbonnementsSection from "./home/AbonnementsSection"
import CommentCaMarcheSection from "./home/CommentCaMarcheSection"
import CTASection from "./home/CTASection"
import homeBackground from "@/assets/Image-Font-Home.png"

export default function Home() {
  return (
    <>
      <div
        className="
          w-full min-h-screen
          bg-[#FFF8F3]
          bg-top
          bg-[length:100%_auto]
          bg-repeat-y
          md:bg-cover
          md:bg-no-repeat
          md:bg-center
        "
        style={{
          backgroundImage: `url(${homeBackground})`,
        }}
      >
        <HeroSection />
        <SimplifiezSection />
        <PacksSection />
        <AbonnementsSection />
        <CommentCaMarcheSection />
        <CTASection />
        <NavFooter />
      </div>
    </>
  )
}