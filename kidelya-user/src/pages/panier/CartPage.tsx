import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import api from "@/api/axios"
import { useAuth } from "@/context/useAuth"
import { mediaUrl, formatPrice } from "@/utils/media"
import panierImg from "@/assets/panier.png"
import besoinAideImg from "@/assets/besoinAide.png"

type CartItem = {
  id: number
  idpack: number | null
  idactivity: number | null
  quantity: number
  pack: {
    idpack: number
    title: string
    tarification: number | string
    illustration: string | null
    activities_count?: number
    min_age?: number | null
    max_age?: number | null
  } | null
  activity: {
    idactivities: number
    title: string
    credit_price?: number | null
    photourl?: string | null
    agemin?: number | null
    agemax?: number | null
    duration?: number | null
  } | null
}

type Pack = {
  idpack: number
  title: string
  tarification: number | string
  illustration: string | null
  activities_count?: number
  min_age?: number | null
  max_age?: number | null
}

export default function CartPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [items, setItems]           = useState<CartItem[]>([])
  const [loading, setLoading]       = useState(true)
  const [removing, setRemoving]     = useState<number | null>(null)
  const [updating, setUpdating]     = useState<number | null>(null)
  const [suggestions, setSuggestions] = useState<Pack[]>([])
  const [checkoutError, setCheckoutError] = useState<string | null>(null)

  const subtotal = items.reduce((sum, item) => {
    const price = item.pack
      ? Number(item.pack.tarification ?? 0)
      : Number(item.activity?.credit_price ?? 0)
    return sum + price * item.quantity
  }, 0)

  useEffect(() => {
    if (!user) { navigate("/login"); return }

    Promise.all([
      api.get("/cart"),
      api.get("/public/packs?per_page=8"),
    ])
      .then(([cartRes, packsRes]) => {
        const raw: CartItem[] = cartRes.data.data ?? cartRes.data ?? []
        setItems(raw.filter((i) => i.pack != null || i.activity != null))
        setSuggestions(packsRes.data.data ?? [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [user, navigate])

  const removeItem = async (itemId: number) => {
    setRemoving(itemId)
    try {
      await api.delete(`/cart/${itemId}`)
      setItems((prev) => prev.filter((i) => i.id !== itemId))
    } catch {}
    finally { setRemoving(null) }
  }

  const updateQty = async (item: CartItem, delta: number) => {
    const newQty = item.quantity + delta
    if (newQty < 1) return
    setUpdating(item.id)
    try {
      await api.patch(`/cart/${item.id}`, { quantity: newQty })
      setItems((prev) =>
        prev.map((i) => i.id === item.id ? { ...i, quantity: newQty } : i)
      )
    } catch {}
    finally { setUpdating(null) }
  }

  const clearCart = async () => {
    try {
      await api.delete("/cart")
      setItems([])
    } catch {}
  }

  const handleCheckout = async () => {
    if (items.length === 0) return
    setCheckoutError(null)
    const packItems     = items.filter((i) => i.pack != null)
    const activityItems = items.filter((i) => i.activity != null)
    try {
      if (activityItems.length > 0 && packItems.length === 0) {
        const activityIds = activityItems.map((i) => i.activity!.idactivities)
        const payload = activityIds.length === 1
          ? { activity_id: activityIds[0] }
          : { activity_ids: activityIds }
        const res = await api.post("/stripe/activity-checkout", payload)
        window.location.href = res.data.url
        return
      }
      if (activityItems.length > 0 && packItems.length > 0) {
        setCheckoutError("Veuillez payer les activités et les packs séparément.")
        return
      }
      const payload = packItems.length === 1
        ? { pack_id: packItems[0].pack!.idpack, quantity: packItems[0].quantity }
        : {
            pack_ids:   packItems.map((i) => i.pack!.idpack),
            quantities: packItems.map((i) => i.quantity),
          }
      const res = await api.post("/stripe/checkout", payload)
      window.location.href = res.data.url
    } catch {
      setCheckoutError("Erreur lors du paiement. Veuillez réessayer.")
    }
  }

  if (loading) return (
    <div className="flex min-h-[60vh] items-center justify-center text-[#7C67B2]">
      Chargement du panier…
    </div>
  )

  return (
    <div className="min-h-screen bg-white text-[#273068]">
      <div className="mx-auto max-w-7xl px-6 py-10">

        {/* ── HERO ── */}
        <div className="mb-10 flex items-center justify-between gap-6 rounded-3xl bg-[#FFFEFA] px-8 py-8 shadow-sm">
          <div>
            <h1 className="text-4xl font-black text-[#7C67B2]">Votre panier</h1>
            <p className="mt-2 max-w-sm text-sm leading-6 text-[#273068]">
              Vous êtes à un clic de belles activités !<br />
              Vérifiez vos articles et finalisez votre commande.
            </p>
          </div>
          <img src={panierImg} alt="" aria-hidden className="h-32 w-auto shrink-0 object-contain" />
        </div>

        {items.length === 0 ? (
          /* ── PANIER VIDE ── */
          <div className="flex flex-col items-center gap-6 py-20 text-center">
            <svg viewBox="0 0 24 24" className="h-16 w-16 text-[#D5CDE2]" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61H19a2 2 0 001.99-1.74L22 6H6" />
            </svg>
            <p className="text-lg font-semibold text-[#273068]">Votre panier est vide</p>
            <Link to="/packs" className="rounded-xl bg-[#E94E6F] px-6 py-3 text-sm font-bold text-white hover:bg-[#d63f5f]">
              Découvrir les packs
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start">

            {/* ── TABLEAU ARTICLES ── */}
            <div className="flex-1 min-w-0">
              <div className="overflow-hidden rounded-2xl bg-[#FFFEFA] shadow-sm">
                {/* En-tête tableau */}
                <div className="grid grid-cols-[1fr,100px,120px,80px,40px] gap-4 border-b border-[#D5CDE2] px-6 py-3 text-xs font-semibold uppercase tracking-wide text-[#7C67B2]">
                  <span>Article</span>
                  <span className="text-center">Prix unitaire</span>
                  <span className="text-center">Quantité</span>
                  <span className="text-center">Total</span>
                  <span />
                </div>

                {/* Lignes */}
                {items.map((item) => {
                  const isPack = item.pack != null
                  const image = mediaUrl(isPack ? item.pack!.illustration : item.activity?.photourl ?? null)
                  const price = isPack ? Number(item.pack!.tarification) : Number(item.activity?.credit_price ?? 0)
                  const title = isPack ? item.pack!.title : item.activity?.title ?? "Activité"
                  const ageMin = isPack ? item.pack!.min_age : item.activity?.agemin
                  const ageMax = isPack ? item.pack!.max_age : item.activity?.agemax
                  return (
                    <div
                      key={item.id}
                      className="grid grid-cols-[1fr,100px,120px,80px,40px] items-center gap-4 border-b border-[#D5CDE2]/50 px-6 py-4 last:border-0"
                    >
                      {/* Article */}
                      <div className="flex items-center gap-3">
                        {image ? (
                          <img src={image} alt={title} className="h-16 w-16 shrink-0 rounded-xl object-cover" />
                        ) : (
                          <div className="h-16 w-16 shrink-0 rounded-xl bg-[#D5CDE2]" />
                        )}
                        <div>
                          <p className="font-bold text-[#273068]">{title}</p>
                          <p className="mt-0.5 text-xs text-[#7C67B2]">
                            {isPack && item.pack!.activities_count != null && `• ${item.pack!.activities_count} activités`}
                            {!isPack && item.activity?.duration != null && `• ${item.activity.duration} min`}
                            {ageMin != null && ageMax != null && ` • ${ageMin} - ${ageMax} ans`}
                          </p>
                        </div>
                      </div>

                      {/* Prix unitaire */}
                      <p className="text-center text-sm font-semibold text-[#273068]">
                        {price > 0 ? formatPrice(price) : "—"}
                      </p>

                      {/* Quantité */}
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => updateQty(item, -1)}
                          disabled={updating === item.id || item.quantity <= 1}
                          className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#D5CDE2] text-[#273068] hover:bg-[#c5bbd2] disabled:opacity-40"
                        >
                          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <line x1="5" y1="12" x2="19" y2="12" />
                          </svg>
                        </button>
                        <span className="w-6 text-center text-sm font-bold text-[#273068]">{item.quantity}</span>
                        <button
                          onClick={() => updateQty(item, +1)}
                          disabled={updating === item.id}
                          className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#D5CDE2] text-[#273068] hover:bg-[#c5bbd2] disabled:opacity-40"
                        >
                          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                          </svg>
                        </button>
                      </div>

                      {/* Total */}
                      <p className="text-center text-sm font-black text-[#E94E6F]">
                        {formatPrice(price * item.quantity)}
                      </p>

                      {/* Supprimer */}
                      <button
                        onClick={() => removeItem(item.id)}
                        disabled={removing === item.id}
                        className="flex items-center justify-center text-[#D5CDE2] transition hover:text-[#E94E6F] disabled:opacity-40"
                        aria-label="Supprimer"
                      >
                        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                          <path d="M10 11v6M14 11v6" />
                          <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                        </svg>
                      </button>
                    </div>
                  )
                })}
              </div>

              {/* Actions bas tableau */}
              <div className="mt-4 flex items-center justify-between">
                <Link
                  to="/packs"
                  className="flex items-center gap-2 rounded-xl bg-[#D5CDE2] px-5 py-2.5 text-sm font-semibold text-[#273068] hover:bg-[#c5bbd2]"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
                  </svg>
                  Continuer mes achats
                </Link>
                <button
                  onClick={clearCart}
                  className="flex items-center gap-2 rounded-xl bg-[#D5CDE2] px-5 py-2.5 text-sm font-semibold text-[#273068] hover:bg-[#c5bbd2] hover:text-[#E94E6F]"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                  </svg>
                  Vider le panier
                </button>
              </div>
            </div>

            {/* ── COLONNE DROITE ── */}
            <div className="w-full lg:w-[340px] lg:shrink-0 space-y-4">

              {/* Récapitulatif */}
              <div className="rounded-2xl bg-[#FFFEFA] p-6 shadow-sm">
                <h2 className="mb-5 text-lg font-black text-[#7C67B2]">Récapitulatif</h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-[#273068]">
                    <span>Sous-total ({items.reduce((s, i) => s + i.quantity, 0)} articles)</span>
                    <span className="font-semibold">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-[#273068]">
                    <span>Frais de livraison</span>
                    <span className="font-semibold">0,00€</span>
                  </div>
                </div>

                <div className="my-4 border-t border-[#D5CDE2]" />

                <div className="flex justify-between">
                  <span className="font-black text-[#7C67B2]">Total TTC</span>
                  <span className="text-xl font-black text-[#E94E6F]">{formatPrice(subtotal)}</span>
                </div>

                {/* Badge sécurisé */}
                <div className="mt-4 flex items-center gap-3 rounded-xl bg-[#F0F7D1] px-4 py-3">
                  <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0 text-[#7C67B2]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  <div>
                    <p className="text-xs font-bold text-[#273068]">Paiement 100% sécurisé</p>
                    <p className="text-[10px] leading-4 text-[#273068]/70">Vos données sont protégées et vos paiements 100% sécurisés</p>
                  </div>
                </div>

                {checkoutError && (
                  <div className="mt-4 rounded-xl bg-[#F1B9C3] px-4 py-3 text-sm font-semibold text-[#E94E6F]">{checkoutError}</div>
                )}

                <button
                  onClick={handleCheckout}
                  className="mt-5 w-full rounded-xl bg-[#E94E6F] py-3 text-sm font-black text-white transition hover:bg-[#d63f5f]"
                >
                  Payer
                </button>
              </div>

              {/* Besoin d'aide */}
              <div className="flex items-center gap-4 rounded-2xl bg-[#FFFEFA] p-5 shadow-sm">
                <img src={besoinAideImg} alt="" aria-hidden className="h-20 w-20 shrink-0 object-contain" />
                <div>
                  <p className="font-black text-[#273068]">Besoin d'aide ?</p>
                  <p className="mt-1 text-xs leading-5 text-[#273068]">Notre équipe est là pour vous accompagner.</p>
                  <Link
                    to="/contact"
                    className="mt-3 inline-block rounded-lg bg-[#D5CDE2] px-4 py-1.5 text-xs font-bold text-[#273068] hover:bg-[#c5bbd2]"
                  >
                    Nous contacter
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── VOUS AIMEREZ PEUT-ÊTRE AUSSI ── */}
        {suggestions.length > 0 && (
          <section className="mt-16">
            <h2 className="mb-6 text-2xl font-black text-[#7C67B2]">Vous aimerez peut-être aussi</h2>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {suggestions.map((pack) => {
                const img = mediaUrl(pack.illustration)
                return (
                  <Link
                    key={pack.idpack}
                    to={`/packs/${pack.idpack}`}
                    className="min-w-[200px] max-w-[200px] shrink-0 overflow-hidden rounded-2xl bg-[#FFFEFA] shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                  >
                    {img ? (
                      <img src={img} alt={pack.title} className="h-32 w-full object-cover" />
                    ) : (
                      <div className="h-32 w-full bg-[#D5CDE2]" />
                    )}
                    <div className="p-4">
                      <p className="text-xs font-bold uppercase text-[#7C67B2]">
                        {pack.activities_count != null && `${pack.activities_count} activités`}
                        {pack.min_age != null && pack.max_age != null && ` • ${pack.min_age} - ${pack.max_age} ans`}
                      </p>
                      <h3 className="mt-1 font-black leading-snug text-[#273068]">{pack.title}</h3>
                      <p className="mt-2 text-lg font-black text-[#E94E6F]">{formatPrice(pack.tarification)}</p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        )}

        {/* ── BANDE RÉASSURANCE ── */}
        <div className="mt-14 grid gap-4 rounded-3xl bg-[#D5CDE2] px-8 py-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              bg: "bg-[#7C67B2]",
              icon: (
                <svg viewBox="0 0 24 24" className="h-8 w-8 text-white" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z" /><polyline points="13 2 13 9 20 9" />
                </svg>
              ),
              title: "Accès immédiat",
              desc: "Accédez à vos contenus dès la commande validée.",
            },
            {
              bg: "bg-[#6F8D4C]",
              icon: (
                <svg viewBox="0 0 24 24" className="h-8 w-8 text-white" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              ),
              title: "Paiement sécurisé",
              desc: "Transactions 100% sécurisées.",
            },
            {
              bg: "bg-[#F4BB48]",
              icon: (
                <svg viewBox="0 0 24 24" className="h-8 w-8 text-white" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                </svg>
              ),
              title: "Satisfaction garantie",
              desc: "14 jours pour changer d'avis.",
            },
            {
              bg: "bg-[#E94E6F]",
              icon: (
                <svg viewBox="0 0 24 24" className="h-8 w-8 text-white" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.07 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z" />
                </svg>
              ),
              title: "Support réactif",
              desc: "Notre équipe vous répond en 24h.",
            },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-4">
              <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${item.bg} shadow-sm`}>
                {item.icon}
              </div>
              <div>
                <p className="font-black text-[#273068]">{item.title}</p>
                <p className="mt-1 text-xs leading-5 text-[#273068]">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
