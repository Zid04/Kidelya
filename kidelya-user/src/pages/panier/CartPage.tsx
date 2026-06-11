import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import api from "@/api/axios"
import { useAuth } from "@/context/useAuth"
import { mediaUrl, formatPrice } from "@/utils/media"
import panierImg from "@/assets/panier.png"
import besoinAideImg from "@/assets/besoinAide.png"

type CartItem = {
  id: number
  idpack: number
  quantity: number
  pack: {
    idpack: number
    title: string
    tarification: number | string
    illustration: string | null
    activities_count?: number
    min_age?: number | null
    max_age?: number | null
  }
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

  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.pack.tarification) * item.quantity,
    0
  )

  useEffect(() => {
    if (!user) { navigate("/login"); return }

    Promise.all([
      api.get("/cart"),
      api.get("/public/packs?per_page=8"),
    ])
      .then(([cartRes, packsRes]) => {
        setItems(cartRes.data.data ?? cartRes.data ?? [])
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
    try {
      const res = await api.post("/stripe/checkout", { pack_id: items[0].pack.idpack })
      window.location.href = res.data.url
    } catch {
      setCheckoutError("Erreur lors du paiement. Veuillez réessayer.")
    }
  }

  if (loading) return (
    <div className="flex min-h-[60vh] items-center justify-center text-[#6F8D4C]">
      Chargement du panier…
    </div>
  )

  return (
    <div className="min-h-screen bg-white text-[#21164F]">
      <div className="mx-auto max-w-7xl px-6 py-10">

        {/* ── HERO ── */}
        <div className="mb-10 flex items-center justify-between gap-6 rounded-3xl bg-white px-8 py-8 border border-gray-100 shadow-sm">
          <div>
            <h1 className="text-4xl font-black text-[#2F236D]">Votre panier</h1>
            <p className="mt-2 max-w-sm text-sm leading-6 text-[#6F8D4C]">
              Vous êtes à un clic de belles activités !<br />
              vérifiez vos articles et finaliser votre commande.
            </p>
          </div>
          <img src={panierImg} alt="" aria-hidden className="h-32 w-auto shrink-0 object-contain" />
        </div>

        {items.length === 0 ? (
          /* ── PANIER VIDE ── */
          <div className="flex flex-col items-center gap-6 py-20 text-center">
            <svg viewBox="0 0 24 24" className="h-16 w-16 text-gray-300" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61H19a2 2 0 001.99-1.74L22 6H6" />
            </svg>
            <p className="text-lg font-semibold text-gray-400">Votre panier est vide</p>
            <Link to="/packs" className="rounded-xl bg-[#E94E6F] px-6 py-3 text-sm font-bold text-white hover:bg-[#d63f5f]">
              Découvrir les packs
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start">

            {/* ── TABLEAU ARTICLES ── */}
            <div className="flex-1 min-w-0">
              <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                {/* En-tête tableau */}
                <div className="grid grid-cols-[1fr,100px,120px,80px,40px] gap-4 border-b border-gray-100 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  <span>Article</span>
                  <span className="text-center">Prix unitaire</span>
                  <span className="text-center">Quantité</span>
                  <span className="text-center">Total</span>
                  <span />
                </div>

                {/* Lignes */}
                {items.map((item) => {
                  const image = mediaUrl(item.pack.illustration)
                  const price = Number(item.pack.tarification)
                  return (
                    <div
                      key={item.id}
                      className="grid grid-cols-[1fr,100px,120px,80px,40px] items-center gap-4 border-b border-gray-50 px-6 py-4 last:border-0"
                    >
                      {/* Article */}
                      <div className="flex items-center gap-3">
                        {image ? (
                          <img src={image} alt={item.pack.title} className="h-16 w-16 shrink-0 rounded-xl object-cover" />
                        ) : (
                          <div className="h-16 w-16 shrink-0 rounded-xl bg-gray-100" />
                        )}
                        <div>
                          <p className="font-bold text-[#2F236D]">{item.pack.title}</p>
                          <p className="mt-0.5 text-xs text-[#6F8D4C]">
                            {item.pack.activities_count != null && `• ${item.pack.activities_count} activités`}
                            {item.pack.min_age != null && item.pack.max_age != null && ` • ${item.pack.min_age} - ${item.pack.max_age} ans`}
                          </p>
                        </div>
                      </div>

                      {/* Prix unitaire */}
                      <p className="text-center text-sm font-semibold text-[#2F236D]">
                        {formatPrice(price)}
                      </p>

                      {/* Quantité */}
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => updateQty(item, -1)}
                          disabled={updating === item.id || item.quantity <= 1}
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 text-[#2F236D] hover:bg-gray-50 disabled:opacity-40"
                        >
                          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <line x1="5" y1="12" x2="19" y2="12" />
                          </svg>
                        </button>
                        <span className="w-6 text-center text-sm font-bold text-[#2F236D]">{item.quantity}</span>
                        <button
                          onClick={() => updateQty(item, +1)}
                          disabled={updating === item.id}
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 text-[#2F236D] hover:bg-gray-50 disabled:opacity-40"
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
                        className="flex items-center justify-center text-gray-300 transition hover:text-[#E94E6F] disabled:opacity-40"
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
                  className="flex items-center gap-2 rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-[#273068] hover:bg-gray-50"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
                  </svg>
                  Continuer mes achats
                </Link>
                <button
                  onClick={clearCart}
                  className="flex items-center gap-2 rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-400 hover:bg-gray-50 hover:text-[#E94E6F]"
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
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <h2 className="mb-5 text-lg font-black text-[#2F236D]">Récapitulatif</h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-gray-500">
                    <span>Sous-total ({items.reduce((s, i) => s + i.quantity, 0)} articles)</span>
                    <span className="font-semibold text-[#2F236D]">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Frais de livraison</span>
                    <span className="font-semibold text-[#2F236D]">0,00€</span>
                  </div>
                </div>

                <div className="my-4 border-t border-gray-100" />

                <div className="flex justify-between">
                  <span className="font-black text-[#2F236D]">Total TTC</span>
                  <span className="text-xl font-black text-[#E94E6F]">{formatPrice(subtotal)}</span>
                </div>

                {/* Badge sécurisé */}
                <div className="mt-4 flex items-center gap-3 rounded-xl bg-[#F6FBF4] px-4 py-3">
                  <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0 text-[#6F8D4C]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  <div>
                    <p className="text-xs font-bold text-[#2F236D]">Paiement 100% sécurisé</p>
                    <p className="text-[10px] leading-4 text-gray-400">Vos données sont protégées et vos paiements 100% sécurisés</p>
                  </div>
                </div>

                {checkoutError && (
                  <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">{checkoutError}</div>
                )}

                <button
                  onClick={handleCheckout}
                  className="mt-5 w-full rounded-xl bg-[#E94E6F] py-3 text-sm font-black text-white transition hover:bg-[#d63f5f]"
                >
                  Payer
                </button>
              </div>

              {/* Besoin d'aide */}
              <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <img src={besoinAideImg} alt="" aria-hidden className="h-20 w-20 shrink-0 object-contain" />
                <div>
                  <p className="font-black text-[#2F236D]">Besoin d'aide ?</p>
                  <p className="mt-1 text-xs leading-5 text-gray-400">Notre équipe est là pour vous accompagner.</p>
                  <Link
                    to="/contact"
                    className="mt-3 inline-block rounded-lg border border-[#273068] px-4 py-1.5 text-xs font-bold text-[#273068] hover:bg-[#F5F0FF]"
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
            <h2 className="mb-6 text-2xl font-black text-[#2F236D]">Vous aimerez peut-être aussi</h2>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {suggestions.map((pack) => {
                const img = mediaUrl(pack.illustration)
                return (
                  <Link
                    key={pack.idpack}
                    to={`/packs/${pack.idpack}`}
                    className="min-w-[200px] max-w-[200px] shrink-0 overflow-hidden rounded-2xl border border-[#F1D9B5] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                  >
                    {img ? (
                      <img src={img} alt={pack.title} className="h-32 w-full object-cover" />
                    ) : (
                      <div className="h-32 w-full bg-gray-100" />
                    )}
                    <div className="p-4">
                      <p className="text-xs font-bold uppercase text-gray-400">
                        {pack.activities_count != null && `${pack.activities_count} activités`}
                        {pack.min_age != null && pack.max_age != null && ` • ${pack.min_age} - ${pack.max_age} ans`}
                      </p>
                      <h3 className="mt-1 font-black leading-snug text-[#2F236D]">{pack.title}</h3>
                      <p className="mt-2 text-lg font-black text-[#E94E6F]">{formatPrice(pack.tarification)}</p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        )}

        {/* ── BANDE RÉASSURANCE ── */}
        <div className="mt-14 grid gap-4 rounded-3xl bg-[#F7F3EE] px-8 py-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: (
                <svg viewBox="0 0 24 24" className="h-8 w-8 text-[#7C5CBF]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              ),
              title: "Téléchargement immédiat",
              desc: "Accédez à vos fichiers dès la commande validée.",
            },
            {
              icon: (
                <svg viewBox="0 0 24 24" className="h-8 w-8 text-[#6F8D4C]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              ),
              title: "Paiement sécurisé",
              desc: "Transactions 100% sécurisées.",
            },
            {
              icon: (
                <svg viewBox="0 0 24 24" className="h-8 w-8 text-[#E98B2A]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                </svg>
              ),
              title: "Satisfaction garantie",
              desc: "14 jours pour changer d'avis.",
            },
            {
              icon: (
                <svg viewBox="0 0 24 24" className="h-8 w-8 text-[#E94E6F]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.07 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z" />
                </svg>
              ),
              title: "Support réactif",
              desc: "Notre équipe vous répond en 24h.",
            },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm">
                {item.icon}
              </div>
              <div>
                <p className="font-black text-[#2F236D]">{item.title}</p>
                <p className="mt-1 text-xs leading-5 text-[#6F8D4C]">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
