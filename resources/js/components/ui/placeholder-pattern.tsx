import { useId } from "react"

interface PlaceholderPatternProps {
  className?: string
}

export function PlaceholderPattern({ className }: PlaceholderPatternProps) {
  const patternId = useId()

  return (
    <svg className={className} fill="none" aria-hidden="true">
      <defs>
        <pattern
          id={patternId}
          x="0"
          y="0"
          width="10"
          height="10"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M-3 13 15-5M-5 5l18-18M-1 21 17 3"
            stroke="#FDC600"
            strokeWidth="1"
            opacity="0.4"
          />
        </pattern>
      </defs>

      <rect
        width="100%"
        height="100%"
        fill={`url(#${patternId})`}
        stroke="none"
      />
    </svg>
  )
}
