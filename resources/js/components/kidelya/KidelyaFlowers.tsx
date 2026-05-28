export function FlowerTopLeft({ className = '' }: { className?: string }) {
  return (
    <div className={`absolute top-0 left-0 pointer-events-none overflow-hidden ${className}`}>
      <svg width="300" height="300" viewBox="0 0 300 300" fill="none">

        {/* Fleur bleue */}
        <circle cx="60" cy="80" r="35" fill="#0094A8" opacity="0.9"/>
        <circle cx="60" cy="45" r="12" fill="#0094A8" opacity="0.8"/>
        <circle cx="60" cy="115" r="12" fill="#0094A8" opacity="0.8"/>
        <circle cx="25" cy="80" r="12" fill="#0094A8" opacity="0.8"/>
        <circle cx="95" cy="80" r="12" fill="#0094A8" opacity="0.8"/>
        <circle cx="60" cy="80" r="8" fill="#FAF7F0"/>

        {/* Fleur rose */}
        <circle cx="150" cy="40" r="25" fill="#E94E6F" opacity="0.85"/>
        <circle cx="150" cy="15" r="9" fill="#E94E6F" opacity="0.75"/>
        <circle cx="150" cy="65" r="9" fill="#E94E6F" opacity="0.75"/>
        <circle cx="125" cy="40" r="9" fill="#E94E6F" opacity="0.75"/>
        <circle cx="175" cy="40" r="9" fill="#E94E6F" opacity="0.75"/>
        <circle cx="150" cy="40" r="6" fill="#FAF7F0"/>

        {/* Fleur jaune */}
        <circle cx="30" cy="200" r="20" fill="#FDC600" opacity="0.9"/>
        <circle cx="30" cy="180" r="7" fill="#FDC600" opacity="0.8"/>
        <circle cx="30" cy="220" r="7" fill="#FDC600" opacity="0.8"/>
        <circle cx="10" cy="200" r="7" fill="#FDC600" opacity="0.8"/>
        <circle cx="50" cy="200" r="7" fill="#FDC600" opacity="0.8"/>
        <circle cx="30" cy="200" r="5" fill="#FAF7F0"/>

        {/* Feuilles */}
        <ellipse cx="100" cy="160" rx="15" ry="8" fill="#6F8D4C" opacity="0.8" transform="rotate(-30 100 160)"/>
        <ellipse cx="80" cy="140" rx="12" ry="6" fill="#6F8D4C" opacity="0.7" transform="rotate(20 80 140)"/>

      </svg>
    </div>
  )
}
