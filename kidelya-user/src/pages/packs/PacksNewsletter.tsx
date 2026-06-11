import ctaPack from "@/assets/ctapack.png"

interface Props {
  email: string
  status: "idle" | "loading" | "success" | "error"
  onEmailChange: (v: string) => void
  onSubmit: (e: { preventDefault(): void }) => void
}

export default function PacksNewsletter({ email, status, onEmailChange, onSubmit }: Props) {
  return (
    <section className="relative mt-16 overflow-hidden rounded-3xl shadow-lg">
      <img src={ctaPack} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover"/>
      <div className="relative z-10 flex flex-col items-center justify-center gap-4 px-[18%] py-10 md:flex-row md:gap-8">
        <div className="shrink-0 text-center md:text-left">
          <h2 className="text-lg font-black leading-snug text-white md:text-xl">Ne ratez aucune nouveauté !</h2>
          <p className="mt-1 text-xs leading-5 text-white/80">Recevez nos nouveaux packs et idées créatives.</p>
        </div>
        <form onSubmit={onSubmit} className="flex shrink-0 items-center overflow-hidden rounded-full bg-white shadow-sm">
          <input
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder={status === "success" ? "Inscrit ✓" : "Votre email"}
            required
            disabled={status === "loading" || status === "success"}
            className="w-44 bg-transparent px-4 py-2.5 text-sm text-[#2F236D] placeholder-[#9B8FBF] outline-none disabled:opacity-60"
          />
          <button type="submit" disabled={status === "loading" || status === "success"}
            className="shrink-0 rounded-full bg-[#E94E6F] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#d63f5f] disabled:opacity-60">
            {status === "loading" ? "..." : status === "success" ? "✓" : "S'inscrire"}
          </button>
        </form>
      </div>
    </section>
  )
}
