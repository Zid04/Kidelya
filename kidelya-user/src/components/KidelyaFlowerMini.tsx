type Props = {
  size?: number
  className?: string
}

export function KidelyaFlowerMini({ size = 26, className }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <g transform="translate(32 32)">
        <path
          d="M0 -15C5 -15 9 -11 9 -6C9 0 4 6 0 10C-4 6 -9 0 -9 -6C-9 -11 -5 -15 0 -15Z"
          fill="#E94E6F"
        />
        <path
          d="M11 -4C11 2 6 8 0 8C-6 8 -11 2 -11 -4C-11 -10 -6 -15 0 -15C6 -15 11 -10 11 -4Z"
          fill="#E94E6F"
          opacity="0.92"
        />
        <path
          d="M-11 -4C-11 2 -6 8 0 8C6 8 11 2 11 -4C11 -10 6 -15 0 -15C-6 -15 -11 -10 -11 -4Z"
          fill="#E94E6F"
          opacity="0.8"
        />
        <circle cx="0" cy="0" r="5" fill="#FAF7F0" />
        <path
          d="M0 -22C3 -20 6 -17 8 -12C6 -13 4 -14 0 -14C-4 -14 -6 -13 -8 -12C-6 -17 -3 -20 0 -22Z"
          fill="#FDC600"
          opacity="0.85"
        />
      </g>
    </svg>
  )
}
