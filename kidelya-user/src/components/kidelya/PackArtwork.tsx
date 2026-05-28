import { cn } from "@/utils/cn"

const palettes = [
  {
    bg: "from-[#CDE8A9] to-[#F7E9A7]",
    main: "bg-[#7FB24C]",
    accent: "bg-[#E94E6F]",
    soft: "bg-[#FDC600]",
  },
  {
    bg: "from-[#FFE3A6] to-[#FFF4CC]",
    main: "bg-[#F6B83F]",
    accent: "bg-[#8F6BC8]",
    soft: "bg-white",
  },
  {
    bg: "from-[#FFD0D8] to-[#FFF0F2]",
    main: "bg-[#E94E6F]",
    accent: "bg-[#FDC600]",
    soft: "bg-[#6F8D4C]",
  },
  {
    bg: "from-[#CBB9EA] to-[#F2EAFD]",
    main: "bg-[#8F6BC8]",
    accent: "bg-[#FDC600]",
    soft: "bg-[#E94E6F]",
  },
  {
    bg: "from-[#BEE4F1] to-[#EAF8FD]",
    main: "bg-[#78B7D0]",
    accent: "bg-[#E94E6F]",
    soft: "bg-white",
  },
]

function hashText(value: string) {
  return value.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
}

export function getPackPalette(title: string) {
  return palettes[hashText(title) % palettes.length]
}

export function PackArtwork({
  title,
  className,
  compact = false,
}: {
  title: string
  className?: string
  compact?: boolean
}) {
  const palette = getPackPalette(title)

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-gradient-to-br",
        palette.bg,
        compact ? "h-40" : "h-72",
        className
      )}
      aria-hidden="true"
    >
      <div className={cn("absolute rounded-full blur-[1px]", palette.main, compact ? "left-8 top-8 h-20 w-20" : "left-14 top-14 h-32 w-32")} />
      <div className={cn("absolute rounded-full", palette.accent, compact ? "right-8 top-9 h-12 w-12" : "right-16 top-16 h-20 w-20")} />
      <div className={cn("absolute rounded-full", palette.soft, compact ? "bottom-8 left-16 h-10 w-10" : "bottom-16 left-28 h-16 w-16")} />

      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-[#6F8D4C]/35" />
      <div className="absolute bottom-4 left-1/2 h-16 w-5 -translate-x-1/2 rounded-full bg-[#6F8D4C]" />
      <div className={cn("absolute bottom-12 left-1/2 h-12 w-12 -translate-x-1/2 rounded-full", palette.accent)} />
      <div className={cn("absolute bottom-[4.5rem] left-[44%] h-10 w-10 rounded-full", palette.soft)} />
      <div className={cn("absolute bottom-[4.5rem] right-[42%] h-10 w-10 rounded-full", palette.soft)} />

      <span className="absolute bottom-4 right-4 rounded-full bg-white/80 px-3 py-1 text-xs font-bold text-[#93197D] shadow-sm">
        Kidelya
      </span>
    </div>
  )
}
