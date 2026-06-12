
import { useState } from "react"
import heroContact from "@/assets/photo-hero-contact.png"
import api from "@/api/axios"

type FormState = {
  name: string
  email: string
  subject: string
  message: string
}

const initialForm: FormState = { name: "", email: "", subject: "", message: "" }

export default function KidelyaContactPage() {
  const [form, setForm] = useState<FormState>(initialForm)
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")

  const faqItems = [
    {
      title: "Mon compte",
      description: "Gérer mon compte, mon abonnement, mes informations...",
      bg: "#273068",
      icon: (
        <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="#ffffff" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
    {
      title: "Paiement & Abonnement",
      description: "Modes de paiement, gestion de l'abonnement, facturation...",
      bg: "#FDC600",
      icon: (
        <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="#ffffff" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" />
        </svg>
      ),
    },
    {
      title: "Activités & Packs",
      description: "Questions sur les packs, téléchargements, utilisation...",
      bg: "#E94E6F",
      icon: (
        <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="#ffffff" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ),
    },
    {
      title: "Fonctionnalités",
      description: "Fonctionnement de l'app, planification, calendrier, souvenirs...",
      bg: "#6F8D4C",
      icon: (
        <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="#ffffff" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
        </svg>
      ),
    },
  ]

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus("loading")
    setErrorMsg("")

    try {
      await api.post("/contact", form)
      setStatus("success")
      setForm(initialForm)
    } catch (err: any) {
      setStatus("error")
      const msg = err?.response?.data?.message || err?.response?.data?.errors
        ? Object.values(err.response.data.errors as Record<string, string[]>).flat().join(" ")
        : "Une erreur est survenue. Veuillez réessayer."
      setErrorMsg(msg)
    }
  }

  return (
    <div className="min-h-screen bg-white text-[#273068] font-sans overflow-hidden">
      {/* Hero */}
      <section className="px-6 lg:px-16 py-12 grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <p className="uppercase tracking-[0.3em] text-[#E94E6F] font-semibold text-sm mb-4">
            Contactez-nous
          </p>

          <h2 className="text-5xl leading-tight font-black text-[#7C67B2] max-w-xl">
            Nous sommes là <br /> pour <span className="text-[#E94E6F]">vous aider</span>
          </h2>

          <p className="mt-6 text-lg text-[#273068] max-w-lg leading-relaxed">
            Une question, un besoin d'aide ou une suggestion ? Écrivez-nous,
            nous vous répondons avec plaisir.
          </p>

          <div className="mt-10 flex flex-wrap gap-8">
            <div className="flex items-center gap-3">
              <svg viewBox="0 0 48 48" className="h-10 w-10 shrink-0" fill="none" stroke="#273068" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="6" y="12" width="36" height="26" rx="3" />
                <path d="M6 14l18 13L42 14" />
              </svg>
              <div>
                <p className="font-semibold text-[#273068]">Réponse rapide</p>
                <p className="text-sm text-[#4F5F45]">sous 24h ouvrées</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <svg viewBox="0 0 48 48" className="h-10 w-10 shrink-0" fill="none" stroke="#273068" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M24 40C24 40 8 30 8 18C8 13 13 9 18 12C21 13.5 24 17 24 17C24 17 27 13.5 30 12C35 9 40 13 40 18C40 30 24 40 24 40Z" />
              </svg>
              <div>
                <p className="font-semibold text-[#273068]">Une équipe</p>
                <p className="text-sm text-[#4F5F45]">à votre écoute</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <svg viewBox="0 0 48 48" className="h-10 w-10 shrink-0" fill="none" stroke="#273068" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M24 6L38 12V23C38 32 32 39.5 24 43C16 39.5 10 32 10 23V12L24 6Z" />
              </svg>
              <div>
                <p className="font-semibold text-[#273068]">Données</p>
                <p className="text-sm text-[#4F5F45]">100% sécurisées</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative flex justify-center">
          <div className="relative rounded-[28px] w-full max-w-[560px] overflow-hidden">
            <img src={heroContact} alt="Contact Kidelya" className="h-[420px] w-full object-cover" />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="px-6 lg:px-16 py-8 grid lg:grid-cols-[1.2fr_0.8fr] gap-8">
        {/* Form */}
        <div className="bg-[#FFFEFA] rounded-[24px] p-8 shadow-sm">
          <h3 className="text-3xl font-black text-[#7C67B2] mb-8">
            Envoyez-nous un message
          </h3>

          {status === "success" && (
            <div className="mb-6 rounded-[12px] bg-[#E8F5E9] px-5 py-4 text-sm font-semibold text-[#2E7D32]">
              Message envoyé avec succès ! Nous vous répondrons sous 24h.
            </div>
          )}

          {status === "error" && (
            <div className="mb-6 rounded-[12px] bg-[#FFEBEE] px-5 py-4 text-sm font-semibold text-[#C62828]">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Nom + Mail */}
            <div className="grid md:grid-cols-2 gap-5 mb-5">
              <div className="flex h-14 items-center gap-3 rounded-[12px] border border-[#D5CDE2] px-4">
                <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-[#BDBDBD]" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
                </svg>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Votre nom"
                  required
                  className="flex-1 bg-transparent text-sm text-[#273068] placeholder-[#BDBDBD] outline-none"
                />
              </div>

              <div className="flex h-14 items-center gap-3 rounded-[12px] border border-[#D5CDE2] px-4">
                <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-[#BDBDBD]" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" /><path d="M2 7l10 7 10-7" />
                </svg>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Votre mail"
                  required
                  className="flex-1 bg-transparent text-sm text-[#273068] placeholder-[#BDBDBD] outline-none"
                />
              </div>
            </div>

            {/* Sujet */}
            <div className="flex h-14 items-center gap-3 rounded-[12px] border border-[#D5CDE2] px-4 mb-5">
              <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-[#BDBDBD]" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <input
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="Sujet de votre message"
                required
                className="flex-1 bg-transparent text-sm text-[#273068] placeholder-[#BDBDBD] outline-none"
              />
            </div>

            {/* Message */}
            <div className="flex gap-3 rounded-[12px] border border-[#D5CDE2] px-4 py-4 mb-5">
              <svg viewBox="0 0 24 24" className="mt-0.5 h-5 w-5 shrink-0 text-[#BDBDBD]" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
              <textarea
                rows={7}
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Votre message ..."
                required
                className="flex-1 bg-transparent text-sm text-[#273068] placeholder-[#BDBDBD] outline-none resize-none"
              />
            </div>

            {/* Bouton */}
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full h-14 rounded-[12px] bg-[#E94E6F] text-white font-semibold hover:bg-[#d63f5f] transition flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {status === "loading" ? "Envoi en cours..." : "Envoyer le message"}
              {status !== "loading" && (
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              )}
            </button>

            <p className="text-center text-sm text-[#273068] mt-5">
              En envoyant ce formulaire, vous acceptez notre{" "}
              <a href="/Confidentialite" className="font-bold text-[#273068] hover:underline">
                politique de confidentialité
              </a>.
            </p>
          </form>
        </div>

        {/* Contact cards */}
        <div className="bg-[#FFFEFA] rounded-[24px] p-8 shadow-sm">
          <h3 className="text-3xl font-black text-[#7C67B2] mb-8">
            Autres moyens de nous contacter
          </h3>

          <div className="space-y-5">
            <div className="flex gap-4 p-5">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#D5CDE2]">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="#273068" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" /><path d="M2 7l10 7 10-7" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-lg text-[#273068]">Par email</h4>
                <p className="font-medium text-[#273068] mt-1">bonjour@kidelya.com</p>
                <p className="text-sm text-[#273068] mt-1">Nous vous répondons sous 24h ouvrées.</p>
              </div>
            </div>

            <div className="flex gap-4 p-5">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#E94E6F]">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="#ffffff" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.09 2.18 2 2 0 012.07 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-lg text-[#273068]">Par téléphone</h4>
                <p className="font-medium text-[#273068] mt-1">01 23 45 67 89</p>
                <p className="text-sm text-[#273068] mt-1">Du lundi au vendredi, 9h – 18h</p>
              </div>
            </div>

            <div className="flex gap-4 p-5">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#F4BB48]">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="#ffffff" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-lg text-[#273068]">Aide en ligne</h4>
                <p className="font-medium text-[#273068] mt-1">Consultez notre FAQ</p>
                <p className="text-sm text-[#273068] mt-1">Des réponses à vos questions les plus fréquentes.</p>
              </div>
            </div>

            <a
              href="/faq"
              className="mt-2 flex items-center justify-center gap-2 rounded-[16px] px-6 py-4 text-sm font-semibold text-[#7C67B2] transition hover:bg-[#c5bbd2] bg-[#D5CDE2]"
            >
              Aller à la FAQ
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="#273068" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 lg:px-16 py-20 text-center relative">
        <h3 className="text-4xl font-black text-[#7C67B2]">
          Besoin d'une réponse rapide ?
        </h3>

        <p className="text-[#273068] mt-4 text-lg">
          Consultez notre FAQ, vous y trouverez peut-être la réponse à votre question.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {faqItems.map((item, index) => (
            <div key={index} className="rounded-[20px] p-8 transition hover:-translate-y-1">
              <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-5" style={{ backgroundColor: item.bg }}>
                {item.icon}
              </div>
              <h4 className="text-xl font-bold text-[#273068]">{item.title}</h4>
              <p className="text-[#273068] mt-4 leading-relaxed text-sm">{item.description}</p>
            </div>
          ))}
        </div>

        <a
          href="/faq"
          className="mt-10 inline-block bg-[#D5CDE2] text-[#7C67B2] rounded-[12px] px-8 py-4 font-semibold hover:bg-[#c5bbd2] transition"
        >
          Voir toutes les questions fréquentes
        </a>
      </section>
    </div>
  )
}
