import { useEffect, useState } from "react"
import api from "@/api/axios"

export function useFavorites() {
  const [favActivityIds, setFavActivityIds] = useState<Set<number>>(new Set())
  const [favPackIds,     setFavPackIds]     = useState<Set<number>>(new Set())

  useEffect(() => {
    api.get("/favorites")
      .then(res => {
        const data: Array<{ idactivity: number | null; idpack: number | null }> = res.data.data ?? []
        setFavActivityIds(new Set(data.filter(f => f.idactivity).map(f => f.idactivity as number)))
        setFavPackIds(    new Set(data.filter(f => f.idpack).map(f => f.idpack as number)))
      })
      .catch(() => {})
  }, [])

  async function toggleActivity(id: number, e?: React.MouseEvent) {
    e?.stopPropagation()
    e?.preventDefault()
    const isFav = favActivityIds.has(id)
    setFavActivityIds(prev => { const n = new Set(prev); isFav ? n.delete(id) : n.add(id); return n })
    try {
      if (isFav) await api.delete("/favorites/remove", { data: { idactivity: id } })
      else        await api.post("/favorites/add",      { idactivity: id })
    } catch {
      setFavActivityIds(prev => { const n = new Set(prev); isFav ? n.add(id) : n.delete(id); return n })
    }
  }

  async function togglePack(id: number, e?: React.MouseEvent) {
    e?.stopPropagation()
    e?.preventDefault()
    const isFav = favPackIds.has(id)
    setFavPackIds(prev => { const n = new Set(prev); isFav ? n.delete(id) : n.add(id); return n })
    try {
      if (isFav) await api.delete("/favorites/remove", { data: { idpack: id } })
      else        await api.post("/favorites/add",      { idpack: id })
    } catch {
      setFavPackIds(prev => { const n = new Set(prev); isFav ? n.add(id) : n.delete(id); return n })
    }
  }

  return { favActivityIds, favPackIds, toggleActivity, togglePack }
}
